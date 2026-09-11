import React from 'react';
import styles from './SudokuCell.module.css';

interface SudokuCellProps {
  value: number | null;
  isPrefilled: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  isInvalid: boolean;
  onClick: () => void;
  row: number;
  col: number;
}

export const SudokuCell: React.FC<SudokuCellProps> = ({
  value,
  isPrefilled,
  isSelected,
  isHighlighted,
  isInvalid,
  onClick,
  row,
  col
}) => {
  return (
    <div
      className={`
        ${styles.cell}
        ${isPrefilled ? styles.prefilled : styles.user}
        ${isSelected ? styles.selected : ''}
        ${isHighlighted && !isSelected ? styles.highlighted : ''}
        ${isInvalid ? styles.invalid : ''}
        ${row % 3 === 2 && row !== 8 ? styles.borderBottom : ''}
        ${col % 3 === 2 && col !== 8 ? styles.borderRight : ''}
      `}
      onClick={onClick}
    >
      {value || ''}
    </div>
  );
};
