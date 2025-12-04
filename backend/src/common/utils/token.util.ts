import { randomBytes, createHash } from 'crypto';

export function generateRandomToken(bytes = 64) {
  return randomBytes(bytes).toString('hex'); 
}

export function hashToken(token: string) {

  return createHash('sha256').update(token).digest('hex');
}
