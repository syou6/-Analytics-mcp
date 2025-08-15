export default function OrbIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      {/* Main glowing sphere */}
      <defs>
        {/* Radial gradient for sphere */}
        <radialGradient id="sphereGrad" cx="50%" cy="40%">
          <stop offset="0%" style={{ stopColor: '#60E3FF', stopOpacity: 1 }} />
          <stop offset="30%" style={{ stopColor: '#60A5FA', stopOpacity: 0.9 }} />
          <stop offset="60%" style={{ stopColor: '#8B5CF6', stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: '#EC4899', stopOpacity: 0.6 }} />
        </radialGradient>
        
        {/* Glow effect */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Inner structure gradient */}
        <linearGradient id="innerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#00D4FF', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#BD00FF', stopOpacity: 0.8 }} />
        </linearGradient>
      </defs>
      
      {/* Outer glow */}
      <circle cx="256" cy="256" r="240" fill="url(#sphereGrad)" opacity="0.3" filter="url(#glow)"/>
      
      {/* Main sphere */}
      <circle cx="256" cy="256" r="200" fill="url(#sphereGrad)" opacity="0.9"/>
      
      {/* Glass effect overlay */}
      <ellipse cx="256" cy="200" rx="180" ry="120" fill="white" opacity="0.1"/>
      
      {/* Central hexagonal structure */}
      <g transform="translate(256, 256)">
        {/* Outer hexagon */}
        <path d="M-60,-35 L0,-70 L60,-35 L60,35 L0,70 L-60,35 Z" 
              fill="none" 
              stroke="#00D4FF" 
              strokeWidth="3" 
              opacity="0.8"
              filter="url(#glow)"/>
        
        {/* Inner cube */}
        <path d="M-40,-23 L0,-46 L40,-23 L40,23 L0,46 L-40,23 Z" 
              fill="url(#innerGrad)" 
              opacity="0.7"/>
        
        {/* Center diamond */}
        <path d="M-20,0 L0,-20 L20,0 L0,20 Z" 
              fill="#FFFFFF" 
              opacity="0.9"
              filter="url(#glow)"/>
      </g>
      
      {/* Small nodes around */}
      <g opacity="0.7">
        <circle cx="256" cy="100" r="6" fill="#60E3FF" filter="url(#glow)"/>
        <circle cx="380" cy="180" r="5" fill="#BD00FF" filter="url(#glow)"/>
        <circle cx="380" cy="332" r="5" fill="#FF0080" filter="url(#glow)"/>
        <circle cx="256" cy="412" r="6" fill="#60E3FF" filter="url(#glow)"/>
        <circle cx="132" cy="332" r="5" fill="#BD00FF" filter="url(#glow)"/>
        <circle cx="132" cy="180" r="5" fill="#FF0080" filter="url(#glow)"/>
        
        {/* More small nodes */}
        <circle cx="200" cy="140" r="3" fill="#00D4FF" opacity="0.6"/>
        <circle cx="312" cy="140" r="3" fill="#00D4FF" opacity="0.6"/>
        <circle cx="350" cy="256" r="3" fill="#BD00FF" opacity="0.6"/>
        <circle cx="162" cy="256" r="3" fill="#BD00FF" opacity="0.6"/>
        <circle cx="200" cy="372" r="3" fill="#FF0080" opacity="0.6"/>
        <circle cx="312" cy="372" r="3" fill="#FF0080" opacity="0.6"/>
      </g>
      
      {/* Connection lines */}
      <g stroke="#60A5FA" strokeWidth="1" opacity="0.3">
        <line x1="256" y1="100" x2="256" y2="160"/>
        <line x1="256" y1="352" x2="256" y2="412"/>
        <line x1="160" y1="256" x2="132" y2="256"/>
        <line x1="352" y1="256" x2="380" y2="256"/>
      </g>
    </svg>
  );
}