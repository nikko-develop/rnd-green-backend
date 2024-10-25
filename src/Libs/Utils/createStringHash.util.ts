import crypto from 'crypto';

export function createStringHash(data: string): string | undefined {
  if (data) {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
  }

  return undefined;
}
