import React from 'react';
import styles from './SudokuBoard.module.css';
import { SudokuCell } from './SudokuCell';
import { SudokuBoard as BoardType } from '@/types';

interface SudokuBoardProps {
  puzzle: BoardType;
  userBoard: BoardType;
  selectedCell: { row: number; col: number } | null;
  onCellClick: (row: number, col: number) => void;
  invalidCells: Set<string>;
}

export const SudokuBoard: React.FC<SudokuBoardProps> = ({
  puzzle,
  userBoard,
  selectedCell,
  onCellClick,
  invalidCells,
}) => {
  const isHighlighted = (r: number, c: number) => {
    if (!selectedCell) return false;
    const { row, col } = selectedCell;
    const sameRow = r === row;
    const sameCol = c === col;
    const sameBox = Math.floor(r / 3) === Math.floor(row / 3) && Math.floor(c / 3) === Math.floor(col / 3);
    return sameRow || sameCol || sameBox;
  };

  return (
    <div className={styles.boardContainer}>
      <div className={styles.board}>
        {userBoard.map((row, r) =>
          row.map((cell, c) => (
            <SudokuCell
              key={`${r}-${c}`}
              row={r}
              col={c}
              value={cell}
              isPrefilled={puzzle[r][c] !== null}
              isSelected={selectedCell?.row === r && selectedCell?.col === c}
              isHighlighted={isHighlighted(r, c)}
              isInvalid={invalidCells.has(`${r}-${c}`)}
              onClick={() => onCellClick(r, c)}
            />
          ))
        )}
      </div>
    </div>
  );
};
