import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || '';

export const decryptData = (encryptedText: string): string => {
  // Split the IV and the encrypted data
  const [ivHex, encryptedData] = encryptedText.split(':');

  if (!ivHex || !encryptedData) {
    throw new Error('Invalid encrypted data format');
  }

  // Parse the IV and encryption key
  const iv = CryptoJS.enc.Hex.parse(ivHex);
  const key = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY);

  // Decrypt the data
  const decrypted = CryptoJS.AES.decrypt(
    CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Hex.parse(encryptedData) }),
    key,
    {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    },
  );

  // Convert the decrypted data back to a string
  return decrypted.toString(CryptoJS.enc.Utf8);
};
