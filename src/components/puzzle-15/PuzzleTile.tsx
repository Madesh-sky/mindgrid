import styles from './PuzzleTile.module.css';

interface PuzzleTileProps {
  value: number;
  onClick: () => void;
  canMove: boolean;
  size?: number;
}

export default function PuzzleTile({ value, onClick, canMove, size = 4 }: PuzzleTileProps) {
  if (value === 0) {
    return <div className={styles.emptyTile}></div>;
  }

  const fontSizeClass = size === 4 ? styles.size4 : size === 5 ? styles.size5 : styles.size6;

  return (
    <div 
      className={`${styles.tile} ${fontSizeClass} ${canMove ? styles.movable : ''}`}
      onClick={canMove ? onClick : undefined}
    >
      {value}
    </div>
  );
}
