import { randomBytes } from 'crypto';

export function generateOrderNo(prefix: string): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = randomBytes(3).toString('hex').toUpperCase();
  return `${prefix}-${date}-${rand}`;
}
