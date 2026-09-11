import GameCard from '@/components/GameCard';

export default function Home() {
  const games = [
    {
      title: 'Sudoku',
      description: 'Fill the 9×9 grid with numbers 1-9',
      difficulty: 'Medium',
      icon: '🔢',
      href: '/games/sudoku',
      accentColor: '--accent-cyan'
    },
    {
      title: 'XO',
      description: 'Classic 3×3 or strategic 9×9 Ultimate',
      difficulty: 'Varies',
      icon: '⭕',
      href: '/games/ultimate-xo',
      accentColor: '--accent-pink'
    },
    {
      title: '2048',
      description: 'Slide and merge tiles to reach 2048',
      difficulty: 'Medium',
      icon: '🎯',
      href: '/games/game-2048',
      accentColor: '--accent-amber'
    },
    {
      title: 'Sliding Puzzle',
      description: '15, 24, or 35 piece sliding puzzle',
      difficulty: 'Easy',
      icon: '🧩',
      href: '/games/puzzle-15',
      accentColor: '--accent-green'
    }
  ] as const;

  return (
    <div className="page container">
      <section style={{ textAlign: 'center', margin: 'var(--space-2xl) 0', padding: 'var(--space-xl) 0' }}>
        <h1 className="page-title" style={{ 
          fontSize: '4rem', 
          background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-pink))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 'var(--space-sm)'
        }}>MindGrid</h1>
        <p className="page-subtitle" style={{ fontSize: '1.5rem' }}>Challenge Your Mind.</p>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          A collection of mathematical and logic games designed to test your strategic thinking, pattern recognition, and problem-solving skills.
        </p>
      </section>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 style={{ margin: 0 }}>Featured Games</h2>
          <a href="/about" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            📖 Game Rules & Guide →
          </a>
        </div>
        <div className="game-grid">
          {games.map((game, i) => (
            <GameCard key={i} {...game} />
          ))}
        </div>
      </section>
    </div>
  );
}
