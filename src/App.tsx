/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';

type Player = 'Red' | 'Black';
type SquareValue = Player | null;

export default function App() {
  const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null));
  const [isRedNext, setIsRedNext] = useState<boolean>(true);
  const [scores, setScores] = useState({ Red: 0, Black: 0, Draws: 0 });
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const checkWinner = (squares: SquareValue[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    
    if (!squares.includes(null)) {
      return { winner: 'Draw', line: null };
    }
    
    return null;
  };

  const handleSquareClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    const currentPlayer = isRedNext ? 'Red' : 'Black';
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      setScores((prev) => ({
        ...prev,
        [result.winner]: prev[result.winner as keyof typeof prev] + 1
      }));
    } else {
      setIsRedNext(!isRedNext);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinningLine(null);
    // Loser of the last game goes first, or if draw, toggle. Just toggling for fairness.
    setIsRedNext(winner === 'Red' ? false : true);
  };

  const resetScores = () => {
    setScores({ Red: 0, Black: 0, Draws: 0 });
    resetGame();
    setIsRedNext(true);
  };

  const renderSquare = (index: number) => {
    const value = board[index];
    const isWinningSquare = winningLine?.includes(index);
    
    return (
      <button
        key={index}
        onClick={() => handleSquareClick(index)}
        disabled={!!value || !!winner}
        className={`w-24 h-24 sm:w-32 sm:h-32 bg-[#080808] border border-[#1a1a1a] flex items-center justify-center transition-all duration-200 group relative
          ${!value && !winner ? 'hover:bg-[#0c0c0c] cursor-pointer' : 'cursor-default'}
          ${isWinningSquare ? 'z-10 ring-2 ring-offset-4 ring-offset-[#111] ' + (value === 'Red' ? 'ring-[#ff2e2e]' : 'ring-white') : ''}
        `}
        aria-label={`Square ${index}`}
      >
        {value && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`text-6xl sm:text-7xl font-sans font-bold ${
              value === 'Red' 
                ? 'text-[#ff2e2e] ' + (isWinningSquare ? 'animate-pulse drop-shadow-[0_0_20px_rgba(255,46,46,0.6)]' : '')
                : 'text-white ' + (isWinningSquare ? 'animate-pulse drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]' : '')
            }`}
          >
            {value === 'Red' ? 'X' : 'O'}
          </motion.div>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] font-serif flex flex-col items-center justify-between p-4 sm:p-12 overflow-hidden border-[6px] sm:border-[12px] border-[#111]">
      
      {/* Header */}
      <header className="text-center w-full mt-4 sm:mt-0">
        <p className="text-[10px] tracking-[0.5em] uppercase text-[#ff2e2e] mb-2 font-sans">Championship Edition</p>
        <h1 className="text-4xl sm:text-6xl font-light tracking-tighter">TIC <span className="text-[#ff2e2e]">•</span> TAC <span className="text-[#ff2e2e]">•</span> TOE</h1>
        <div className="h-[1px] w-32 sm:w-48 bg-gradient-to-r from-transparent via-[#ff2e2e] to-transparent mx-auto mt-4 sm:mt-6"></div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full max-w-6xl mx-auto flex-1 my-8 lg:my-0">
        
        {/* Player 1 Score */}
        <div className="flex flex-col gap-4 lg:gap-8 text-center lg:text-right order-2 lg:order-1 w-full lg:w-auto">
          <div className="lg:border-r-2 lg:border-[#ff2e2e] lg:pr-6 py-2">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-sans">Player I (X)</p>
            <p className="text-2xl sm:text-4xl font-light tracking-wide">THE CRIMSON</p>
            <p className="text-4xl sm:text-5xl font-bold text-[#ff2e2e] mt-2">
              {scores.Red.toString().padStart(2, '0')} 
              <span className="text-xs text-gray-600 font-normal tracking-normal uppercase ml-2 font-sans">Victories</span>
            </p>
          </div>
        </div>

        {/* Game Board */}
        <div className="relative order-1 lg:order-2">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-[#111] p-2 sm:p-3 border border-[#222] shadow-2xl">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => renderSquare(i))}
          </div>
        </div>

        {/* Player 2 & Draw Score */}
        <div className="flex flex-col gap-4 lg:gap-8 text-center lg:text-left order-3 w-full lg:w-auto">
          <div className="lg:border-l-2 lg:border-white lg:pl-6 py-2">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-sans">Player II (O)</p>
            <p className="text-2xl sm:text-4xl font-light tracking-wide">THE OBSIDIAN</p>
            <p className="text-4xl sm:text-5xl font-bold text-white mt-2">
              {scores.Black.toString().padStart(2, '0')} 
              <span className="text-xs text-gray-600 font-normal tracking-normal uppercase ml-2 font-sans">Victories</span>
            </p>
          </div>
          <div className="lg:pl-6 py-2 hidden lg:block opacity-60">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-sans">Draws</p>
            <p className="text-xl sm:text-2xl font-light text-gray-400">{scores.Draws.toString().padStart(2, '0')}</p>
          </div>
        </div>
        
        {/* Mobile Draws Display */}
        <div className="order-4 lg:hidden text-center opacity-60 mt-4">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-sans">Draws</p>
          <p className="text-lg font-light text-gray-400">{scores.Draws.toString().padStart(2, '0')}</p>
        </div>
      </main>

      {/* Footer / Controls */}
      <footer className="flex flex-col sm:flex-row w-full justify-between items-center sm:items-end border-t border-[#1a1a1a] pt-6 gap-6 sm:gap-0 mt-auto">
        <div className="flex gap-4 items-center">
          <div className={`w-3 h-3 rounded-full ${winner ? 'bg-gray-600' : isRedNext ? 'bg-[#ff2e2e] animate-pulse shadow-[0_0_8px_rgba(255,46,46,0.6)]' : 'bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.6)]'}`}></div>
          <span className="text-xs tracking-widest uppercase font-sans text-gray-400">
            {winner ? (winner === 'Draw' ? "It's a Draw" : `${winner === 'Red' ? 'The Crimson' : 'The Obsidian'} claims victory`) : `Player ${isRedNext ? "I (X)" : "II (O)"}'s turn to move`}
          </span>
        </div>
        
        <div className="flex gap-4 sm:gap-8">
          <button
            onClick={resetScores}
            className="px-6 py-3 bg-transparent border border-[#333] text-[10px] tracking-[0.3em] uppercase font-sans hover:bg-white hover:text-black transition-colors"
          >
            Reset
          </button>
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-[#ff2e2e] text-white text-[10px] tracking-[0.3em] uppercase font-sans hover:bg-[#d12424] transition-colors shadow-[0_0_15px_rgba(255,46,46,0.2)] hover:shadow-[0_0_20px_rgba(255,46,46,0.4)]"
          >
            New Match
          </button>
        </div>
        
        <div className="text-center sm:text-right hidden sm:block">
          <p className="text-[10px] tracking-widest uppercase font-sans text-gray-600">Protocol</p>
          <p className="text-xs font-sans text-gray-500">Championship v1.0</p>
        </div>
      </footer>

    </div>
  );
}
