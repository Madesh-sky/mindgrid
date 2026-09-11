import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="page">
      <div className="container">
        <div style={{ marginBottom: '1.5rem' }}>
          <Link href="/" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            ← Back to Home
          </Link>
        </div>

        <h1 style={{ marginBottom: '1rem', textAlign: 'center' }}>About MindGrid</h1>
        
        <p className="text-secondary" style={{ marginBottom: '3rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
          MindGrid is a collection of mathematical and logic games designed to challenge and entertain. 
          Whether you're looking to sharpen your mind with classic number puzzles, engage in strategic board games, 
          or test your spatial reasoning, MindGrid offers a variety of experiences for all puzzle enthusiasts.
        </p>

        <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Game Rules & Scoring</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* 1. Sudoku */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-cyan)' }}>1. Sudoku</h3>
            <ul className="text-secondary" style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Uses a 9×9 grid divided into nine 3×3 subgrids.</li>
              <li>Fill empty cells with numbers 1–9.</li>
              <li>No repeated number in any row.</li>
              <li>No repeated number in any column.</li>
              <li>No repeated number in any 3×3 subgrid.</li>
              <li>Some cells are pre-filled clues and cannot be modified.</li>
              <li>Objective: Correctly complete the entire grid without exceeding mistakes.</li>
              <li>Difficulty levels: Easy (more clues given), Medium (moderate clues), Hard (fewer clues).</li>
              <li><strong>Leaderboard:</strong> Ranked by fastest completion time and fewest mistakes.</li>
            </ul>
          </div>

          {/* 2. XO — 3×3 Tic-Tac-Toe */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-pink)' }}>2. XO — 3×3 Tic-Tac-Toe</h3>
            <ul className="text-secondary" style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Played on a classic 3×3 grid.</li>
              <li>Two players: Player X and Player O. Player X goes first.</li>
              <li>Players take turns placing their symbol in an empty cell.</li>
              <li>A player wins by getting three symbols in a row (horizontal, vertical, or diagonal).</li>
              <li>If all 9 cells are filled with no three in a row, the game is a draw.</li>
              <li>No computer opponent — strictly human-versus-human match.</li>
              <li><strong>Leaderboard & History:</strong> Records the names of both players and displays the winner (e.g. &quot;Player 1 won&quot;).</li>
            </ul>
          </div>

          {/* 3. XO — 9×9 Ultimate Tic-Tac-Toe */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-green)' }}>3. XO — 9×9 Ultimate Tic-Tac-Toe</h3>
            <ul className="text-secondary" style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>The board is a 9×9 grid divided into nine separate 3×3 small boards.</li>
              <li>Two players: Player X and Player O. Player X starts.</li>
              <li>Winning three in a row within a small 3×3 board claims that entire small board for the player.</li>
              <li>
                The position where a player makes their move directs the next player to that corresponding small board:
                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <li>Top-left cell → top-left small board</li>
                  <li>Top-middle cell → top-middle small board</li>
                  <li>Top-right cell → top-right small board</li>
                  <li>Middle-left cell → middle-left small board</li>
                  <li>Center cell → center small board</li>
                  <li>Middle-right cell → middle-right small board</li>
                  <li>Bottom-left cell → bottom-left small board</li>
                  <li>Bottom-middle cell → bottom-middle small board</li>
                  <li>Bottom-right cell → bottom-right small board</li>
                </ul>
              </li>
              <li><strong>Free Choice Rule:</strong> If the required small board has already been won or is completely full, the active player may choose any available cell on any open small board.</li>
              <li><strong>Win condition:</strong> Win three small boards in a row (horizontal, vertical, or diagonal) on the large 3×3 grid layout.</li>
              <li><strong>Tie-break Rule:</strong> If all playable cells are exhausted without a 3-in-a-row of boards, the player with the most claimed boards wins (majority rule).</li>
              <li>No computer opponent — strictly human-versus-human match.</li>
            </ul>
          </div>

          {/* 4. 2048 */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-amber)' }}>4. 2048</h3>
            <ul className="text-secondary" style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li>Played on a 4×4 grid with numbered tiles.</li>
              <li><strong>Sliding Mechanics:</strong> Moving in any direction (Up, Down, Left, Right via Arrow Keys or buttons) slides <em>all</em> tiles on the board simultaneously as far as they can travel in that direction until they hit the grid boundary or another tile. (This is like tilting a tray; it is NOT folding).</li>
              <li><strong>Collisions & Merging:</strong> 
                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <li>When two tiles with the <strong>same number</strong> collide, they merge into a single tile with double the value (e.g., 2+2=4, 4+4=8, 8+8=16, ..., 1024+1024=2048).</li>
                  <li>When tiles with <strong>different numbers</strong> collide (e.g., a 2 and a 4), they do <strong>not</strong> merge; they simply stop against one another side-by-side.</li>
                  <li>Each tile can only merge once per turn.</li>
                </ul>
              </li>
              <li><strong>Tile Spawn:</strong> After each valid slide that changes the board, a new tile (value 2 or 4) randomly appears in an empty space.</li>
              <li><strong>Score Calculation:</strong> Every time two tiles merge, the value of the newly created tile is added directly to your score. For example, merging two 4s to create an 8 adds +8 points; merging two 16s to create a 32 adds +32 points; creating a 2048 tile adds +2048 points. The more merges you make, the higher your score grows!</li>
              <li><strong>Objective:</strong> Merge tiles strategically to create a tile with the value <strong>2048</strong>!</li>
              <li><strong>Game Over:</strong> When the board fills up and no more valid merges can be made in any direction.</li>
            </ul>
          </div>

          {/* 5. 15 Puzzle (4×4) */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-cyan)' }}>5. 15 Puzzle (4×4)</h3>
            <ul className="text-secondary" style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>4×4 board containing tiles numbered 1 to 15 and one empty slot.</li>
              <li>Only tiles directly adjacent (horizontal or vertical) to the empty slot can slide into it.</li>
              <li>Objective: Order the tiles sequentially from 1 to 15, with the empty space at the bottom-right corner.</li>
              <li>Solvability: Every shuffled puzzle is guaranteed solvable.</li>
            </ul>
          </div>

          {/* 6. 24 Puzzle (5×5) */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-pink)' }}>6. 24 Puzzle (5×5)</h3>
            <ul className="text-secondary" style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>5×5 board containing tiles numbered 1 to 24 and one empty slot.</li>
              <li>Same sliding mechanics as the 15 Puzzle.</li>
              <li>Objective: Order tiles sequentially from 1 to 24, leaving the empty slot at the bottom-right.</li>
            </ul>
          </div>

          {/* 7. 35 Puzzle (6×6) */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-green)' }}>7. 35 Puzzle (6×6)</h3>
            <ul className="text-secondary" style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>6×6 board containing tiles numbered 1 to 35 and one empty slot.</li>
              <li>Same sliding mechanics as the 15 Puzzle.</li>
              <li>Objective: Order tiles sequentially from 1 to 35, leaving the empty slot at the bottom-right.</li>
            </ul>
            <p className="text-secondary" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <strong>For all Sliding Puzzles:</strong> Track your total move count and elapsed time. Results are recorded in the Leaderboard and Game History.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
