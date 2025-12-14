import React, { useRef, useState, useEffect } from 'react';

const MusicPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState(0.5);
  const [inputUrl, setInputUrl] = useState("");
  const [mediaSource, setMediaSource] = useState<{ type: 'none' | 'mp3' | 'youtube', url: string, youtubeId?: string }>({ type: 'none', url: '' });
  const [isExpanded, setIsExpanded] = useState(true);

  // Helper to extract YouTube ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSave = () => {
    if (!inputUrl.trim()) return;

    const youtubeId = getYouTubeId(inputUrl);
    if (youtubeId) {
      setMediaSource({ type: 'youtube', url: inputUrl, youtubeId });
    } else {
      setMediaSource({ type: 'mp3', url: inputUrl });
    }
  };

  const handleEdit = () => {
    setMediaSource({ type: 'none', url: '' });
    setInputUrl("");
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

      {mediaSource.type === 'none' ? (
        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2">
          <label className="text-xs text-gray-600">Dán link nhạc (YouTube hoặc MP3):</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://youtu.be/..."
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
          <p className="text-[10px] text-gray-400 italic">Hỗ trợ link YouTube, mp3.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 animate-in fade-in zoom-in-95">
          
          {mediaSource.type === 'youtube' && mediaSource.youtubeId && (
            <div className="rounded-lg overflow-hidden border border-gray-200 bg-black">
              <iframe 
                width="100%" 
                height="150" 
                src={`https://www.youtube.com/embed/${mediaSource.youtubeId}?autoplay=1`} 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          )}

          {mediaSource.type === 'mp3' && (
            <>
               <audio ref={audioRef} controls autoPlay loop src={mediaSource.url} className="w-full h-8" onError={() => alert("Link MP3 không hoạt động.")} />
               <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Điều chỉnh âm lượng</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
               </div>
            </>
          )}
          
          <div className="flex justify-end">
            <button onClick={handleEdit} className="text-[10px] text-blue-500 hover:underline">
                Đổi link nhạc khác
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;