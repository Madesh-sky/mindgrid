import React from 'react';
import { XOCell as XOCellType } from '@/types';
import styles from './XOCell.module.css';

interface XOCellProps {
  value: XOCellType;
  onClick: () => void;
  disabled: boolean;
}

export default function XOCell({ value, onClick, disabled }: XOCellProps) {
  return (
    <button
      className={`${styles.cell} ${value === 'X' ? styles.x : ''} ${value === 'O' ? styles.o : ''}`}
      onClick={onClick}
      disabled={disabled || value !== null}
      aria-label={value ? `Cell occupied by ${value}` : 'Empty cell'}
    >
      {value}
    </button>
  );
}
