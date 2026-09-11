import styles from './Tile.module.css';

interface TileProps {
  value: number | null;
}

export default function Tile({ value }: TileProps) {
  const isLarge = value && value >= 1024;
  const isMedium = value && value > 64 && value < 1024;
  
  return (
    <div 
      className={`${styles.tile} ${value ? styles[`tile-${value > 2048 ? 'super' : value}`] : styles.empty}`}
      data-value={value}
    >
      <span className={`
        ${styles.inner} 
        ${isLarge ? styles.largeText : ''} 
        ${isMedium ? styles.mediumText : ''}
      `}>
        {value}
      </span>
    </div>
  );
}
