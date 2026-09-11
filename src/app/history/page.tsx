'use client';

import React, { useState, useEffect } from 'react';
import { GameResultData } from '@/types';
import { getLocalHistory } from '@/lib/storage';
import Link from 'next/link';

type TabType = 'all' | 'sudoku' | 'xo' | '2048' | '15-puzzle' | '24-puzzle' | '35-puzzle';

const tabs: { value: TabType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'sudoku', label: 'Sudoku' },
  { value: 'xo', label: 'XO' },
  { value: '2048', label: '2048' },
  { value: '15-puzzle', label: '15 Puzzle' },
  { value: '24-puzzle', label: '24 Puzzle' },
  { value: '35-puzzle', label: '35 Puzzle' },
];

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [data, setData] = useState<GameResultData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const allLocal = getLocalHistory();
      let filteredLocal = allLocal;
      if (activeTab !== 'all') {
        if (activeTab === 'xo') {
          filteredLocal = allLocal.filter(h => h.game === 'xo' || h.game === 'ultimate-xo' || h.game === 'XO');
        } else {
          filteredLocal = allLocal.filter(h => h.game === activeTab || h.game?.toLowerCase() === activeTab.toLowerCase());
        }
      }

      try {
        const res = await fetch(`/api/games?game=${activeTab}`);
        if (res.ok) {
          const result = await res.json();
          const serverEntries: GameResultData[] = result.results || [];
          
          // Merge local and server entries
          const seen = new Set<string>();
          const merged: GameResultData[] = [];

          for (const item of [...filteredLocal, ...serverEntries]) {
            const key = `${item.playerName}_${item.game}_${item.score}_${item.moves}_${item.time}_${item.createdAt?.slice(0, 19)}`;
            if (!seen.has(key)) {
              seen.add(key);
              merged.push(item);
            }
          }
          setData(merged.length > 0 ? merged : filteredLocal);
        } else {
          setData(filteredLocal);
        }
      } catch (error) {
        console.warn('History API fetch failed, displaying local history:', error);
        setData(filteredLocal);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [activeTab]);

  const formatTime = (seconds?: number) => {
    if (seconds === undefined || isNaN(seconds)) return '-';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '-';
    }
  };

  const formatWinnerResult = (entry: GameResultData) => {
    const r = entry.result || '';
    if (entry.game === 'xo' || entry.game === 'ultimate-xo' || entry.game === 'XO') {
      if (r === 'X wins' || r === 'X won' || r.toLowerCase().includes('x win')) {
        return `${entry.playerX || 'Player 1'} won`;
      }
      if (r === 'O wins' || r === 'O won' || r.toLowerCase().includes('o win')) {
        return `${entry.playerO || 'Player 2'} won`;
      }
      if (r.toLowerCase() === 'draw') {
        return 'Draw';
      }
    }
    return r;
  };

  return (
    <main className="page" style={{ padding: '2rem', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link href="/" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            ← Back to Home
          </Link>
        </div>

        <h1 className="page-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#fff' }}>Game History</h1>
        <p className="page-subtitle" style={{ fontSize: '1.2rem', color: '#aaa', marginBottom: '2rem' }}>Your completed games</p>

        <div className="filter-tabs" style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button
              key={tab.value}
              className={`filter-tab ${activeTab === tab.value ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.value)}
              style={{
                padding: '0.5rem 1.25rem',
                border: 'none',
                borderRadius: '8px',
                background: activeTab === tab.value ? 'var(--accent-pink)' : 'var(--surface)',
                color: activeTab === tab.value ? '#000' : '#fff',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="card" style={{ overflowX: 'auto', padding: '1.5rem', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#aaa' }}>Loading...</div>
          ) : data.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#aaa' }}>No game history found. Play games to see your history!</div>
          ) : (
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#fff' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--accent-pink)' }}>
                  <th style={{ padding: '1rem' }}>Player</th>
                  <th style={{ padding: '1rem' }}>Game</th>
                  <th style={{ padding: '1rem' }}>Mode</th>
                  <th style={{ padding: '1rem' }}>Score</th>
                  <th style={{ padding: '1rem' }}>Result</th>
                  <th style={{ padding: '1rem' }}>Moves</th>
                  <th style={{ padding: '1rem' }}>Time</th>
                  <th style={{ padding: '1rem' }}>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry, idx) => (
                  <tr key={entry._id || idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '1rem' }}>
                      {entry.game === 'xo' || entry.game === 'ultimate-xo'
                        ? `${entry.playerX || 'Player 1'} vs ${entry.playerO || 'Player 2'}`
                        : entry.playerName || 'Player'}
                    </td>
                    <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{entry.game}</td>
                    <td style={{ padding: '1rem' }}>{entry.gameMode || '-'}</td>
                    <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--accent-amber)' }}>{entry.score ?? '-'}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        color: entry.result?.toLowerCase().includes('win') || entry.result?.toLowerCase().includes('won') ? '#4ade80' : 
                               entry.result?.toLowerCase().includes('lose') || entry.result?.toLowerCase().includes('game-over') ? '#f87171' : 
                               entry.result?.toLowerCase().includes('draw') ? '#fbbf24' : 'inherit',
                        fontWeight: 'bold'
                      }}>
                        {formatWinnerResult(entry)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>{entry.moves ?? '-'}</td>
                    <td style={{ padding: '1rem' }}>{formatTime(entry.time)}</td>
                    <td style={{ padding: '1rem', color: '#aaa' }}>{formatDate(entry.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
