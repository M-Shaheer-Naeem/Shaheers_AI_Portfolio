const fallbackOrigin = 'http://localhost:3000'

export function getSiteUrl(): URL {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  const vercelUrl = process.env.VERCEL_URL?.trim()
  const origin = configuredUrl || (vercelUrl ? `https://${vercelUrl}` : fallbackOrigin)

  try {
    return new URL(origin)
  } catch {
    throw new Error('NEXT_PUBLIC_SITE_URL must be a valid absolute URL.')
  }
}
