use std::env;
use std::fs;
use std::io::Write;
use std::path::PathBuf;

fn main() {
    // Put `memory.x` in the output dir and on the linker search path.
    let out = PathBuf::from(env::var_os("OUT_DIR").unwrap());
    fs::File::create(out.join("memory.x"))
        .unwrap()
        .write_all(include_bytes!("memory.x"))
        .unwrap();
    println!("cargo:rustc-link-search={}", out.display());
    println!("cargo:rerun-if-changed=memory.x");

    println!("cargo:rustc-link-arg-bins=--nmagic");
    println!("cargo:rustc-link-arg-bins=-Tlink.x");

    // Bake credentials into the firmware from the gitignored repo-root `.env`.
    let manifest = PathBuf::from(env::var_os("CARGO_MANIFEST_DIR").unwrap());
    let root_env = manifest.join("../../.env");

    let mut vars = std::collections::HashMap::new();
    println!("cargo:rerun-if-changed={}", root_env.display());
    if let Ok(contents) = fs::read_to_string(&root_env) {
        for line in contents.lines() {
            let line = line.trim();
            if line.is_empty() || line.starts_with('#') {
                continue;
            }
            let line = line.strip_prefix("export ").unwrap_or(line);
            let Some((k, v)) = line.split_once('=') else {
                continue;
            };
            let v = v.trim().trim_matches('"').trim_matches('\'').to_string();
            vars.insert(k.trim().to_string(), v);
        }
    }

    let take = |k: &str| vars.get(k).cloned();
    let ssid = take("WIFI_SSID").expect("WIFI_SSID missing: set it in the repo-root .env");
    let pass = take("WIFI_PASSWORD").expect("WIFI_PASSWORD missing in .env");
    let key = take("PARTY_API_KEY")
        .or_else(|| take("PARTY_KEY"))
        .expect("PARTY_API_KEY missing in .env");
    let base = take("PARTY_API_BASE").unwrap_or_else(|| "https://partybutton.recurse.com".to_string());

    println!("cargo:rustc-env=WIFI_SSID={ssid}");
    println!("cargo:rustc-env=WIFI_PASSWORD={pass}");
    println!("cargo:rustc-env=PARTY_API_KEY={key}");
    println!("cargo:rustc-env=PARTY_API_BASE={base}");
}
