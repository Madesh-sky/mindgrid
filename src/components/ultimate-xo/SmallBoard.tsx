import React from 'react';
import { SmallBoardState, SmallBoardWinner } from '@/types';
import XOCell from './XOCell';
import styles from './SmallBoard.module.css';

interface SmallBoardProps {
  cells: SmallBoardState;
  winner: SmallBoardWinner;
  isPlayable: boolean;
  boardIdx: number;
  onCellClick: (boardIdx: number, cellIdx: number) => void;
}

export default function SmallBoard({ cells, winner, isPlayable, boardIdx, onCellClick }: SmallBoardProps) {
  return (
    <div className={`${styles.smallBoard} ${isPlayable ? styles.playable : ''} ${!isPlayable ? styles.dimmed : ''}`}>
      {winner && (
        <div className={`${styles.overlay} ${winner === 'X' ? styles.x : winner === 'O' ? styles.o : styles.draw}`}>
          {winner !== 'draw' ? winner : '-'}
        </div>
      )}
      <div className={styles.grid}>
        {cells.map((cell, idx) => (
          <XOCell
            key={idx}
            value={cell}
            onClick={() => onCellClick(boardIdx, idx)}
            disabled={!isPlayable || winner !== null}
          />
        ))}
      </div>
    </div>
  );
}
