// Tiny seeded PRNG used by mock data generators so the same dataset is produced
// every time the app boots. This keeps screenshots deterministic and prevents
// flicker between renders.

export function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return function rand() {
    s = (s + 0x6d2b79f5) | 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(rand: () => number, items: readonly T[]): T {
  if (items.length === 0) {
    throw new Error('pick called with empty list');
  }
  return items[Math.floor(rand() * items.length)] as T;
}

export function pickN<T>(rand: () => number, items: readonly T[], n: number): T[] {
  const copy = items.slice();
  const out: T[] = [];
  while (copy.length > 0 && out.length < n) {
    const i = Math.floor(rand() * copy.length);
    const [taken] = copy.splice(i, 1);
    if (taken !== undefined) out.push(taken);
  }
  return out;
}

export function range(n: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < n; i += 1) out.push(i);
  return out;
}

export function randomInt(rand: () => number, min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}
