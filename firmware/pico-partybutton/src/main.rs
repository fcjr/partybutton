#![no_std]
#![no_main]

use cyw43::{JoinOptions, aligned_bytes};
use cyw43_pio::{DEFAULT_CLOCK_DIVIDER, PioSpi};
use defmt::*;
use embassy_executor::Spawner;
use embassy_net::dns::DnsSocket;
use embassy_net::tcp::client::{TcpClient, TcpClientState};
use embassy_net::{Config, Stack, StackResources};
use embassy_rp::clocks::RoscRng;
use embassy_rp::gpio::{Input, Level, Output, Pull};
use embassy_rp::peripherals::{DMA_CH0, PIO0};
use embassy_rp::pio::{InterruptHandler, Pio};
use embassy_rp::{bind_interrupts, dma};
use embassy_time::{Duration, Timer};
use reqwless::client::{HttpClient, TlsConfig, TlsVerify};
use reqwless::request::{Method, RequestBuilder};
use serde::Deserialize;
use serde_json_core::from_slice;
use static_cell::StaticCell;
use {defmt_rtt as _, panic_probe as _};

bind_interrupts!(struct Irqs {
    PIO0_IRQ_0 => InterruptHandler<PIO0>;
    DMA_IRQ_0 => dma::InterruptHandler<DMA_CH0>;
});

// Baked in at build time from the repo-root .env (see build.rs).
const WIFI_SSID: &str = env!("WIFI_SSID");
const WIFI_PASSWORD: &str = env!("WIFI_PASSWORD");
const PARTY_URL: &str = concat!(env!("PARTY_API_BASE"), "/api/v1/party");
const AUTH_HEADER: &str = concat!("Bearer ", env!("PARTY_API_KEY"));

#[derive(Deserialize)]
struct PartyState {
    party: bool,
}

#[embassy_executor::task]
async fn cyw43_task(
    runner: cyw43::Runner<'static, cyw43::SpiBus<Output<'static>, PioSpi<'static, PIO0, 0>>>,
) -> ! {
    runner.run().await
}

#[embassy_executor::task]
async fn net_task(mut runner: embassy_net::Runner<'static, cyw43::NetDriver<'static>>) -> ! {
    runner.run().await
}

#[embassy_executor::main]
async fn main(spawner: Spawner) {
    let p = embassy_rp::init(Default::default());
    let mut rng = RoscRng;

    let fw = aligned_bytes!("../cyw43-firmware/43439A0.bin");
    let clm = aligned_bytes!("../cyw43-firmware/43439A0_clm.bin");
    let nvram = aligned_bytes!("../cyw43-firmware/nvram_rp2040.bin");

    let pwr = Output::new(p.PIN_23, Level::Low);
    let cs = Output::new(p.PIN_25, Level::High);
    let mut pio = Pio::new(p.PIO0, Irqs);
    let spi = PioSpi::new(
        &mut pio.common,
        pio.sm0,
        DEFAULT_CLOCK_DIVIDER,
        pio.irq0,
        cs,
        p.PIN_24,
        p.PIN_29,
        dma::Channel::new(p.DMA_CH0, Irqs),
    );

    static STATE: StaticCell<cyw43::State> = StaticCell::new();
    let state = STATE.init(cyw43::State::new());
    let (net_device, mut control, runner) = cyw43::new(state, pwr, spi, fw, nvram).await;
    spawner.spawn(unwrap!(cyw43_task(runner)));

    control.init(clm).await;
    control
        .set_power_management(cyw43::PowerManagementMode::PowerSave)
        .await;

    let config = Config::dhcpv4(Default::default());
    let seed = rng.next_u64();

    static RESOURCES: StaticCell<StackResources<5>> = StaticCell::new();
    let (stack, runner) = embassy_net::new(net_device, config, RESOURCES.init(StackResources::new()), seed);
    spawner.spawn(unwrap!(net_task(runner)));

    info!("joining wifi network {}", WIFI_SSID);
    while let Err(_err) = control
        .join(WIFI_SSID, JoinOptions::new(WIFI_PASSWORD.as_bytes()))
        .await
    {
        warn!("wifi join failed, retrying");
    }

    info!("waiting for DHCP...");
    stack.wait_config_up().await;
    info!("network up, ready");

    let mut button = Input::new(p.PIN_2, Pull::Up);
    let mut applied: Option<bool> = None;

    loop {
        // Pulled to ground (low) => party ON. Released (high) => party OFF.
        let desired = button.is_low();

        if applied != Some(desired) {
            match reconcile(stack, desired).await {
                Ok(()) => {
                    control.gpio_set(0, desired).await; // onboard LED mirrors party mode
                    applied = Some(desired);
                    info!("party mode {}", if desired { "ON" } else { "OFF" });
                }
                Err(()) => {
                    warn!("failed to sync party mode, retrying");
                    Timer::after(Duration::from_secs(2)).await;
                    continue;
                }
            }
        }

        button.wait_for_any_edge().await;
        Timer::after(Duration::from_millis(30)).await; // debounce
    }
}

/// Make the API's party state match `desired_on`. The API only exposes a
/// *toggle*, so we read the current state and toggle only if it differs.
async fn reconcile(stack: Stack<'static>, desired_on: bool) -> Result<(), ()> {
    let mut rx = [0u8; 4096];
    let mut tls_read = [0u8; 16640];
    let mut tls_write = [0u8; 16640];

    let client_state = TcpClientState::<1, 4096, 4096>::new();
    let tcp = TcpClient::new(stack, &client_state);
    let dns = DnsSocket::new(stack);
    let tls = TlsConfig::new(RoscRng.next_u64(), &mut tls_read, &mut tls_write, TlsVerify::None);
    let mut client = HttpClient::new_with_tls(&tcp, &dns, tls);

    let current = {
        let mut req = client.request(Method::GET, PARTY_URL).await.map_err(|_| ())?;
        let resp = req.send(&mut rx).await.map_err(|_| ())?;
        let body = resp.body().read_to_end().await.map_err(|_| ())?;
        let (parsed, _) = from_slice::<PartyState>(body).map_err(|_| ())?;
        parsed.party
    };

    if current == desired_on {
        return Ok(());
    }

    let headers = [("Authorization", AUTH_HEADER)];
    let mut req = client
        .request(Method::POST, PARTY_URL)
        .await
        .map_err(|_| ())?
        .headers(&headers);
    let resp = req.send(&mut rx).await.map_err(|_| ())?;
    let _ = resp.body().read_to_end().await;
    Ok(())
}
