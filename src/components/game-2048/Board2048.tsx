import { Board2048 as BoardType } from '@/types';
import Tile from './Tile';
import styles from './Board2048.module.css';

interface Board2048Props {
  board: BoardType;
}

export default function Board2048({ board }: Board2048Props) {
  return (
    <div className={styles.boardContainer}>
      <div className={styles.board}>
        {board.map((row, rIndex) => (
          row.map((cell, cIndex) => (
            <Tile key={`${rIndex}-${cIndex}`} value={cell} />
          ))
        ))}
      </div>
    </div>
  );
}
