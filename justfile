firmware_dir := "firmware/pico-partybutton"
elf := firmware_dir / "target/thumbv8m.main-none-eabihf/release/pico-partybutton"

# List available recipes.
default:
    @just --list

# Download the CYW43439 wifi firmware blobs into the firmware crate.
firmware-fetch:
    {{firmware_dir}}/fetch-firmware.sh

# Build the Pico 2 W firmware (release).
firmware-build:
    cd {{firmware_dir}} && cargo build --release

# Flash over USB: hold BOOTSEL while plugging in the Pico 2 W, then run this.
# Loads the firmware with picotool and reboots into it — no debug probe needed.
flash: firmware-fetch firmware-build
    picotool load -u -v -x -t elf {{elf}}

# Build a UF2 file without deploying (copy it onto the RP2350 drive yourself).
uf2: firmware-fetch firmware-build
    picotool uf2 convert {{elf}} {{firmware_dir}}/pico-partybutton.uf2
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
