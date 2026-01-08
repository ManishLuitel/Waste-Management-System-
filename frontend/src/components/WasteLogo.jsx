export default function WasteLogo({ className = "w-10 h-10" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Circle */}
      <circle cx="50" cy="50" r="48" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
      
      {/* Recycling Symbol */}
      <g transform="translate(50,50)">
        {/* Arrow 1 */}
        <path
          d="M-15,-8 L-8,-15 L-5,-12 L-12,-5 L-15,-8 Z"
          fill="currentColor"
        />
        <path
          d="M-12,-5 Q-5,0 0,8"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Arrow 2 */}
        <path
          d="M8,12 L15,5 L12,2 L5,9 L8,12 Z"
          fill="currentColor"
        />
        <path
          d="M5,9 Q0,3 -8,0"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Arrow 3 */}
        <path
          d="M7,-4 L0,3 L3,6 L10,-1 L7,-4 Z"
          fill="currentColor"
        />
        <path
          d="M10,-1 Q5,-6 -3,-8"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </g>
      
      {/* Waste Bin */}
      <g transform="translate(50,65)">
        <rect x="-8" y="-5" width="16" height="12" rx="2" fill="currentColor" opacity="0.8"/>
        <rect x="-6" y="-8" width="12" height="2" rx="1" fill="currentColor"/>
        <line x1="-3" y1="-2" x2="-3" y2="4" stroke="rgba(255,255,255,0.6)" strokeWidth="1"/>
        <line x1="0" y1="-2" x2="0" y2="4" stroke="rgba(255,255,255,0.6)" strokeWidth="1"/>
        <line x1="3" y1="-2" x2="3" y2="4" stroke="rgba(255,255,255,0.6)" strokeWidth="1"/>
      </g>
      
      {/* Leaves */}
      <g transform="translate(30,25)">
        <ellipse cx="0" cy="0" rx="4" ry="8" fill="currentColor" opacity="0.7" transform="rotate(-20)"/>
        <ellipse cx="8" cy="2" rx="3" ry="6" fill="currentColor" opacity="0.6" transform="rotate(10)"/>
      </g>
    </svg>
  );
}