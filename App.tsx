import React, { useState, useEffect } from 'react';
import Confetti from './components/Confetti';
import ParticleHeart from './components/ParticleHeart';

// --- COMPONENT NHẠC (Đã gộp vào đây để bạn tiện copy) ---
// Dùng Youtube Embed để không cần tải file
const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Link bài hát: Không Yêu Em Thì Yêu Ai (Youtube ID: D-yDpwqN3IQ)
  const YOUTUBE_ID = "D-yDpwqN3IQ"; 
  const youtubeSrc = `https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&loop=1&playlist=${YOUTUBE_ID}&controls=0&showinfo=0`;

  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-2">
      {/* Nút Bật/Tắt */}
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-full shadow-lg transition-all transform hover:scale-105 border-2 ${
          isPlaying 
            ? 'bg-pink-500 border-pink-500 text-white animate-pulse' 
            : 'bg-white border-pink-200 text-pink-500'
        }`}
      >
        <span className="text-xl">{isPlaying ? '🔊' : '🔇'}</span>
        <span className="font-bold whitespace-nowrap">
          {isPlaying ? 'Đang phát: Không Yêu Em...' : 'Bật nhạc nền'}
        </span>
      </button>

      {/* Iframe Youtube ẩn (chỉ hiện khi bấm Play) */}
      {isPlaying && (
        <div className="absolute opacity-0 pointer-events-none w-1 h-1 overflow-hidden">
          <iframe 
            width="560" 
            height="315" 
            src={youtubeSrc} 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
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
    <div className="relative min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 overflow-x-hidden text-slate-800">
      
      {/* Hiệu ứng pháo giấy */}
      <Confetti />
      
      {/* Trình phát nhạc (Dùng Link Online) */}
      <MusicPlayer />

      {/* Nội dung chính */}
      <main className={`relative z-20 flex flex-col items-center justify-center min-h-screen p-4 transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-6 md:p-10 max-w-4xl w-full text-center border border-white/50 relative overflow-hidden">
          
          <h1 className="font-script text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-transparent mb-4 leading-tight">
            Cảm ơn cả nhà đã ủng hộ tym, comment, share cho Slầy Gơ ạaaa ❤️
          </h1>
          
          <p className="text-pink-500 font-bold text-xl md:text-2xl tracking-wider mb-2 animate-pulse">
            #STEM FOR EARTH
          </p>

          {/* Trái tim bay bay */}
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
             
             <div className="mt-6 pt-4 border-t border-gray-100">
               <p className="text-gray-500 italic font-script text-xl md:text-2xl">
                 "Không yêu em thì yêu ai..." 🎵
               </p>
               <p className="text-xs text-gray-400 mt-2">
                 (Bấm nút góc phải để nghe nhạc nhe)
               </p>
             </div>
          </div>

        </div>

        {/* Bong bóng trang trí */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce delay-700"></div>

      </main>
    </div>
  );
}

export default App;
