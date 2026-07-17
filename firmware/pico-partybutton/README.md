# pico-partybutton

Raspberry Pi Pico W firmware (Rust + [Embassy](https://embassy.dev)) that drives
the [party button API](../../README.md) from a physical button.

- Joins wifi (WPA2) using credentials baked in at build time.
- Watches a GPIO button: **pulled to ground → party ON, released → party OFF.**
- The API only exposes a *toggle*, so on every button change the firmware `GET`s
  the current state and only `POST`s (with `Authorization: Bearer <PARTY_API_KEY>`)
  when it differs — self-correcting if the state drifts.
- The onboard LED mirrors the current party state.
- Logs stream out the Pico's own USB port (CDC serial) — no debug probe needed.

## Wiring

Wire a switch between **GP2** and **GND**. The internal pull-up holds the pin
high when open; closing it pulls the pin to ground. (Change the
`Input::new(p.PIN_2, …)` line to use a different pin.)

## Configure

Credentials are read at build time from the gitignored repo-root `.env` (see
[`/.env.example`](../../.env.example)) and baked into the binary.

```sh
cp ../../.env.example ../../.env   # then edit WIFI_SSID / WIFI_PASSWORD / PARTY_API_KEY
```

`PARTY_API_KEY` must match the secret set on the Worker (`wrangler secret put PARTY_KEY`).

## Build, flash & monitor

Everything is over USB — no debug probe required. From the repo root, using
[`just`](https://github.com/casey/just):

```sh
rustup target add thumbv6m-none-eabi
cargo install elf2uf2-rs

# Hold the Pico's BOOTSEL button while plugging in USB, then:
just flash     # build + deploy to the RPI-RP2 drive over USB

just monitor   # after it reboots: stream logs over USB serial
```

`just uf2` builds the `.uf2` file without deploying, if you'd rather copy it onto
the RPI-RP2 drive yourself. `just monitor` opens `/dev/tty.usbmodem*` with
`screen` (quit with `ctrl-a k`).

Requires a recent stable Rust (edition 2024, i.e. Rust ≥ 1.85).
