import { ScoreBoardItem } from '@/types';

export default function ScoreBoard({ items }: { items: ScoreBoardItem[] }) {
  return (
    <div className="stats-row">
      {items.map((item, idx) => (
        <div key={idx} className="stat-item">
          <div className="stat-label">{item.label}</div>
          <div className="stat-value">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
