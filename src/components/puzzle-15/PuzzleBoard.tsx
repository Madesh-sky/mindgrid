import PuzzleTile from './PuzzleTile';
import styles from './PuzzleBoard.module.css';
import { canMove } from '@/lib/puzzle-15';

interface PuzzleBoardProps {
  tiles: number[];
  onTileClick: (index: number) => void;
  size: number;
}

export default function PuzzleBoard({ tiles, onTileClick, size }: PuzzleBoardProps) {
  return (
    <div className={styles.boardContainer}>
      <div 
        className={styles.board}
        style={{ 
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          '--board-width-mobile': size === 4 ? '320px' : size === 5 ? '360px' : '380px',
          '--board-width-desktop': size === 4 ? '360px' : size === 5 ? '400px' : '420px',
        } as React.CSSProperties}
      >
        {tiles.map((tile, index) => (
          <PuzzleTile
            key={`${tile}-${index}`}
            value={tile}
            canMove={tile !== 0 && canMove(tiles, index, size)}
            onClick={() => onTileClick(index)}
            size={size}
          />
        ))}
      </div>
    </div>
  );
}
