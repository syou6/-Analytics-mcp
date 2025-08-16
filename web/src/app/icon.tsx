import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'linear-gradient(135deg, #7b3ff2 0%, #00d4ff 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '8px',
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '4px',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}