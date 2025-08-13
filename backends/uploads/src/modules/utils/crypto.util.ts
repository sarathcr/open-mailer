import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config();
const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync(process.env.ENCRYPTION_SECRET, 'salt', 32);

if (!key) {
  throw new Error('Encryption key is missing!');
}
/**
 * Derives an Initialization Vector (IV) from a unique identifier.
 * @param identifier - A unique string to derive the IV.
 * @returns A 16-byte Buffer IV.
 */
function deriveIV(identifier: string): Buffer {
  return crypto.createHash('sha256').update(identifier).digest().slice(0, 16);
}

/**
 * Encrypts the given data using a unique identifier as a source for IV.
 * @param data - The string data to encrypt.
 * @param uniqueIdentifier - A unique identifier to derive the IV.
 * @returns The encrypted string.
 */
export function encryptData(data: string, uniqueIdentifier: string): string {
  const iv = deriveIV(uniqueIdentifier);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

/**
 * Decrypts the given encrypted string using a unique identifier as a source for IV.
 * @param encrypted - The encrypted string to decrypt.
 * @param uniqueIdentifier - A unique identifier to derive the IV.
 * @returns The decrypted string.
 */
export function decryptData(
  encrypted: string,
  uniqueIdentifier: string,
): string {
  const iv = deriveIV(uniqueIdentifier);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
