firmware_dir := "firmware/pico-partybutton"
elf := firmware_dir / "target/thumbv6m-none-eabi/release/pico-partybutton"

# List available recipes.
default:
    @just --list

# Download the CYW43439 wifi firmware blobs into the firmware crate.
firmware-fetch:
    {{firmware_dir}}/fetch-firmware.sh

# Build the Pico W firmware (release).
firmware-build:
    cd {{firmware_dir}} && cargo build --release

# Flash over USB: hold BOOTSEL while plugging in the Pico, then run this.
# Deploys the firmware to the RPI-RP2 drive — no debug probe needed.
flash: firmware-fetch firmware-build
    elf2uf2-rs -d {{elf}} {{firmware_dir}}/pico-partybutton.uf2

# Build a UF2 file without deploying (copy it onto the RPI-RP2 drive yourself).
uf2: firmware-fetch firmware-build
    elf2uf2-rs {{elf}} {{firmware_dir}}/pico-partybutton.uf2
    @echo "UF2 at {{firmware_dir}}/pico-partybutton.uf2"

# Stream the Pico's logs over USB serial (no probe needed).
monitor:
    #!/usr/bin/env bash
    set -euo pipefail
    port=$(ls /dev/tty.usbmodem* 2>/dev/null | head -n1 || true)
    if [ -z "${port}" ]; then
      echo "No Pico USB serial found (/dev/tty.usbmodem*). Is it plugged in and running?" >&2
      exit 1
    fi
    echo "opening ${port} — quit with ctrl-a k (screen)"
    exec screen "${port}" 115200
