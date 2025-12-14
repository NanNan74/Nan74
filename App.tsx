import React, { useState, useEffect } from 'react';
import Confetti from './components/Confetti';
import ParticleHeart from './components/ParticleHeart';

// --- MUSIC PLAYER COMPONENT ---
const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Link Youtube bài: Không Yêu Em Thì Yêu Ai
  const YOUTUBE_ID = "D-yDpwqN3IQ"; 
  const youtubeSrc = `https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&loop=1&playlist=${YOUTUBE_ID}&enablejsapi=1&controls=0&showinfo=0`;

  return (
    <div className="fixed top-6 right-6 z-50">
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className={`group relative flex items-center gap-3 px-6 py-3 rounded-full border border-white/40 shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${
          isPlaying 
            ? 'bg-pink-500/90 text-white animate-pulse-slow' 
            : 'bg-white/30 backdrop-blur-md text-pink-600 hover:bg-white/50'
        }`}
      >
        <div className={`w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm transition-transform ${isPlaying ? 'animate-spin-slow' : ''}`}>
          <span className="text-2xl leading-none mt-1">
            {isPlaying ? '💿' : '🎵'}
          </span>
        </div>

        <div className="flex flex-col text-left mr-2">
          <span className="text-xs font-bold uppercase tracking-wider opacity-80">
            {isPlaying ? 'Now Playing' : 'Click to Play'}
          </span>
          <span className="font-bold text-sm md:text-base whitespace-nowrap">
            {isPlaying ? 'Không Yêu Em Thì Yêu Ai' : 'Bật nhạc nền 🎧'}
          </span>
        </div>

        {isPlaying && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
          </span>
        )}
      </button>

      {isPlaying && (
        <div style={{ position: 'fixed', left: '-9999px', top: '-9999px' }}>
          <iframe 
            width="300" 
            height="200" 
            src={youtubeSrc} 
            title="Music Player" 
            allow="autoplay; encrypted-media" 
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
};

// --- MAIN APP ---
function App() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 overflow-x-hidden text-slate-800 font-sans">
      
      <Confetti />
      <MusicPlayer />

      <main className={`relative z-20 flex flex-col items-center justify-center min-h-screen p-4 transition-all duration-1000 ease-out ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        <div className="bg-white/60 backdrop-blur-xl shadow-2xl rounded-[2rem] p-8 md:p-12 max-w-4xl w-full text-center border border-white/80 relative overflow-hidden">
          
          <h1 className="font-script text-4xl md:text-6xl bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight py-2">
            Cảm ơn cả nhà đã ủng hộ tym, comment, share cho Slầy Gơ ạaaa ❤️
          </h1>
          
          <div className="inline-block relative group cursor-default">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <p className="relative text-pink-600 font-black text-2xl md:text-3xl tracking-widest mb-4 px-4 py-2 uppercase">
              #STEM FOR EARTH
            </p>
          </div>

          <div className="w-full py-4 scale-110">
            <ParticleHeart />
          </div>

          <p className="text-xl md:text-2xl text-slate-700 font-medium leading-relaxed mb-8 mt-6">
            Chúc cả nhà nhiều sức khỏe, ngập tràn may mắn và nhiều điều tốt lành ạaaa ✨
          </p>

          <div className="space-y-6">
             <div className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-pink-50 to-purple-50 text-pink-700 font-bold shadow-sm border border-pink-100 transform transition hover:-translate-y-1">
                <span>✅</span> Phiếu bầu của bạn đã được ghi nhận
             </div>
             
             <div className="mt-8 pt-6 border-t border-slate-200/60">
               <p className="text-slate-500 italic font-script text-2xl md:text-3xl">
                 "Không yêu em thì yêu ai..." 🎵
               </p>
               <p className="text-sm text-slate-400 mt-2 font-light">
                 (Bấm nút góc phải để nghe nhạc nha)
               </p>
             </div>
          </div>

        </div>

        <div className="absolute top-20 left-10 w-24 h-24 bg-purple-400 rounded-full mix-blend-overlay filter blur-2xl opacity-60 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-400 rounded-full mix-blend-overlay filter blur-2xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-indigo-300 rounded-full mix-blend-overlay filter blur-2xl opacity-60 animate-blob animation-delay-4000"></div>

      </main>
    </div>
  );
}

// Style CSS
const styles = `
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-spin-slow {
    animation: spin-slow 4s linear infinite;
  }
  .animate-pulse-slow {
    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  .animate-blob {
    animation: blob 7s infinite;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
`;

// Inject style
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
export default App;

export default App;
