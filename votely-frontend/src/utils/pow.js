export async function solvePow(challenge, difficulty) {
  const zeroBytes = Math.floor(difficulty / 8);
  const zeroBitsRem = difficulty % 8;
  const mask = 0xff << (8 - zeroBitsRem);

  for (let nonce = 0; nonce < 5_000_000; nonce++) {
    const input = challenge + nonce;
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
    const h = new Uint8Array(buf);

    let ok = true;
    for (let i = 0; i < zeroBytes; i++) {
      if (h[i] !== 0) { ok = false; break; }
    }
    if (ok && zeroBitsRem && (h[zeroBytes] & mask) !== 0) ok = false;

    if (ok) return nonce;
  }
  return -1;
}
