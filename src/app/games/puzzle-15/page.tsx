'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { shuffleBoard, canMove, moveTile, isSolved } from '@/lib/puzzle-15';
import { recordGameResult } from '@/lib/storage';
import PuzzleBoard from '@/components/puzzle-15/PuzzleBoard';
import Timer from '@/components/Timer';
import GameResult from '@/components/GameResult';

export default function Puzzle15Page() {
  const [size, setSize] = useState<number | null>(null);
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [solved, setSolved] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resetTimer, setResetTimer] = useState(false);
  
  useEffect(() => {
    if (size) {
      // Default to a shuffled board so it never starts in solved order
      setTiles(shuffleBoard(size));
      setMoves(0);
      setGameStarted(false);
      setTimerRunning(false);
      setTimeElapsed(0);
      setSolved(false);
      setShowResult(false);
      setResetTimer(true);
      setTimeout(() => setResetTimer(false), 10);
    }
  }, [size]);

  const handleTileClick = (index: number) => {
    if (solved || !size || !canMove(tiles, index, size)) return;

    if (!gameStarted) {
      setGameStarted(true);
      setTimerRunning(true);
    }

    const newTiles = moveTile(tiles, index, size);
    setTiles(newTiles);
    setMoves((m) => m + 1);

    if (isSolved(newTiles, size)) {
      setSolved(true);
      setTimerRunning(false);
      setShowResult(true);
    }
  };

  const startNewGame = () => {
    if (!size) return;
    setTiles(shuffleBoard(size));
    setMoves(0);
    setGameStarted(false);
    setTimerRunning(false);
    setTimeElapsed(0);
    setSolved(false);
    setShowResult(false);
    setResetTimer(true);
    setTimeout(() => setResetTimer(false), 10);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSaveResult = async (playerInfo?: any) => {
    if (!size) return;
    const gameName = size === 4 ? '15-puzzle' : size === 5 ? '24-puzzle' : '35-puzzle';
    const pName = typeof playerInfo === 'string' ? playerInfo : (playerInfo?.playerName || playerInfo?.player || 'Player');
    
    await recordGameResult({
      playerName: pName,
      game: gameName,
      result: 'completed',
      moves,
      time: timeElapsed,
    });
    
    setShowResult(false);
  };

  const getTitle = () => {
    if (!size) return 'Sliding Puzzle';
    return size === 4 ? '15 Puzzle' : size === 5 ? '24 Puzzle' : '35 Puzzle';
  };

  if (!size) {
    return (
      <div className="page">
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Top navigation bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '340px', marginBottom: '1.5rem' }}>
            <Link href="/" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              ← Back to Home
            </Link>
            <Link href="/about" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              📖 Rules
            </Link>
          </div>

          <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Sliding Puzzle</h1>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', width: '100%', maxWidth: '340px' }}>
            <button 
              className="card" 
              style={{ padding: 'var(--space-lg)', borderLeft: '4px solid var(--accent-green)', textAlign: 'left', cursor: 'pointer', backgroundColor: 'var(--surface)' }}
              onClick={() => setSize(4)}
            >
              <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-xs)' }}>15 Puzzle</h2>
              <p style={{ color: 'var(--text-secondary)' }}>4 × 4 grid (15 tiles)</p>
            </button>
            
            <button 
              className="card" 
              style={{ padding: 'var(--space-lg)', borderLeft: '4px solid var(--accent-amber)', textAlign: 'left', cursor: 'pointer', backgroundColor: 'var(--surface)' }}
              onClick={() => setSize(5)}
            >
              <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-xs)' }}>24 Puzzle</h2>
              <p style={{ color: 'var(--text-secondary)' }}>5 × 5 grid (24 tiles)</p>
            </button>
            
            <button 
              className="card" 
              style={{ padding: 'var(--space-lg)', borderLeft: '4px solid var(--accent-pink)', textAlign: 'left', cursor: 'pointer', backgroundColor: 'var(--surface)' }}
              onClick={() => setSize(6)}
            >
              <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-xs)' }}>35 Puzzle</h2>
              <p style={{ color: 'var(--text-secondary)' }}>6 × 6 grid (35 tiles)</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Top navigation bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '400px', marginBottom: '1.5rem' }}>
          <Link href="/" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            ← Back to Home
          </Link>
          <Link href="/about" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            📖 Rules
          </Link>
        </div>

        <h1 style={{ marginBottom: 'var(--space-md)' }}>{getTitle()}</h1>
        
        <div style={{ width: '100%', maxWidth: '400px', marginBottom: 'var(--space-md)' }}>
          <div className="stats-row" style={{ display: 'flex', gap: 'var(--space-md)' }}>
            <div className="stat-item" style={{ flex: 1, backgroundColor: 'var(--surface-card)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div className="stat-label" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-xs)' }}>Moves</div>
              <div className="stat-value" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{moves}</div>
            </div>
            <div className="stat-item" style={{ flex: 1, backgroundColor: 'var(--surface-card)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div className="stat-label" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-xs)' }}>Time</div>
              <div className="stat-value" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                <Timer isRunning={timerRunning} onTimeUpdate={setTimeElapsed} reset={resetTimer} />
              </div>
            </div>
          </div>
        </div>

        <div className="controls-row" style={{ display: 'flex', width: '100%', maxWidth: '400px', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
          <button className="btn btn-secondary" onClick={() => setSize(null)}>
            ← Choose Size
          </button>
          <button className="btn btn-primary" onClick={startNewGame}>
            Shuffle
          </button>
        </div>

        {tiles.length > 0 && <PuzzleBoard tiles={tiles} onTileClick={handleTileClick} size={size} />}

        <GameResult
          show={showResult}
          title="You solved it! 🎉"
          stats={[
            { label: 'Moves', value: moves },
            { label: 'Time', value: `${Math.floor(timeElapsed / 60)}:${(timeElapsed % 60).toString().padStart(2, '0')}` }
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
