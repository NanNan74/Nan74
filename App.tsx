import React, { useState, useRef, useEffect } from 'react';
import Confetti from './components/Confetti';
import ParticleHeart from './components/ParticleHeart';

// --- COMPONENT NHẠC FIX LỖI (Dùng cơ chế điều khiển YouTube API) ---
const InlineMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Link Youtube (Dùng bản Audio Lyrics để load nhanh hơn và ít bị chặn)
  const YOUTUBE_ID = "D-yDpwqN3IQ"; 

  // Hàm gửi lệnh Play/Pause vào iframe Youtube
  const togglePlay = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const action = isPlaying ? 'pauseVideo' : 'playVideo';
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: action, args: [] }), 
        '*'
      );
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-4 relative z-50">
      {/* Giao diện máy nghe nhạc */}
      <div className={`relative overflow-hidden rounded-xl border transition-all duration-500 ${isPlaying ? 'bg-pink-50 border-pink-200 shadow-inner' : 'bg-white border-gray-100 shadow-sm'}`}>
        
        <div className="flex items-center p-3 gap-3">
          {/* Nút Play/Pause (Đĩa than) */}
          <button 
            onClick={togglePlay}
            className="relative w-12 h-12 flex-shrink-0 group focus:outline-none cursor-pointer"
          >
            <div className={`w-full h-full rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 shadow-md flex items-center justify-center transition-transform duration-[3s] ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
              <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                 <div className="w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
              </div>
            </div>
            {/* Icon phủ lên trên */}
            <div className="absolute inset-0 flex items-center justify-center text-white bg-black/10 rounded-full hover:bg-black/30 transition-all">
              {isPlaying ? '⏸' : '▶'}
            </div>
          </button>

          {/* Thông tin bài hát */}
          <div className="flex-1 text-left overflow-hidden">
            <div className="text-sm font-bold text-gray-800 truncate">
              Không Yêu Em Thì Yêu Ai
            </div>
            <div className="text-xs text-gray-500 truncate">
               Vũ. ft. Low G
            </div>
          </div>

          {/* Sóng nhạc animation */}
          <div className="flex items-end gap-[2px] h-4">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className={`w-1 bg-pink-400 rounded-t-sm transition-all duration-300 ${isPlaying ? 'animate-music-bar' : 'h-1'}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Thanh tiến trình chạy */}
        {isPlaying && (
           <div className="absolute bottom-0 left-0 h-0.5 bg-pink-500 animate-[width_200s_linear_forwards]" style={{width: '0%'}}></div>
        )}
      </div>

      {/* Iframe Youtube (RENDER LUÔN nhưng ẩn đi - Kỹ thuật quan trọng để không bị trình duyệt chặn) */}
      <div className="absolute opacity-0 pointer-events-none w-1 h-1 overflow-hidden -z-10 top-0 left-0">
        <iframe 
          ref={iframeRef}
          width="300" 
          height="200" 
          // enablejsapi=1 là bắt buộc để điều khiển bằng nút bấm bên ngoài
          src={`https://www.youtube.com/embed/${YOUTUBE_ID}?enablejsapi=1&controls=0&loop=1&playlist=${YOUTUBE_ID}&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
          title="Youtube Player"
          allow="autoplay; encrypted-media" 
          allowFullScreen
        />
      </div>

      {!isPlaying && (
        <p className="text-[10px] text-gray-400 mt-2 text-center italic animate-pulse">
          (Bấm vào nút Play để nhạc lên nha)
        </p>
      )}
    </div>
  );
};

// --- APP CHÍNH ---
function App() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 overflow-x-hidden text-slate-800 font-sans">
      
      <Confetti />
      
      <main className={`relative z-20 flex flex-col items-center justify-center min-h-screen p-4 transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-6 md:p-10 max-w-4xl w-full text-center border border-white/50 relative overflow-hidden">
          
          <h1 className="font-script text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-transparent mb-4 leading-tight">
            Cảm ơn cả nhà đã ủng hộ tym, comment, share cho Slầy Gơ ạaaa ❤️
          </h1>
          
          <p className="text-pink-500 font-bold text-xl md:text-2xl tracking-wider mb-2 animate-pulse">
            #STEM FOR EARTH
          </p>

          <div className="w-full">
            <ParticleHeart />
          </div>

          <p className="text-lg md:text-xl text-gray-700 font-medium leading-relaxed mb-6 mt-4">
            Chúc cả nhà nhiều sức khỏe, ngập tràn may mắn và nhiều điều tốt lành ạaaa
          </p>

          <div className="space-y-4">
             <div className="inline-block px-6 py-3 rounded-full bg-pink-50 text-pink-600 font-bold shadow-inner border border-pink-100">
                ❤️ Phiếu bầu của bạn đã được ghi nhận
             </div>
             
             {/* Component Nhạc ở đây */}
             <div className="mt-6 pt-4 border-t border-gray-100">
               <p className="text-gray-500 italic font-script text-xl md:text-2xl mb-2">
                 "Cả nhà nghe bài hát này thư giãn nhé iu" 🎵
               </p>
               <InlineMusicPlayer />
             </div>
          </div>

        </div>

        {/* Decorative Circles */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce delay-700"></div>

      </main>
    </div>
  );
}

// Inject styles
if (typeof document !== 'undefined') {
  const styles = `
    @keyframes music-bar {
      0%, 100% { height: 4px; }
      50% { height: 16px; }
    }
    .animate-music-bar {
      animation: music-bar 0.8s ease-in-out infinite;
    }
    @keyframes width {
      from { width: 0%; }
      to { width: 100%; }
    }
  `;
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default App;
