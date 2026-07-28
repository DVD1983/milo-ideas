interface CacheEntry {
  data: unknown
  expiry: number
}

const store = new Map<string, CacheEntry>()
let seeded = false

export function isSeeded(): boolean {
  return seeded
}

export function markSeeded(): void {
  seeded = true
}

export function getCached<T>(key: string): T | null {
  const entry = store.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiry) {
    store.delete(key)
    return null
  }
  return entry.data as T
}

export function setCache<T>(key: string, data: T, ttlMs = 60000): void {
  store.set(key, { data, expiry: Date.now() + ttlMs })
}

export function clearCache(): void {
  store.clear()
}
