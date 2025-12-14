import React, { useState, useRef, useEffect } from 'react';
import Confetti from './components/Confetti';
import ParticleHeart from './components/ParticleHeart';

// --- COMPONENT NHẠC MP3 (Chạy link trực tiếp - Không lo bản quyền Youtube) ---
const VisibleMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Link nhạc MP3 trực tiếp (Online)
  const MUSIC_URL = "https://raw.githubusercontent.com/loi-nguyen-code/music-player/main/assets/music/KhongYeuEmThiYeuAi.mp3";
  
  // Link Ảnh bìa Album (Lấy từ thumbnail Youtube cho đẹp)
  const ALBUM_COVER = "https://i.ytimg.com/vi/D-yDpwqN3IQ/maxresdefault.jpg";

  // Xử lý khi bấm nút Play/Pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="w-full max-w-[340px] mx-auto mt-4">
      {/* Thẻ Audio ẩn (Core xử lý nhạc) */}
      <audio ref={audioRef} src={MUSIC_URL} loop />

      {/* Khung giao diện Player */}
      <div className="bg-white rounded-2xl shadow-xl border border-pink-200 overflow-hidden transform transition-all hover:shadow-2xl duration-300">
        
        {/* Header Player */}
        <div className="px-4 py-2.5 bg-gradient-to-r from-pink-50 to-white flex items-center justify-between border-b border-pink-100">
          <div className="flex items-center gap-2">
            <span className={`text-pink-500 text-lg ${isPlaying ? 'animate-spin-slow' : ''}`}>💿</span>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
              {isPlaying ? 'Now Playing' : 'Music Player'}
            </span>
          </div>
          <div className="flex gap-1.5 opacity-50">
             <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
          </div>
        </div>

        {/* Khu vực Ảnh bìa & Nút Play trung tâm */}
        <div className="relative w-full aspect-video group cursor-pointer" onClick={togglePlay}>
          {/* Ảnh bìa */}
          <img 
            src={ALBUM_COVER} 
            alt="Album Cover" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Lớp phủ đen mờ */}
          <div className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}></div>

          {/* Nút Play to ở giữa */}
          <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${isPlaying ? 'scale-0 group-hover:scale-100' : 'scale-100'}`}>
            <div className="w-14 h-14 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all">
               {isPlaying ? (
                 <span className="text-pink-600 text-2xl font-bold ml-0.5">⏸</span>
               ) : (
                 <span className="text-pink-600 text-2xl font-bold ml-1">▶</span>
               )}
            </div>
          </div>
        </div>

        {/* Thông tin bài hát & Thanh chạy */}
        <div className="px-4 py-3 bg-white flex flex-col items-start gap-1 relative">
           <h3 className="text-sm font-bold text-gray-800 leading-none">
             Không Yêu Em Thì Yêu Ai
           </h3>
           <p className="text-xs text-pink-500 font-medium">
             Vũ. feat Low G
           </p>
           
           {/* Thanh tiến trình giả lập */}
           <div className="w-full h-1 bg-gray-100 rounded-full mt-3 overflow-hidden relative">
             <div className={`h-full bg-gradient-to-r from-pink-400 to-purple-400 absolute top-0 left-0 rounded-full ${isPlaying ? 'animate-width-grow' : 'w-0'}`}></div>
           </div>
        </div>
      </div>
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
      
      {/* Hiệu ứng */}
      <Confetti />
      
      <main className={`relative z-20 flex flex-col items-center justify-center min-h-screen p-4 transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Card Chính */}
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
             
             {/* Khu vực Nhạc */}
             <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center">
               <p className="text-gray-500 italic font-script text-xl md:text-2xl mb-4">
                 "Cả nhà nghe bài hát này thư giãn nhé iu" 🎵
               </p>
               
               {/* Component Nhạc Cố Định */}
               <VisibleMusicPlayer />

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
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin-slow {
      animation: spin-slow 4s linear infinite;
    }
    @keyframes width-grow {
      from { width: 0%; }
      to { width: 100%; }
    }
    .animate-width-grow {
      animation: width-grow 200s linear forwards; 
    }
  `;
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default App;
