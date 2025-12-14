import React, { useState, useEffect } from 'react';
import Confetti from './components/Confetti';
import ParticleHeart from './components/ParticleHeart';

// --- COMPONENT NHẠC (Giao diện hiển thị Video rõ ràng - Ổn định nhất) ---
const VisibleMusicPlayer = () => {
  // ID Youtube bài: Không Yêu Em Thì Yêu Ai
  const YOUTUBE_ID = "D-yDpwqN3IQ"; 
  const youtubeSrc = `https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&loop=1&playlist=${YOUTUBE_ID}&controls=1&showinfo=0&modestbranding=1`;

  return (
    <div className="w-full max-w-[320px] mx-auto mt-4">
      {/* Khung bao ngoài giống giao diện Widget */}
      <div className="bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden transform transition-all hover:scale-105 duration-300">
        
        {/* Phần Tiêu đề: NHẠC NỀN */}
        <div className="px-4 py-2 bg-gradient-to-r from-pink-50 to-white flex items-center justify-between border-b border-pink-100">
          <div className="flex items-center gap-2">
            <span className="text-pink-500 animate-pulse">📛</span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nhạc Nền</span>
          </div>
          <div className="flex gap-1">
             <div className="w-2 h-2 rounded-full bg-red-400"></div>
             <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
             <div className="w-2 h-2 rounded-full bg-green-400"></div>
          </div>
        </div>

        {/* Video Youtube hiển thị rõ ràng */}
        <div className="relative w-full aspect-video bg-black">
          <iframe 
            width="100%" 
            height="100%" 
            src={youtubeSrc} 
            title="Music Player" 
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          />
        </div>

        {/* Chân trang nhỏ */}
        <div className="px-4 py-2 bg-white text-center">
           <p className="text-[10px] text-gray-400 font-light italic">
             (Vũ. feat Low G)
           </p>
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
             
             {/* Component Nhạc Nằm Gọn Ở Đây */}
             <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center">
               <p className="text-gray-500 italic font-script text-xl md:text-2xl mb-4">
                 "Cả nhà nghe bài hát này thư giãn nhé iu" 🎵
               </p>
               
               {/* Khung nhạc hiển thị giống trong ảnh */}
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
