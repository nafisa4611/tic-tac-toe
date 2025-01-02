// Board.js
import React, { useState } from 'react';
import Square from './Square';

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));  // 9 squares (3x3 grid)
  const [isXNext, setIsXNext] = useState(true);  // Track whose turn it is (X or O)
  const [winner, setWinner] = useState(null);  // Store the winner, if any
  const [history, setHistory] = useState([Array(9).fill(null)]);  // History of moves (board states)

  const handleClick = (index) => {
    if (squares[index] || winner) return;  // Ignore clicks if square is already filled or if there's a winner

    const newSquares = squares.slice();  // Copy the current state
    newSquares[index] = isXNext ? 'X' : 'O';  // Set the current player's mark (X or O)
    const newHistory = history.slice(0, history.length);  // Copy the history so far
    newHistory.push(newSquares);  // Add the new board state to the history
    setHistory(newHistory);  // Update the history state

    setSquares(newSquares);  // Update the squares

    // Check if there's a winner
    const gameWinner = calculateWinner(newSquares);
    if (gameWinner) {
      setWinner(gameWinner);  // Set the winner
    } else {
      setIsXNext(!isXNext);  // Switch turn between X and O
    }

    // Check if it's a draw (all squares are filled and no winner)
    if (!gameWinner && newSquares.every(square => square !== null)) {
      setWinner('Draw');  // Set the winner to 'Draw' if all squares are filled and no winner
    }
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];  // Return 'X' or 'O' as the winner
      }
    }
    return null;  // No winner
  };

  const resetGame = () => {
    setSquares(Array(9).fill(null));  // Reset the squares
    setIsXNext(true);  // Reset to player 'X'
    setWinner(null);  // Clear the winner
    setHistory([Array(9).fill(null)]);  // Clear the history
  };

  const renderSquare = (index) => {
    return <Square value={squares[index]} onClick={() => handleClick(index)} />;
  };

  const handleHistoryClick = (step) => {
    const newSquares = history[step];  // Get the board state at the selected step
    setSquares(newSquares);  // Update the board to that state
    setIsXNext(step % 2 === 0);  // Determine whose turn it is based on the step (even for 'X', odd for 'O')
    setWinner(null);  // Clear the winner for the recap (will be recalculated)
  };

  return (
    <div className="flex items-start justify-center gap-8 p-6 min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
      {/* Game Board */}
      <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-xl w-96">
        <div className="text-3xl font-semibold mb-4 text-gray-800">
          {winner ? (winner === 'Draw' ? 'Draw!' : `Winner: ${winner}`) : `Next Player: ${isXNext ? 'X' : 'O'}`}
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index}>{renderSquare(index)}</div>
          ))}
        </div>
        {(winner || squares.every(square => square !== null)) && (
          <button
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
            onClick={resetGame}
          >
            Start New Game
          </button>
        )}
      </div>

      {/* Game History */}
      <div className="flex flex-col items-start bg-white p-6 rounded-lg shadow-xl w-96">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Game History</h3>
        <div className="max-h-96 overflow-y-auto">
          <ul className="list-inside list-decimal space-y-2">
            {history.map((_, index) => (
              <li key={index}>
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => handleHistoryClick(index)}
                >
                  {`Go to move #${index === 0 ? 'Start' : index}`}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
