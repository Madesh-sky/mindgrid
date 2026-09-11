'use client';
import { useState, useEffect } from 'react';
import { GameResultProps } from '@/types';
import PlayerNameInput from './PlayerNameInput';

export default function GameResult({
  show,
  title,
  stats,
  onSave,
  onPlayAgain,
  onClose,
  playerNameLabel = 'Player Name',
  showPlayerX,
  defaultPlayerName = '',
  defaultPlayerX = '',
  defaultPlayerO = '',
}: GameResultProps) {
  const [name, setName] = useState(defaultPlayerName);
  const [nameX, setNameX] = useState(defaultPlayerX);
  const [nameO, setNameO] = useState(defaultPlayerO);

  useEffect(() => {
    if (defaultPlayerName) setName(defaultPlayerName);
    if (defaultPlayerX) setNameX(defaultPlayerX);
    if (defaultPlayerO) setNameO(defaultPlayerO);
  }, [defaultPlayerName, defaultPlayerX, defaultPlayerO]);

  if (!show) return null;

  const handleSave = () => {
    if (showPlayerX) {
      onSave({
        playerName: `${nameX || 'Player X'} vs ${nameO || 'Player O'}`,
        playerX: nameX || 'Player X',
        playerO: nameO || 'Player O',
      });
    } else {
      const finalName = name.trim() || 'Player';
      onSave({ playerName: finalName, player: finalName });
    }
    onClose?.();
  };

  const handleClose = () => {
    onClose?.();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '1.5rem',
            cursor: 'pointer',
            lineHeight: 1,
          }}
          title="Close without saving"
          aria-label="Close"
        >
          &times;
        </button>

        <h2>{title}</h2>
        <div style={{ margin: 'var(--space-md) 0' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{s.label}:</span>
              <span style={{ fontWeight: 'bold' }}>{s.value}</span>
            </div>
          ))}
        </div>

        {showPlayerX ? (
          <>
            <PlayerNameInput label="Player X Name" value={nameX} onChange={setNameX} placeholder="Player X" />
            <PlayerNameInput label="Player O Name" value={nameO} onChange={setNameO} placeholder="Player O" />
          </>
        ) : (
          <PlayerNameInput label={playerNameLabel} value={name} onChange={setName} placeholder="Enter your name" />
        )}

        <div
          className="modal-actions"
          style={{
            marginTop: 'var(--space-lg)',
            display: 'flex',
            gap: 'var(--space-sm)',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button className="btn btn-secondary" onClick={handleClose} title="Close without saving">
            Close
          </button>
          <button className="btn btn-secondary" onClick={onPlayAgain}>
            Play Again
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}
