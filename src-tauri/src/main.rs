// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rsa::{RsaPrivateKey, RsaPublicKey, pkcs8::{EncodePublicKey, EncodePrivateKey, LineEnding}};
use serde::{Serialize, Deserialize};
use tauri::State;
use std::time::Instant;

#[derive(Debug, Serialize, Deserialize)]
pub struct KeyPair {
    public_key: String,
    private_key: String,
}

#[derive(Debug, Serialize)]
pub struct GenerationError {
    message: String,
    details: String,
}

mod commands {
    use super::*;

    #[tauri::command]
    pub async fn generate_keypair(bits: u32) -> Result<KeyPair, String> {
        println!("Starting key generation with {} bits", bits); // Debug log
        let start = Instant::now();
        
        // Validate key size
        if ![1024, 2048, 4096].contains(&bits) {
            return Err(format!("Invalid key size: {}. Must be 1024, 2048, or 4096", bits));
        }

        let mut rng = rand::thread_rng();
        
        // Convert bits to usize
        let bits_usize = bits as usize;
        
        // Generate private key
        let private_key = RsaPrivateKey::new(&mut rng, bits_usize)
            .map_err(|e| format!("Failed to generate private key: {}", e))?;
        
        // Get public key
        let public_key = RsaPublicKey::from(&private_key);
        
        // Convert to PEM format with LINE_ENDING
        let private_pem = private_key.to_pkcs8_pem(LineEnding::default())
            .map_err(|e| format!("Failed to convert private key to PEM: {}", e))?
            .to_string();
        
        let public_pem = public_key.to_public_key_pem(LineEnding::default())
            .map_err(|e| format!("Failed to convert public key to PEM: {}", e))?;

        let duration = start.elapsed();
        println!("Key generation completed in {:?}", duration); // Debug log
        
        Ok(KeyPair {
            public_key: public_pem,
            private_key: private_pem,
        })
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![commands::generate_keypair])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}