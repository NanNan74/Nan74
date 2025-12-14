import React, { useState, useEffect } from 'react';
import Confetti from './components/Confetti';
import ParticleHeart from './components/ParticleHeart';

// --- COMPONENT NHẠC (Đã thay Link mới hoạt động tốt) ---
const VisibleMusicPlayer = () => {
  // ID Youtube MỚI: Không Yêu Em Thì Yêu Ai (Bản Lyrics - Cho phép nhúng)
  // ID cũ bị chặn, ID này là: c1sL-7f1gq4
  const YOUTUBE_ID = "c1sL-7f1gq4"; 
  
  // Link Youtube chuẩn để chạy Loop và không bị chặn
  const youtubeSrc = `https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&loop=1&playlist=${YOUTUBE_ID}&controls=1&showinfo=0&modestbranding=1&rel=0&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`;

  return (
    <div className="w-full max-w-[340px] mx-auto mt-4">
      {/* Khung giao diện Player */}
      <div className="bg-white rounded-2xl shadow-xl border border-pink-200 overflow-hidden transform transition-all hover:shadow-2xl duration-300">
        
        {/* Header Player */}
        <div className="px-4 py-2.5 bg-gradient-to-r from-pink-50 to-white flex items-center justify-between border-b border-pink-100">
          <div className="flex items-center gap-2">
            <span className="text-pink-500 animate-spin-slow text-lg">💿</span>
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
        
        {/* Card
