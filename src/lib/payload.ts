import { getPayload } from 'payload'
import config from '@payload-config'

let _payload: Awaited<ReturnType<typeof getPayload>> | null = null

/**
 * Returns a Payload instance.
 * Returns null gracefully if MongoDB is not available —
 * pages should handle null and show empty/static content instead of crashing.
 */
export async function getPayloadClient() {
  if (_payload) return _payload
  try {
    _payload = await getPayload({ config })
    return _payload
  } catch (err) {
    console.warn('[Payload] Could not connect to database. Is MongoDB running?', (err as Error).message)
    return null
  }
}

/**
 * Safe wrapper — always returns empty docs array if DB is unavailable.
 * Use this in Server Components instead of calling payload.find() directly.
 */
export async function safeFind<T = any>(
  collection: string,
  options: Record<string, any> = {}
): Promise<T[]> {
  try {
    const payload = await getPayloadClient()
    if (!payload) return []
    const res = await (payload as any).find({ collection, limit: 50, ...options })
    return res.docs ?? []
  } catch {
    return []
  }
}
