import React, { useState, useEffect } from 'react';
import Confetti from './components/Confetti';
import ParticleHeart from './components/ParticleHeart';

// --- COMPONENT TRÒ CHƠI: CỜ CARO (Tic Tac Toe) ---
const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true); // Player là ❤️
  const [winner, setWinner] = useState<string | null>(null);

  // Logic kiểm tra thắng thua
  const checkWinner = (squares: any[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Hàng ngang
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Hàng dọc
      [0, 4, 8], [2, 4, 6]             // Chéo
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  // Bot tự động đi
  useEffect(() => {
    if (!isPlayerTurn && !winner && board.includes(null)) {
      const timer = setTimeout(() => {
        const emptyIndices = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
        if (emptyIndices.length > 0) {
          const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
          if (randomIndex !== null && randomIndex !== undefined) {
             handleClick(randomIndex, false); 
          }
        }
      }, 600); // Bot nghĩ 0.6s
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, winner, board]);

  const handleClick = (index: number, isHuman: boolean) => {
    if (board[index] || winner) return;
    if (isHuman && !isPlayerTurn) return; // Không cho click khi đến lượt bot

    const newBoard = [...board];
    newBoard[index] = isHuman ? '❤️' : '⭕';
    setBoard(newBoard);
    
    const w = checkWinner(newBoard);
    if (w) {
      setWinner(w);
    } else if (!newBoard.includes(null)) {
      setWinner('Hòa');
    } else {
      setIsPlayerTurn(!isHuman);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsPlayerTurn(true);
  };

  return (
    <div className="w-full max-w-[320px] mx-auto mt-6">
      <div className="bg-white rounded-2xl shadow-xl border border-pink-200 overflow-hidden">
        
        {/* Header Game */}
        <div className="px-4 py-3 bg-gradient-to-r from-pink-100 to-white flex items-center justify-between border-b border-pink-100">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎮</span>
            <span className="text-xs font-bold text-pink-600 uppercase tracking-widest">
              Mini Game: Caro
            </span>
          </div>
          <button onClick={resetGame} className="text-xs bg-white border border-pink-200 px-2 py-1 rounded hover:bg-pink-50 text-gray-500 transition">
            Chơi lại ↺
          </button>
        </div>

        {/* Bàn cờ */}
        <div className="p-4 bg-pink-50/50">
          {winner ? (
            <div className="text-center py-8 animate-bounce">
              <p className="text-xl font-bold text-gray-700">
                {winner === 'Hòa' ? 'Hòa nhau rồi! 🤝' : `Người thắng: ${winner}`}
              </p>
              <button 
                onClick={resetGame}
                className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-full shadow-lg hover:bg-pink-600 transition"
              >
                Chơi ván mới
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {board.map((cell, index) => (
                <button
                  key={index}
                  onClick={() => handleClick(index, true)}
                  className={`h-20 w-full bg-white rounded-xl shadow-sm border-2 border-pink-100 text-3xl flex items-center justify-center transition-all hover:bg-pink-50 ${!cell && isPlayerTurn ? 'hover:scale-105' : ''}`}
                  disabled={!!cell || !isPlayerTurn}
                >
                  <span className={cell ? 'scale-100 transition-transform duration-300' : 'scale-0'}>
                    {cell}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer trạng thái */}
        {!winner && (
          <div className="px-4 py-2 bg-white text-center text-xs text-gray-500 font-medium">
             {isPlayerTurn ? "Đến lượt bạn (❤️)" : "Máy đang suy nghĩ..."}
          </div>
        )}
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
             
             {/* Khu vực Trò chơi */}
             <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center">
               <p className="text-gray-500 italic font-script text-xl md:text-2xl mb-2">
                 "Rảnh tay thì làm ván cờ nhân phẩm nhé!" 👇
               </p>
               
               {/* Component Game Caro */}
               <TicTacToe />

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
