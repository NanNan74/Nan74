import React from 'react';

const HeartChart: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center w-full max-w-md h-32 md:h-40 my-6 bg-pink-50 rounded-xl border border-pink-200 shadow-inner overflow-hidden mx-auto">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-30" 
           style={{ 
             backgroundImage: 'linear-gradient(#ffc0cb 1px, transparent 1px), linear-gradient(90deg, #ffc0cb 1px, transparent 1px)',
             backgroundSize: '20px 20px'
           }}>
      </div>

      {/* ECG Line Animation */}
      <svg
        viewBox="0 0 500 100"
        className="w-full h-full z-10"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(236, 72, 153, 0)" />
            <stop offset="10%" stopColor="rgba(236, 72, 153, 1)" />
            <stop offset="90%" stopColor="rgba(236, 72, 153, 1)" />
            <stop offset="100%" stopColor="rgba(236, 72, 153, 0)" />
          </linearGradient>
        </defs>
        
        {/* The heartbeat path */}
        <path
          d="M0,50 L40,50 L50,80 L60,20 L70,50 L100,50 L140,50 L150,80 L160,20 L170,50 L200,50 L240,50 L250,80 L260,20 L270,50 L300,50 L340,50 L350,80 L360,20 L370,50 L400,50 L440,50 L450,80 L460,20 L470,50 L500,50"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-dash"
        />
        
        {/* Moving dot */}
        <circle r="4" fill="#db2777" className="animate-trace">
           <animateMotion 
             dur="3s" 
             repeatCount="indefinite"
             path="M0,50 L40,50 L50,80 L60,20 L70,50 L100,50 L140,50 L150,80 L160,20 L170,50 L200,50 L240,50 L250,80 L260,20 L270,50 L300,50 L340,50 L350,80 L360,20 L370,50 L400,50 L440,50 L450,80 L460,20 L470,50 L500,50"
           />
        </circle>
      </svg>
      
      <style>{`
        .animate-dash {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: dash 3s linear infinite;
        }
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default HeartChart;