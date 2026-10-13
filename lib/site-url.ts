const productionOrigin = 'https://shaheers-portfolio-nine.vercel.app'

export function getSiteUrl(): URL {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  const origin = configuredUrl || productionOrigin

  try {
    return new URL(origin)
  } catch {
    throw new Error('NEXT_PUBLIC_SITE_URL must be a valid absolute URL.')
  }
}
