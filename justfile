firmware_dir := "firmware/pico-partybutton"

# List available recipes.
default:
    @just --list

# Download the CYW43439 wifi firmware blobs into the firmware crate.
firmware-fetch:
    {{firmware_dir}}/fetch-firmware.sh

# Build the Pico W firmware (release).
firmware-build:
    cd {{firmware_dir}} && cargo build --release

# Flash the Pico W via a debug probe (probe-rs) and stream its defmt logs.
flash: firmware-fetch
    cd {{firmware_dir}} && cargo run --release

# Stream defmt logs from a running Pico via the debug probe (no reflash).
monitor:
    cd {{firmware_dir}} && probe-rs attach --chip RP2040 target/thumbv6m-none-eabi/release/pico-partybutton

# Build a UF2 and deploy it to a Pico held in BOOTSEL (the RPI-RP2 drive).
uf2: firmware-fetch firmware-build
    cd {{firmware_dir}} && elf2uf2-rs -d target/thumbv6m-none-eabi/release/pico-partybutton pico-partybutton.uf2
    @echo "UF2 at {{firmware_dir}}/pico-partybutton.uf2"
