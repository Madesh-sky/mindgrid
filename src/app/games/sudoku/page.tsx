'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Difficulty, SudokuBoard as BoardType } from '@/types';
import { generateSudoku, isBoardComplete, hasRuleConflict } from '@/lib/sudoku';
import { SudokuBoard } from '@/components/sudoku/SudokuBoard';
import { NumberPad } from '@/components/sudoku/NumberPad';
import { recordGameResult } from '@/lib/storage';
import Timer from '@/components/Timer';
import GameResult from '@/components/GameResult';
import styles from './page.module.css';

export default function SudokuPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [puzzle, setPuzzle] = useState<BoardType>([]);
  const [solution, setSolution] = useState<BoardType>([]);
  const [userBoard, setUserBoard] = useState<BoardType>([]);
  
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [invalidCells, setInvalidCells] = useState<Set<string>>(new Set());
  
  const [mistakes, setMistakes] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [time, setTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [resetTimer, setResetTimer] = useState(false);
  const [moves, setMoves] = useState(0);

  const initGame = useCallback((diff: Difficulty) => {
    const { puzzle: newPuzzle, solution: newSolution } = generateSudoku(diff);
    setPuzzle(newPuzzle);
    setSolution(newSolution);
    setUserBoard(newPuzzle.map(r => [...r]));
    
    setSelectedCell(null);
    setInvalidCells(new Set());
    setMistakes(0);
    setIsComplete(false);
    setShowResult(false);
    setTime(0);
    setTimerRunning(true);
    setResetTimer(prev => !prev);
    
    let initialClues = 0;
    newPuzzle.forEach(r => r.forEach(c => { if(c !== null) initialClues++; }));
    setMoves(81 - initialClues);
  }, []);

  useEffect(() => {
    initGame(difficulty);
  }, [difficulty, initGame]);

  const handleCellClick = (row: number, col: number) => {
    if (isComplete) return;
    if (puzzle[row][col] !== null) {
      setSelectedCell(null);
      return;
    }
    setSelectedCell({ row, col });
  };

  const handleNumberSelect = (num: number) => {
    if (!selectedCell || isComplete) return;
    const { row, col } = selectedCell;

    if (puzzle[row][col] !== null) return;

    // Check if placing this number violates Sudoku rules (repeated in row, col, or 3x3 box)
    const hasConflict = hasRuleConflict(userBoard, row, col, num);
    const newInvalidCells = new Set(invalidCells);
    const key = `${row}-${col}`;

    if (hasConflict) {
      setMistakes(m => m + 1);
      newInvalidCells.add(key);
    } else {
      newInvalidCells.delete(key);
    }
    setInvalidCells(newInvalidCells);

    const newUserBoard = userBoard.map(r => [...r]);
    newUserBoard[row][col] = num;
    setUserBoard(newUserBoard);

    if (isBoardComplete(newUserBoard, solution)) {
      setIsComplete(true);
      setTimerRunning(false);
      setShowResult(true);
    }
  };

  const handleErase = () => {
    if (!selectedCell || isComplete) return;
    const { row, col } = selectedCell;
    
    if (puzzle[row][col] !== null) return;

    const newUserBoard = userBoard.map(r => [...r]);
    newUserBoard[row][col] = null;
    setUserBoard(newUserBoard);

    const newInvalidCells = new Set(invalidCells);
    newInvalidCells.delete(`${row}-${col}`);
    setInvalidCells(newInvalidCells);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSaveResult = async (playerInfo?: any) => {
    const pName = typeof playerInfo === 'string' ? playerInfo : (playerInfo?.playerName || playerInfo?.player || 'Player');
    await recordGameResult({
      playerName: pName,
      game: 'sudoku',
      result: 'completed',
      time,
      moves,
      difficulty,
      mistakes,
    });
    setShowResult(false);
  };

  if (!puzzle.length) return null;

  return (
    <div className="page container">
      {/* Top navigation bar inside game */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Link href="/" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          ← Back to Home
        </Link>
        <Link href="/about" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          📖 Rules
        </Link>
      </div>

      <h1 className={styles.title}>Sudoku</h1>
      
      <div className={styles.diffSelector}>
        {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => (
          <button
            key={diff}
            className={`btn ${difficulty === diff ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setDifficulty(diff)}
          >
            {diff.charAt(0).toUpperCase() + diff.slice(1)}
          </button>
        ))}
      </div>

      <div className="stats-row">
        <div className="stat-item">
          <span className="stat-label">Mistakes:</span>
          <span className="stat-value">{mistakes}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Time:</span>
          <span className="stat-value">
            <Timer isRunning={timerRunning} onTimeUpdate={setTime} reset={resetTimer} />
          </span>
        </div>
      </div>

      <SudokuBoard
        puzzle={puzzle}
        userBoard={userBoard}
        selectedCell={selectedCell}
        onCellClick={handleCellClick}
        invalidCells={invalidCells}
      />

      <NumberPad onNumberSelect={handleNumberSelect} onErase={handleErase} />

      <div className="controls-row mt-4">
        <button className="btn btn-primary" onClick={() => initGame(difficulty)}>
          New Game
        </button>
        <button className="btn btn-secondary" onClick={() => {
          setUserBoard(puzzle.map(r => [...r]));
          setInvalidCells(new Set());
          setMistakes(0);
          setResetTimer(prev => !prev);
          setTimerRunning(true);
        }}>
          Reset Board
        </button>
      </div>

      <GameResult
        show={showResult}
        title="Sudoku Completed! 🎉"
        stats={[
          { label: 'Time', value: `${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}` },
          { label: 'Mistakes', value: mistakes },
          { label: 'Difficulty', value: difficulty.charAt(0).toUpperCase() + difficulty.slice(1) }
        ]}
        onSave={handleSaveResult}
        onPlayAgain={() => initGame(difficulty)}
        onClose={() => {
          handleSaveResult('Player');
        }}
      />
    </div>
  );
}
