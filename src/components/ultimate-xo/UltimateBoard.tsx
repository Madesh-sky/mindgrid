import React from 'react';
import { UltimateXOState } from '@/types';
import SmallBoard from './SmallBoard';
import styles from './UltimateBoard.module.css';

interface UltimateBoardProps {
  state: UltimateXOState;
  playableBoards: number[];
  onCellClick: (boardIdx: number, cellIdx: number) => void;
}

export default function UltimateBoard({ state, playableBoards, onCellClick }: UltimateBoardProps) {
  return (
    <div className={styles.ultimateBoard}>
      {state.boards.map((boardCells, boardIdx) => (
        <SmallBoard
          key={boardIdx}
          boardIdx={boardIdx}
          cells={boardCells}
          winner={state.boardWinners[boardIdx]}
          isPlayable={playableBoards.includes(boardIdx)}
          onCellClick={onCellClick}
        />
      ))}
    </div>
  );
}
