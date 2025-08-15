import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
}

export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 120,
          background: 'radial-gradient(circle at 30% 30%, #60a5fa, #8b5cf6, #ec4899)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '36px',
          fontWeight: 'bold',
          boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.3)',
        }}
      >
        G
      </div>
    ),
    {
      ...size,
    }
  )
}