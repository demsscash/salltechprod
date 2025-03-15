interface LogoProps {
  id: string; // Pour différencier le logo du header et du footer
}

export default function Logo({ id }: LogoProps) {
  const gradientId = `gradient-${id}`;
  const textClipId = `text-clip-${id}`;
  
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 100" width="200">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3498db">
            <animate attributeName="stop-color" values="#3498db; #4d87c5; #3498db" dur="4.5s" begin="0s" repeatCount="indefinite"/>
          </stop>
          <stop offset="30%" stopColor="#4d87c5">
            <animate attributeName="stop-color" values="#4d87c5; #6773af; #4d87c5" dur="4.5s" begin="0s" repeatCount="indefinite"/>
          </stop>
          <stop offset="60%" stopColor="#6773af">
            <animate attributeName="stop-color" values="#6773af; #e74c3c; #6773af" dur="4.5s" begin="0s" repeatCount="indefinite"/>
          </stop>
          <stop offset="100%" stopColor="#e74c3c">
            <animate attributeName="stop-color" values="#e74c3c; #3498db; #e74c3c" dur="4.5s" begin="0s" repeatCount="indefinite"/>
          </stop>
        </linearGradient>
        <clipPath id={textClipId}>
          <text x="250" y="70" fontFamily="Arial" fontSize="70" fontWeight="bold" textAnchor="middle">SALLTECH</text>
        </clipPath>
      </defs>
      {/* Contour synchronisé */}
      <text x="250" y="70" fontFamily="Arial" fontSize="70" 
            fontWeight="bold" textAnchor="middle" fill="none" 
            stroke={`url(#${gradientId})`} strokeWidth="1">
        <animate attributeName="stroke-dashoffset" 
                values="420;0;0;420" 
                keyTimes="0;0.75;0.9;1" 
                dur="4.5s" 
                calcMode="linear"
                repeatCount="indefinite"/>
        <animate attributeName="stroke-dasharray" 
                values="0 420;420 0;420 0;0 420" 
                keyTimes="0;0.75;0.9;1" 
                dur="4.5s" 
                calcMode="linear"
                repeatCount="indefinite"/>
        SALLTECH
      </text>
      {/* Remplissage progressif */}
      <rect width="420" height="100" fill={`url(#${gradientId})`} clipPath={`url(#${textClipId})`} x="40">
        <animate attributeName="width" 
                values="0;420;420;0" 
                keyTimes="0;0.75;0.9;1" 
                dur="4.5s" 
                calcMode="linear" 
                repeatCount="indefinite"/>
      </rect>
      {/* Curseur parfaitement aligné */}
      <rect width="3" height="65" fill={`url(#${gradientId})`} y="15" opacity="0">
        <animate attributeName="x" 
                values="40;460;460;40" 
                keyTimes="0;0.75;0.9;1" 
                dur="4.5s" 
                calcMode="linear" 
                repeatCount="indefinite"/>
        <animate attributeName="opacity" 
                values="1;1;0;0" 
                keyTimes="0;0.75;0.7501;1" 
                dur="4.5s" 
                repeatCount="indefinite"/>
      </rect>
    </svg>
  );
}