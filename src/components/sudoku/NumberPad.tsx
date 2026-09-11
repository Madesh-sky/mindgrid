import React from 'react';
import styles from './NumberPad.module.css';

interface NumberPadProps {
  onNumberSelect: (num: number) => void;
  onErase: () => void;
}

export const NumberPad: React.FC<NumberPadProps> = ({ onNumberSelect, onErase }) => {
  return (
    <div className={styles.container}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <button
          key={num}
          className={`${styles.btn} btn`}
          onClick={() => onNumberSelect(num)}
        >
          {num}
        </button>
      ))}
      <button className={`${styles.btn} ${styles.eraseBtn} btn btn-secondary`} onClick={onErase}>
        Del
      </button>
    </div>
  );
};
