// src/lib/locker.ts

export function xorCipher(text: string, key: string): string {
  if (!key) return text; // No key, return original text

  let result = "";
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}

// XOR decryption is the same as encryption
export const xorEncrypt = xorCipher;
export const xorDecrypt = xorCipher;
