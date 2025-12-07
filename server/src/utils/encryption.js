import crypto from "crypto";
import "dotenv/config";

const keyString = process.env.ENCRYPTION_KEY;

// convert to 32-byte Buffer
const key = Buffer.from(keyString, "hex");

export const encryptSymmetric = (plaintext) => {
  // create a random initialization vector
  const iv = crypto.randomBytes(12).toString("base64");

  // create a cipher object
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  // update the cipher object with the plaintext to encrypt
  let ciphertext = cipher.update(plaintext, "utf8", "base64");

  // finalize the encryption process
  ciphertext += cipher.final("base64");

  // retrieve the authentication tag for the encryption
  const tag = cipher.getAuthTag();

  return { ciphertext, iv, tag };
};

export const decryptSymmetric = (ciphertext, iv, tag) => {
  // create a decipher object
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(key, "base64"),
    Buffer.from(iv, "base64")
  );

  // set the authentication tag for the decipher object
  decipher.setAuthTag(Buffer.from(tag, "base64"));

  // update the decipher object with the base64-encoded ciphertext
  let plaintext = decipher.update(ciphertext, "base64", "utf8");

  // finalize the decryption process
  plaintext += decipher.final("utf8");

  return plaintext;
};
