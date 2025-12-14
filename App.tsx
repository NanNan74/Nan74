import React, { useState, useEffect } from 'react';
import Confetti from './components/Confetti';
import ParticleHeart from './components/ParticleHeart';

// --- COMPONENT NHẠC (Cố định bài hát - Tự động lặp lại) ---
const VisibleMusicPlayer = () => {
  // ID Youtube bài: Không Yêu Em Thì Yêu Ai
  // Đây là link cứng, không thay đổi.
  const YOUTUBE_ID = "D-yDpwqN3IQ"; 
  
  // Các tham số quan trọng:
  // loop=1 & playlist=ID: Để khi hết bài nó tự phát lại chính bài này.
  // rel=0: Không hiện video gợi ý của kênh khác.
  const youtubeSrc = `https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&loop=1&playlist=${YOUTUBE_ID}&controls=1&showinfo=0&modestbranding=1&rel=0`;

  return (
    <div className="w-full max-w-[340px] mx-auto mt-4">
      {/* Khung giao diện Player */}
      <div className="bg-white rounded-2xl shadow-xl border border-pink-200 overflow-hidden">
        
        {/* Header Player */}
        <div className="px-4 py-2.5 bg-gradient-to-r from-pink-50 to-white flex items-center justify-between border-b border-pink-100">
          <div className="flex items-center gap-2">
            <span className="text-pink-500 animate-pulse">💿</span>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
              Now Playing
            </span>
          </div>
          {/* 3 chấm trang trí */}
          <div className="flex gap-1.5 opacity-50">
             <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
          </div>
        </div>

        {/* Video Youtube Hiển Thị Rõ Ràng */}
        <div className="relative w-full aspect-video bg-black group">
          <iframe 
            width="100%" 
            height="100%" 
            src={youtubeSrc} 
            title="Music Player" 
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="group-hover:opacity-100 transition-opacity"
          />
        </div>

        {/* Thông tin bài hát cố định */}
        <div className="px-4 py-3 bg-white flex flex-col items-start gap-1">
           <h3 className="text-sm font-bold text-gray-800 leading-none">
             Không Yêu Em Thì Yêu Ai
           </h3>
           <p className="text-xs text-pink-500 font-medium">
             Vũ. feat Low G
           </p>
           
           {/* Thanh tiến trình giả (Trang trí cho đẹp) */}
           <div className="w-full h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
             <div className="h-full bg-pink-400 w-1/3 animate-pulse"></div>
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

export default App;
