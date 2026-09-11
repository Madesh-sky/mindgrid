import React from 'react';
import { XOCell } from '@/lib/xo-3x3';
import styles from './XO3x3Board.module.css';

interface XO3x3BoardProps {
  board: XOCell[];
  onCellClick: (idx: number) => void;
  gameOver: boolean;
  winningLine: number[] | null;
}

export default function XO3x3Board({ board, onCellClick, gameOver, winningLine }: XO3x3BoardProps) {
  return (
    <div className={styles.board}>
      {board.map((cell, idx) => {
        const isWinningCell = winningLine?.includes(idx);
        return (
          <button
            key={idx}
            className={`${styles.cell} ${cell === 'X' ? styles.cellX : cell === 'O' ? styles.cellO : ''} ${isWinningCell ? styles.winningCell : ''}`}
            onClick={() => onCellClick(idx)}
            disabled={gameOver || cell !== null}
          >
            {cell}
          </button>
        );
      })}
    </div>
  );
}
