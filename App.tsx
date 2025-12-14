import React, { useState, useEffect } from 'react';
import Confetti from './components/Confetti';
import ParticleHeart from './components/ParticleHeart';

// --- COMPONENT GAME CARO 5x5 (LUẬT: NỐI 3 LÀ THẮNG, BO3) ---
const CaroGame = () => {
  const SIZE = 5; // Bàn cờ 5x5
  const WIN_CONDITION = 3; // Nối 3 con là thắng vòng
  const WIN_SERIES = 2; // Thắng 2 ván là thắng chung cuộc

  const [board, setBoard] = useState(Array(SIZE * SIZE).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true); // Player là ❤️
  const [roundWinner, setRoundWinner] = useState<string | null>(null);
  const [scores, setScores] = useState({ player: 0, bot: 0 });
  const [gameWinner, setGameWinner] = useState<string | null>(null);

  // Logic kiểm tra thắng (Nối 3 ô liên tiếp)
  const checkWinCondition = (currentBoard: any[]) => {
    const getCell = (r: number, c: number) => currentBoard[r * SIZE + c];

    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const val = getCell(r, c);
        if (!val) continue;

        // Check Ngang (Right)
        if (c + 2 < SIZE && val === getCell(r, c + 1) && val === getCell(r, c + 2)) return val;
        // Check Dọc (Down)
        if (r + 2 < SIZE && val === getCell(r + 1, c) && val === getCell(r + 2, c)) return val;
        // Check Chéo Phải (Diagonal Right)
        if (r + 2 < SIZE && c + 2 < SIZE && val === getCell(r + 1, c + 1) && val === getCell(r + 2, c + 2)) return val;
        // Check Chéo Trái (Diagonal Left)
        if (r + 2 < SIZE && c - 2 >= 0 && val === getCell(r + 1, c - 1) && val === getCell(r + 2, c - 2)) return val;
      }
    }
    return null;
  };

  // Bot tự động đi sau 1 giây
  useEffect(() => {
    if (!isPlayerTurn && !roundWinner && !gameWinner && board.includes(null)) {
      const timer = setTimeout(() => {
        // Bot logic đơn giản: Chọn ngẫu nhiên ô trống
        const emptyIndices = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
        if (emptyIndices.length > 0) {
          const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
          if (randomIndex !== null && randomIndex !== undefined) {
             handleMove(randomIndex, false); 
          }
        }
      }, 1000); // 1s Delay
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, roundWinner, gameWinner, board]);

  const handleMove = (index: number, isHuman: boolean) => {
    if (board[index] || roundWinner || gameWinner) return;
    if (isHuman && !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = isHuman ? '❤️' : '⭕';
    setBoard(newBoard);
    
    const w = checkWinCondition(newBoard);
    
    if (w) {
      // Có người thắng vòng này
      setRoundWinner(w);
      const newScores = { ...scores };
      if (w === '❤️') newScores.player += 1;
      else newScores.bot += 1;
      
      setScores(newScores);

      // Kiểm tra thắng chung cuộc (BO3)
      if (newScores.player >= WIN_SERIES) setGameWinner('Bạn (❤️)');
      else if (newScores.bot >= WIN_SERIES) setGameWinner('Máy (⭕)');

    } else if (!newBoard.includes(null)) {
      setRoundWinner('Hòa'); // Hết ô mà ko ai thắng
    } else {
      setIsPlayerTurn(!isHuman);
    }
  };

  const nextRound = () => {
    setBoard(Array(SIZE * SIZE).fill(null));
    setRoundWinner(null);
    setIsPlayerTurn(true); // Bạn luôn đi trước cho dễ
  };

  const resetGameFull = () => {
    setBoard(Array(SIZE * SIZE).fill(null));
    setRoundWinner(null);
    setGameWinner(null);
    setScores({ player: 0, bot: 0 });
    setIsPlayerTurn(true);
  };

  return (
    <div className="w-full max-w-[340px] mx-auto mt-6">
      <div className="bg-white rounded-2xl shadow-xl border border-pink-200 overflow-hidden">
        
        {/* Header Tỉ số */}
        <div className="px-4 py-3 bg-gradient-to-r from-pink-100 to-white border-b border-pink-100">
          <div className="flex justify-between items-center mb-1">
             <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tỉ số (Chạm {WIN_SERIES} thắng)</span>
             <button onClick={resetGameFull} className="text-[10px] bg-white border border-pink-200 px-2 py-0.5 rounded hover:bg-pink-50 text-gray-400">
                Reset
             </button>
          </div>
          <div className="flex justify-between items-center text-lg font-bold">
             <div className="text-pink-600">Bạn: {scores.player}</div>
             <div className="text-gray-400 text-sm">vs</div>
             <div className="text-blue-500">Máy: {scores.bot}</div>
          </div>
        </div>

        {/* Bàn cờ 5x5 */}
        <div className="p-4 bg-pink-50/50 relative min-h-[300px] flex items-center justify-center">
          
          {/* Màn hình thông báo kết quả */}
          {(roundWinner || gameWinner) ? (
            <div className="absolute inset-0 z-10 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center animate-fade-in">
              {gameWinner ? (
                <>
                  <div className="text-4xl mb-2">🏆</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">CHUNG CUỘC</h3>
                  <p className="text-pink-600 font-bold text-lg mb-4">{gameWinner} Vô Địch!</p>
                  <button onClick={resetGameFull} className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg hover:scale-105 transition">
                    Chơi lại từ đầu
                  </button>
                </>
              ) : (
                <>
                  <div className="text-3xl mb-2">{roundWinner === 'Hòa' ? '🤝' : '🎉'}</div>
                  <p className="text-gray-700 font-bold text-lg mb-4">
                    {roundWinner === 'Hòa' ? 'Ván này Hòa!' : `${roundWinner} thắng ván này!`}
                  </p>
                  <button onClick={nextRound} className="px-5 py-2 bg-pink-500 text-white rounded-full shadow hover:bg-pink-600 transition">
                    Tiếp ván sau ➡
                  </button>
                </>
              )}
            </div>
          ) : null}

          {/* Grid 5x5 */}
          <div className="grid grid-cols-5 gap-1.5 w-full">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleMove(index, true)}
                className={`aspect-square w-full bg-white rounded-lg shadow-sm border border-pink-100 text-xl md:text-2xl flex items-center justify-center transition-all hover:bg-pink-50 ${!cell && isPlayerTurn && !roundWinner ? 'hover:scale-95' : ''}`}
                disabled={!!cell || !isPlayerTurn || !!roundWinner}
              >
                <span className={cell ? 'scale-100 transition-transform duration-300' : 'scale-0'}>
                  {cell}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer trạng thái */}
        {!gameWinner && !roundWinner && (
          <div className="px-4 py-2 bg-white text-center text-xs text-gray-500 font-medium">
             {isPlayerTurn ? "Đến lượt bạn (❤️) - Cần nối 3 ô" : "Máy đang tính nước đi..."}
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
                 "Giải trí xíu nha: Chạm 2 là thắng!" 👇
               </p>
               
               {/* Component Game Caro 5x5 */}
               <CaroGame />

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
