import { ImageResponse } from 'next/og'

export const alt = 'Shaheer Naeem — Full-Stack & Agentic AI Developer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          padding: '72px',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #07100b 0%, #101b15 58%, #080c0a 100%)',
          color: '#effcf3',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#7cf0a2', fontSize: 22 }}>
          <div
            style={{
              display: 'flex',
              width: 44,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #54d681',
              borderRadius: 12,
              fontSize: 21,
            }}
          >
            {'>_'}
          </div>
          PORTFOLIO / 2026
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 78, fontWeight: 700, letterSpacing: '-5px' }}>
            Shaheer Naeem
          </div>
          <div style={{ color: '#f6c76d', fontSize: 32 }}>
            Full-Stack Developer · Agentic AI Developer
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14, color: '#a7c4b0', fontSize: 22 }}>
          Next.js 16 <span style={{ color: '#f6c76d' }}>/</span> React 19
          <span style={{ color: '#f6c76d' }}>/</span> TypeScript
          <span style={{ color: '#f6c76d' }}>/</span> Tailwind CSS v4
        </div>
      </div>
    ),
    size,
  )
}
