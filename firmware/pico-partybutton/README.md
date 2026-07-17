# pico-partybutton

Raspberry Pi Pico W firmware (Rust + [Embassy](https://embassy.dev)) that drives
the [party button API](../../README.md) from a physical button.

- Joins wifi (WPA2) using credentials baked in at build time.
- Watches a GPIO button: **pulled to ground → party ON, released → party OFF.**
- The API only exposes a *toggle*, so on every button change the firmware `GET`s
  the current state and only `POST`s (with `Authorization: Bearer <PARTY_KEY>`)
  when it differs — self-correcting if the state drifts.
- The onboard LED mirrors the current party state.

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

## Build & flash

From the repo root, using [`just`](https://github.com/casey/just):

```sh
rustup target add thumbv6m-none-eabi

just flash   # build + flash via a debug probe (probe-rs), streaming defmt logs
just uf2     # or: build a UF2 and deploy to a Pico held in BOOTSEL
```

`just flash` needs `probe-rs` (`cargo install probe-rs-tools`) and a debug probe
(e.g. a second Pico running picoprobe/debugprobe). `just uf2` needs `elf2uf2-rs`
(`cargo install elf2uf2-rs`) and no probe. Requires a recent stable Rust
(edition 2024, i.e. Rust ≥ 1.85).
