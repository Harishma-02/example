import { randomBytes, createHash } from 'crypto';

export function generateRandomToken(bytes = 64) {
  return randomBytes(bytes).toString('hex'); // long random token
}

export function hashToken(token: string) {
  // SHA-256 hex digest (store this in DB)
  return createHash('sha256').update(token).digest('hex');
}
