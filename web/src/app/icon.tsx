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
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at center, #1a0033, #000000)',
          position: 'relative',
        }}
      >
        {/* Glass sphere */}
        <div
          style={{
            width: '24px',
            height: '24px',
            background: 'radial-gradient(circle at 40% 30%, rgba(0,212,255,0.4), rgba(123,63,242,0.3), rgba(233,30,99,0.2))',
            borderRadius: '50%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 10px rgba(123,63,242,0.5)',
          }}
        >
          {/* Central cube */}
          <div
            style={{
              width: '10px',
              height: '10px',
              background: 'linear-gradient(135deg, #00ffff, #7b3ff2)',
              transform: 'rotate(45deg)',
              boxShadow: '0 0 8px rgba(0,255,255,0.8)',
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}