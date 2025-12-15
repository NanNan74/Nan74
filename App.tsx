import React, { useState, useEffect } from 'react';
import Confetti from './components/Confetti';
import ParticleHeart from './components/ParticleHeart';

// --- COMPONENT GAME CARO 3x3 (SMART BOT - ĐỔI LƯỢT ĐI TRƯỚC) ---
const TicTacToeSmart = () => {
  const WIN_SERIES = 2; // Thắng 2 ván là Vô Địch

  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true); 
  const [roundWinner, setRoundWinner] = useState(null);
  const [gameWinner, setGameWinner] = useState(null);
  const [scores, setScores] = useState({ player: 0, bot: 0 });
  
  // State mới: Theo dõi ai là người đi trước ở ván hiện tại
  const [playerStarts, setPlayerStarts] = useState(true); 

  // Các đường thắng
  const WINNING_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Ngang
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Dọc
    [0, 4, 8], [2, 4, 6]             // Chéo
  ];

  const checkWinner = (squares) => {
    for (let i = 0; i < WINNING_LINES.length; i++) {
      const [a, b, c] = WINNING_LINES[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleWin = (winnerSign) => {
    setRoundWinner(winnerSign);
    const newScores = { ...scores };
    if (winnerSign === '❤️') newScores.player += 1;
    else newScores.bot += 1;
    setScores(newScores);

    if (newScores.player >= WIN_SERIES) setGameWinner('Bạn (❤️)');
    else if (newScores.bot >= WIN_SERIES) setGameWinner('Máy (⭕)');
  };

  // --- TRÍ TUỆ NHÂN TẠO CỦA BOT ---
  const getSmartMove = (currentBoard) => {
    // 1. ƯU TIÊN THẮNG
    for (let line of WINNING_LINES) {
      const [a, b, c] = line;
      const values = [currentBoard[a], currentBoard[b], currentBoard[c]];
      const botCount = values.filter(v => v === '⭕').length;
      const emptyCount = values.filter(v => v === null).length;
      if (botCount === 2 && emptyCount === 1) return line[values.indexOf(null)];
    }

    // 2. ƯU TIÊN CHẶN
    for (let line of WINNING_LINES) {
      const [a, b, c] = line;
      const values = [currentBoard[a], currentBoard[b], currentBoard[c]];
      const playerCount = values.filter(v => v === '❤️').length;
      const emptyCount = values.filter(v => v === null).length;
      if (playerCount === 2 && emptyCount === 1) return line[values.indexOf(null)];
    }

    // 3. ƯU TIÊN GIỮA (Nếu đi đầu hoặc chưa ai chiếm)
    if (currentBoard[4] === null) return 4;

    // 4. ĐI NGẪU NHIÊN
    const emptyIndices = currentBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    if (emptyIndices.length > 0) {
      return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }
    return null;
  };

  // --- BOT LOGIC (Tự động đi khi đến lượt) ---
  useEffect(() => {
    if (!isPlayerTurn && !roundWinner && !gameWinner) {
      const timer = setTimeout(() => {
        const moveIndex = getSmartMove(board);
        
        if (moveIndex !== null) {
          const newBoard = [...board];
          newBoard[moveIndex] = '⭕';
          setBoard(newBoard);
          
          const w = checkWinner(newBoard);
          if (w) handleWin(w);
          else if (!newBoard.includes(null)) setRoundWinner('Hòa');
          else setIsPlayerTurn(true);
        }
      }, 700); // Delay 0.7s
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, roundWinner, gameWinner, board]);

  // --- PLAYER MOVE ---
  const handlePlayerClick = (index) => {
    if (board[index] || roundWinner || gameWinner || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = '❤️';
    setBoard(newBoard);
    setIsPlayerTurn(false);

    const w = checkWinner(newBoard);
    if (w) handleWin(w);
    else if (!newBoard.includes(null)) setRoundWinner('Hòa');
  };

  // --- CHUYỂN VÁN (ĐỔI LƯỢT ĐI TRƯỚC) ---
  const nextRound = () => {
    setBoard(Array(9).fill(null));
    setRoundWinner(null);
    
    // Đảo ngược người đi trước
    const nextRoundStarter = !playerStarts;
    setPlayerStarts(nextRoundStarter); // Lưu lại cho ván sau nữa
    setIsPlayerTurn(nextRoundStarter); // Set lượt hiện tại
  };

  // --- RESET GAME ---
  const resetMatch = () => {
    setBoard(Array(9).fill(null));
    setRoundWinner(null);
    setGameWinner(null);
    setScores({ player: 0, bot: 0 });
    
    setPlayerStarts(true); // Reset về mặc định: Bạn đi trước
    setIsPlayerTurn(true);
  };

  return (
    <div className="w-full max-w-[320px] mx-auto mt-6 relative z-30">
      <div className="bg-white rounded-2xl shadow-xl border border-pink-200 overflow-hidden relative">
        
        {/* Header Tỉ số */}
        <div className="px-4 py-3 bg-gradient-to-r from-pink-100 to-white border-b border-pink-100">
          <div className="flex justify-between items-center mb-1">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
               Bo3 - Ai thắng 2 là Vô Địch
             </span>
             <button onClick={resetMatch} className="text-[10px] bg-white border border-pink-200 px-2 py-0.5 rounded hover:bg-pink-50 text-gray-400">
                Reset
             </button>
          </div>
          <div className="flex justify-between items-center text-lg font-bold">
             <div className="text-pink-600 flex items-center gap-1">
               Bạn: <span className="text-2xl">{scores.player}</span>
             </div>
             <div className="text-gray-300 text-sm">vs</div>
             <div className="text-blue-500 flex items-center gap-1">
               Máy: <span className="text-2xl">{scores.bot}</span>
             </div>
          </div>
        </div>

        {/* Bàn cờ 3x3 */}
        <div className="p-4 bg-pink-50/50 relative min-h-[300px] flex items-center justify-center">
          
          {/* MÀN HÌNH KẾT QUẢ */}
          {(roundWinner || gameWinner) && (
            <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center animate-fade-in">
              {gameWinner ? (
                <div className="animate-bounce-in">
                  <div className="text-6xl mb-2 animate-bounce">🏆</div>
                  <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-1">
                    NHÀ VÔ ĐỊCH
                  </h3>
                  <p className="text-gray-600 font-bold text-lg mb-6">
                    {gameWinner}
                  </p>
                  <button onClick={resetMatch} className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition transform">
                    Chơi giải mới 🎆
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-4xl mb-2">{roundWinner === 'Hòa' ? '🤝' : (roundWinner === '❤️' ? '😎' : '🤖')}</div>
                  <p className="text-gray-700 font-bold text-lg mb-1">
                    {roundWinner === 'Hòa' ? 'Ván này Hòa!' : `${roundWinner === '❤️' ? 'Bạn' : 'Máy'} thắng ván này!`}
                  </p>
                  <p className="text-xs text-gray-400 mb-4 italic">
                    (Ván sau {playerStarts ? 'Máy' : 'Bạn'} sẽ đi trước)
                  </p>
                  <button onClick={nextRound} className="px-5 py-2 bg-pink-500 text-white rounded-full shadow hover:bg-pink-600 transition hover:scale-105">
                    Đấu ván tiếp theo ➡
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Grid 3x3 */}
          <div className="grid grid-cols-3 gap-2 w-full">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handlePlayerClick(index)}
                disabled={!!cell || !isPlayerTurn || !!roundWinner}
                className={`aspect-square w-full bg-white rounded-xl shadow-sm border-2 text-4xl flex items-center justify-center transition-all 
                  ${cell ? 'border-pink-200' : 'border-white'}
                  ${!cell && isPlayerTurn && !roundWinner ? 'hover:bg-pink-100 cursor-pointer active:scale-95' : 'cursor-default'}
                  ${!isPlayerTurn && !cell ? 'opacity-60' : 'opacity-100'}
                `}
              >
                <span className={`transform transition-transform duration-300 ${cell ? 'scale-100' : 'scale-0'}`}>
                  {cell}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer trạng thái */}
        {!gameWinner && !roundWinner && (
          <div className={`px-4 py-2 text-center text-xs font-medium transition-colors duration-300 ${isPlayerTurn ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
             {isPlayerTurn ? "👉 Lượt của bạn (❤️)" : "🤖 Máy đang tính kế..."}
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
      
      {/* Hiệu ứng Pháo giấy */}
      <Confetti />
      
      <main className={`relative z-20 flex flex-col items-center justify-center min-h-screen p-4 transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Card Chính: Đã thêm z-10 để nổi hẳn lên trên */}
        <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-6 md:p-10 max-w-4xl w-full text-center border border-white/50 relative overflow-hidden z-10">
          
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
                 "Cả nhà có thể chơi caro giải trí ạ, hoan hỉ cho Như nếu chơi xong cả nhà hơm thấy giải trí lắm hhehe 😄
               </p>
               
               {/* Component Game Smart + Đổi lượt */}
               <TicTacToeSmart />

             </div>
          </div>

        </div>

        {/* Decorative Circles: Đã thêm pointer-events-none để không chặn click */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce pointer-events-none"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce delay-700 pointer-events-none"></div>

      </main>
    </div>
  );
}

// Inject styles animations
if (typeof document !== 'undefined') {
  const styles = `
    @keyframes bounce-in {
      0% { transform: scale(0); opacity: 0; }
      60% { transform: scale(1.1); opacity: 1; }
      100% { transform: scale(1); }
    }
    .animate-bounce-in {
      animation: bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    }
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default App;
