'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UltimateXOState } from '@/types';
import { createInitialState, getPlayableBoards, makeMove } from '@/lib/ultimate-xo';
import { XO3x3State, createInitial3x3State, makeMove3x3, getWinningLine3x3 } from '@/lib/xo-3x3';
import { recordGameResult } from '@/lib/storage';
import UltimateBoard from '@/components/ultimate-xo/UltimateBoard';
import XO3x3Board from '@/components/xo-3x3/XO3x3Board';
import GameResult from '@/components/GameResult';
import styles from './page.module.css';

export default function UltimateXOPage() {
  const [gameState, setGameState] = useState<UltimateXOState>(createInitialState());
  const [gameState3x3, setGameState3x3] = useState<XO3x3State>(createInitial3x3State());
  const [playerXName, setPlayerXName] = useState('Player 1');
  const [playerOName, setPlayerOName] = useState('Player 2');
  const [gameMode, setGameMode] = useState<'3x3' | '9x9' | null>(null);
  const [appState, setAppState] = useState<'select' | 'setup' | 'play'>('select');
  const [showResult, setShowResult] = useState(false);

  const playableBoards = getPlayableBoards(gameState);
  const winningLine3x3 = getWinningLine3x3(gameState3x3.board);

  useEffect(() => {
    if (gameMode === '9x9' && gameState.gameOver) {
      setShowResult(true);
    } else if (gameMode === '3x3' && gameState3x3.gameOver) {
      setShowResult(true);
    }
  }, [gameState.gameOver, gameState3x3.gameOver, gameMode]);

  const handleModeSelect = (mode: '3x3' | '9x9') => {
    setGameMode(mode);
    setAppState('setup');
  };

  const handleStart = () => {
    if (playerXName.trim() && playerOName.trim()) {
      if (gameMode === '9x9') {
        setGameState(createInitialState());
      } else {
        setGameState3x3(createInitial3x3State());
      }
      setAppState('play');
      setShowResult(false);
    }
  };

  const handleCellClick9x9 = (boardIdx: number, cellIdx: number) => {
    const newState = makeMove(gameState, boardIdx, cellIdx);
    if (newState) {
      setGameState(newState);
    }
  };

  const handleCellClick3x3 = (cellIdx: number) => {
    const newState = makeMove3x3(gameState3x3, cellIdx);
    if (newState) {
      setGameState3x3(newState);
    }
  };

  const handleRestart = () => {
    if (gameMode === '9x9') {
      setGameState(createInitialState());
    } else {
      setGameState3x3(createInitial3x3State());
    }
    setShowResult(false);
  };

  const handleChangeMode = () => {
    setAppState('select');
    setGameMode(null);
    setShowResult(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSaveResult = async (playerInfo?: any) => {
    const pX = playerInfo?.playerX || playerXName || 'Player 1';
    const pO = playerInfo?.playerO || playerOName || 'Player 2';

    let result = 'Draw';
    let moves = 0;
    
    if (gameMode === '9x9') {
      if (gameState.overallWinner === 'X') result = `${pX} won`;
      else if (gameState.overallWinner === 'O') result = `${pO} won`;
      moves = gameState.moveCount;
    } else {
      if (gameState3x3.winner === 'X') result = `${pX} won`;
      else if (gameState3x3.winner === 'O') result = `${pO} won`;
      moves = gameState3x3.moveCount;
    }

    await recordGameResult({
      playerName: `${pX} vs ${pO}`,
      playerX: pX,
      playerO: pO,
      game: 'xo',
      gameMode: gameMode || undefined,
      result,
      moves,
    });

    setShowResult(false);
  };

  const title = appState === 'select' ? 'Tic-Tac-Toe' : (gameMode === '3x3' ? 'Classic XO (3×3)' : 'Ultimate XO (9×9)');
  
  const currentTurn = gameMode === '9x9' ? gameState.currentPlayer : gameState3x3.currentPlayer;
  const currentMoves = gameMode === '9x9' ? gameState.moveCount : gameState3x3.moveCount;
  const maxMoves = gameMode === '9x9' ? 81 : 9;
  
  const winner = gameMode === '9x9' ? gameState.overallWinner : gameState3x3.winner;
  const winnerName = winner === 'X' ? playerXName : winner === 'O' ? playerOName : null;

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

      <h1 className={styles.title}>{title}</h1>

      {appState === 'select' && (
        <div className={styles.modeSelector}>
          <div 
            className={`${styles.modeCard} ${styles.modeCard3x3}`}
            onClick={() => handleModeSelect('3x3')}
          >
            <div className={styles.modeTitle}>3 × 3</div>
            <div className={styles.modeDesc}>Classic Tic-Tac-Toe. First to get 3 in a row wins.</div>
          </div>
          <div 
            className={`${styles.modeCard} ${styles.modeCard9x9}`}
            onClick={() => handleModeSelect('9x9')}
          >
            <div className={styles.modeTitle}>9 × 9</div>
            <div className={styles.modeDesc}>Ultimate Tic-Tac-Toe. Win small boards to conquer the big board.</div>
          </div>
        </div>
      )}

      {appState === 'setup' && (
        <div className={styles.setupCard}>
          <div className={styles.inputGroup}>
            <label>Player X Name (Cyan):</label>
            <input
              type="text"
              value={playerXName}
              onChange={(e) => setPlayerXName(e.target.value)}
              className={styles.input}
              maxLength={20}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Player O Name (Pink):</label>
            <input
              type="text"
              value={playerOName}
              onChange={(e) => setPlayerOName(e.target.value)}
              className={styles.input}
              maxLength={20}
            />
          </div>
          <div className="controls-row">
            <button className="btn btn-secondary" onClick={handleChangeMode}>
              ← Change Mode
            </button>
            <button className="btn btn-primary" onClick={handleStart}>
              Start Game
            </button>
          </div>
        </div>
      )}

      {appState === 'play' && (
        <div className={styles.gameArea}>
          <div className={styles.header}>
            <div className={`${styles.playerInfo} ${currentTurn === 'X' ? styles.activeX : ''}`}>
              <span className={styles.playerAvatar}>X</span> {playerXName}
            </div>
            <div className={styles.stats}>
              Move: {currentMoves} / {maxMoves}
            </div>
            <div className={`${styles.playerInfo} ${currentTurn === 'O' ? styles.activeO : ''}`}>
              <span className={styles.playerAvatar}>O</span> {playerOName}
            </div>
          </div>

          {gameMode === '9x9' ? (
            <UltimateBoard
              state={gameState}
              playableBoards={playableBoards}
              onCellClick={handleCellClick9x9}
            />
          ) : (
            <XO3x3Board
              board={gameState3x3.board}
              onCellClick={handleCellClick3x3}
              gameOver={gameState3x3.gameOver}
              winningLine={winningLine3x3}
            />
          )}

          <div className="controls-row" style={{ marginTop: 'var(--space-lg)' }}>
            <button className="btn btn-secondary" onClick={handleChangeMode}>
              ← Choose Mode
            </button>
            <button className="btn btn-primary" onClick={handleRestart}>
              Restart Game
            </button>
          </div>
        </div>
      )}

      {showResult && (
        <GameResult
          show={showResult}
          title={
            winner === 'draw'
              ? 'Draw!'
              : `${winnerName || (winner === 'X' ? 'Player X' : 'Player O')} Wins! 🎉`
          }
          stats={[
            { label: 'Winner', value: winner === 'draw' ? 'Draw' : (winnerName || 'Winner') },
            { label: 'Total Moves', value: currentMoves.toString() },
            { label: 'Game Mode', value: gameMode === '9x9' ? 'Ultimate XO (9×9)' : 'Classic XO (3×3)' },
          ]}
          showPlayerX={true}
          defaultPlayerX={playerXName}
          defaultPlayerO={playerOName}
          onSave={handleSaveResult}
          onPlayAgain={handleRestart}
          onClose={() => {
            handleSaveResult({ playerX: playerXName, playerO: playerOName });
          }}
        />
      )}
    </div>
  );
}
