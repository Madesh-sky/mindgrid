import Link from 'next/link';
import { GameCardProps } from '@/types';
import styles from './GameCard.module.css';

export default function GameCard({ title, description, icon, href, accentColor }: GameCardProps) {
  return (
    <Link href={href} className={`${styles.card} card`} style={{ '--card-accent': `var(${accentColor})` } as React.CSSProperties}>
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <div className={styles.footer}>
        <span className={`${styles.playBtn} btn btn-sm`}>Play Game →</span>
      </div>
    </Link>
  );
}
