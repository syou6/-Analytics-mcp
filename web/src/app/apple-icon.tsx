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
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at center, #1a0033, #000000)',
          borderRadius: '36px',
          position: 'relative',
        }}
      >
        {/* Glass sphere */}
        <div
          style={{
            width: '140px',
            height: '140px',
            background: 'radial-gradient(circle at 40% 30%, rgba(0,212,255,0.5), rgba(123,63,242,0.4), rgba(233,30,99,0.3))',
            borderRadius: '50%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 40px rgba(123,63,242,0.6), inset 0 -20px 40px rgba(0,0,0,0.3)',
          }}
        >
          {/* Glass reflection */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              width: '60px',
              height: '40px',
              background: 'ellipse at center, rgba(255,255,255,0.2) 0%, transparent 70%',
              borderRadius: '50%',
              filter: 'blur(8px)',
            }}
          />
          {/* Central cube */}
          <div
            style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #00ffff, #7b3ff2, #e91e63)',
              transform: 'rotate(45deg)',
              boxShadow: '0 0 30px rgba(0,255,255,0.8), 0 0 60px rgba(123,63,242,0.5)',
              position: 'relative',
            }}
          >
            {/* Inner glow */}
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                width: '30px',
                height: '30px',
                background: 'rgba(0,255,255,0.8)',
                boxShadow: '0 0 20px rgba(0,255,255,1)',
              }}
            />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}