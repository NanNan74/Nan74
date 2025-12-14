import React, { useRef, useState, useEffect } from 'react';

const MusicPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [musicUrl, setMusicUrl] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio autoplay blocked", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSave = () => {
    if (inputUrl.trim()) {
      setMusicUrl(inputUrl);
      setIsSaved(true);
      // Auto play after save
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error("Auto-play blocked", e));
        }
      }, 500);
    }
  };

  const handleEdit = () => {
    setIsSaved(false);
    setIsPlaying(false);
    if(audioRef.current) audioRef.current.pause();
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  if (!isExpanded) {
    return (
        <button 
            onClick={() => setIsExpanded(true)}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-white/90 backdrop-blur shadow-lg rounded-full flex items-center justify-center text-pink-500 hover:scale-110 transition-transform animate-bounce"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19.5L21 19.5M9 6L21 6M9 12.75L21 12.75M5.25 6L5.25 18" />
            </svg>
        </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-pink-200 flex flex-col gap-3 w-80 max-w-[90vw] transition-all">
      <div className="flex justify-between items-start">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-pink-500">
            <path d="M6.5 3a4.5 4.5 0 00-4.5 4.5V9a.75.75 0 00.75.75h14.5a.75.75 0 00.75-.75V7.5a4.5 4.5 0 00-4.5-4.5h-7zM2 11.25a.75.75 0 01.75-.75h14.5a.75.75 0 01.75.75v3.25a2.25 2.25 0 01-2.25 2.25h-11.5a2.25 2.25 0 01-2.25-2.25v-3.25z" />
          </svg>
          Nhạc nền
        </h3>
        <button onClick={() => setIsExpanded(false)} className="text-gray-400 hover:text-gray-600">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
        </button>
      </div>

      {!isSaved ? (
        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2">
          <label className="text-xs text-gray-600">Dán link nhạc (mp3) vào đây:</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://example.com/song.mp3"
              className="flex-1 text-xs border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
            />
            <button 
              onClick={handleSave}
              disabled={!inputUrl.trim()}
              className="bg-pink-500 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              Lưu
            </button>
          </div>
          <p className="text-[10px] text-gray-400 italic">Gợi ý: Dùng link trực tiếp đuôi .mp3 để hoạt động tốt nhất.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 animate-in fade-in zoom-in-95">
          <audio ref={audioRef} loop src={musicUrl} onError={() => alert("Không thể phát link này. Hãy thử link khác!")} />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button
                onClick={togglePlay}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-white shadow-md transition-all active:scale-95 ${
                    isPlaying ? 'bg-pink-500 hover:bg-pink-600 ring-2 ring-pink-200' : 'bg-gray-400 hover:bg-gray-500'
                }`}
                >
                {isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 pl-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                    </svg>
                )}
                </button>
                <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-bold text-gray-700 truncate w-32">
                        {isPlaying ? 'Đang phát...' : 'Đã tạm dừng'}
                    </span>
                    <button onClick={handleEdit} className="text-[10px] text-blue-500 hover:underline text-left">
                        Sửa link nhạc
                    </button>
                </div>
            </div>
            
            <div className="flex items-center gap-1">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-gray-400">
                    <path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h1.536l4.033 3.796A.75.75 0 0010 16.25V3.75zM14 10a4.002 4.002 0 00-1.172-2.828.75.75 0 10-1.06 1.06c.586.586.914 1.378.914 2.207s-.328 1.62-.914 2.207a.75.75 0 101.06 1.06A4.002 4.002 0 0014 10z" />
                </svg>
                <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;