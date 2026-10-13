import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site-url'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl()
  const lastModified = new Date()

  return [
    {
      url: new URL('/', siteUrl).toString(),
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: new URL('/contact', siteUrl).toString(),
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
  ]
}
