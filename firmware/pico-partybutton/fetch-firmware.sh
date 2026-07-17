#!/usr/bin/env bash
# Downloads the CYW43439 wifi firmware blobs for the Pico W into ./cyw43-firmware.
# These are redistributed by the embassy project under their own license.
set -euo pipefail

dir="$(cd "$(dirname "$0")" && pwd)/cyw43-firmware"
base="https://raw.githubusercontent.com/embassy-rs/embassy/main/cyw43-firmware"

mkdir -p "$dir"
for f in 43439A0.bin 43439A0_clm.bin nvram_rp2040.bin; do
  echo "fetching $f"
  curl -fsSL "$base/$f" -o "$dir/$f"
done
echo "done -> $dir"
