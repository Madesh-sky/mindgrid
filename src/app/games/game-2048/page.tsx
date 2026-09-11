'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Board2048, Direction } from '@/types';
import { initializeBoard, move, addRandomTile, isGameOver, hasWon } from '@/lib/game-2048';
import { recordGameResult } from '@/lib/storage';
import BoardComponent from '@/components/game-2048/Board2048';
import ScoreBoard from '@/components/ScoreBoard';
import GameResult from '@/components/GameResult';
import styles from './page.module.css';

export default function Game2048Page() {
  const [board, setBoard] = useState<Board2048>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [moveCount, setMoveCount] = useState(0);

  useEffect(() => {
    setBoard(initializeBoard());
    const savedBest = localStorage.getItem('2048-best');
    if (savedBest) {
      setBestScore(parseInt(savedBest, 10));
    }
  }, []);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('2048-best', score.toString());
    }
  }, [score, bestScore]);

  const handleMove = useCallback((direction: Direction) => {
    if (gameOver || won) return;
    setBoard((currentBoard) => {
      const result = move(currentBoard, direction);
      if (result.moved) {
        const newBoard = addRandomTile(result.board);
        setScore((s) => s + result.score);
        setMoveCount((m) => m + 1);

        if (hasWon(newBoard) && !won) {
          setWon(true);
          setShowResult(true);
        } else if (isGameOver(newBoard)) {
          setGameOver(true);
          setShowResult(true);
        }
        return newBoard;
      }
      return currentBoard;
    });
  }, [gameOver, won]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      let direction: Direction | null = null;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') direction = 'up';
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') direction = 'down';
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') direction = 'left';
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') direction = 'right';

      if (direction) {
        e.preventDefault();
        handleMove(direction);
      }
    },
    [handleMove]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const startNewGame = () => {
    setBoard(initializeBoard());
    setScore(0);
    setGameOver(false);
    setWon(false);
    setShowResult(false);
    setMoveCount(0);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSaveResult = async (playerInfo?: any) => {
    const pName = typeof playerInfo === 'string' ? playerInfo : (playerInfo?.playerName || playerInfo?.player || 'Player');
    await recordGameResult({
      playerName: pName,
      game: '2048',
      score,
      result: won ? 'win' : 'game-over',
      moves: moveCount,
    });
    setShowResult(false);
  };

  return (
    <div className="page">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Top navigation bar inside game */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '420px', marginBottom: '1.5rem' }}>
          <Link href="/" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            ← Back to Home
          </Link>
          <Link href="/about" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            📖 Rules
          </Link>
        </div>

        <h1 style={{ marginBottom: 'var(--space-xs)' }}>2048</h1>
        
        {/* Instructions & Scoring banner */}
        <div 
          style={{ 
            maxWidth: '420px', 
            width: '100%', 
            background: 'var(--surface)', 
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)', 
            padding: 'var(--space-sm) var(--space-md)', 
            marginBottom: 'var(--space-md)', 
            fontSize: '0.85rem', 
            color: 'var(--text-secondary)',
            textAlign: 'center',
            lineHeight: 1.45
          }}
        >
          🎮 <strong>How to Play & Score:</strong> Use <strong>Arrow Keys</strong> or on-screen buttons. Sliding moves <em>all</em> tiles across empty space. When matching numbers collide (2+2=4, 4+4=8), they merge into one, and that new tile value is added to your score! Reach the <strong>2048</strong> tile to win.
        </div>
        
        <div style={{ width: '100%', maxWidth: '400px', marginBottom: 'var(--space-md)' }}>
          <ScoreBoard 
            items={[
              { label: 'Score', value: score },
              { label: 'Best', value: bestScore },
              { label: 'Moves', value: moveCount }
            ]} 
          />
        </div>

        <div className="controls-row" style={{ width: '100%', maxWidth: '400px', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={() => setShowResult(true)}
            disabled={score === 0}
            title="Save current score to Leaderboard"
          >
            💾 Save Score
          </button>
          <button className="btn btn-primary btn-sm" onClick={startNewGame}>
            New Game
          </button>
        </div>

        {board.length > 0 && <BoardComponent board={board} />}

        {/* Direction Controls */}
        <div className={styles.mobileControls} style={{ marginTop: 'var(--space-lg)' }}>
          <button className="btn btn-secondary" onClick={() => handleMove('up')} style={{ fontSize: '1.25rem', padding: '10px 24px' }}>↑</button>
          <div className={styles.mobileControlsRow} style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-xs)' }}>
            <button className="btn btn-secondary" onClick={() => handleMove('left')} style={{ fontSize: '1.25rem', padding: '10px 24px' }}>←</button>
            <button className="btn btn-secondary" onClick={() => handleMove('down')} style={{ fontSize: '1.25rem', padding: '10px 24px' }}>↓</button>
            <button className="btn btn-secondary" onClick={() => handleMove('right')} style={{ fontSize: '1.25rem', padding: '10px 24px' }}>→</button>
          </div>
        </div>

        <GameResult
          show={showResult}
          title={won ? "You Won! 🎉" : gameOver ? "Game Over" : "Save Your Score"}
          stats={[
            { label: 'Score', value: score },
            { label: 'Moves', value: moveCount }
          ]}
          onSave={handleSaveResult}
          onPlayAgain={startNewGame}
          onClose={() => {
            handleSaveResult('Player');
          }}
        />
      </div>
    </div>
  );
}
