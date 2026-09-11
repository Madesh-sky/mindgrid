'use client';
import { useEffect, useState } from 'react';

const symbols = ['π', '√', '∑', '±', '×', '÷', '∫', '∞', 'Δ', 'φ'];

interface SymbolData {
  id: number;
  char: string;
  left: string;
  top: string;
  animationDuration: string;
  animationDelay: string;
}

export default function MathBackground() {
  const [items, setItems] = useState<SymbolData[]>([]);

  useEffect(() => {
    const generated = symbols.map((char, i) => ({
      id: i,
      char,
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      animationDuration: `${20 + Math.random() * 20}s`,
      animationDelay: `-${Math.random() * 20}s`,
    }));
    setItems(generated);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden'
    }}>
      {items.map((item) => (
        <span
          key={item.id}
          className="math-symbol"
          style={{
            position: 'absolute',
            left: item.left,
            top: item.top,
            opacity: 0.04,
            fontSize: '4rem',
            color: 'var(--text-primary)',
            animation: `drift ${item.animationDuration} infinite alternate ease-in-out`,
            animationDelay: item.animationDelay,
          }}
        >
          {item.char}
        </span>
      ))}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes drift {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(30px, 30px) rotate(20deg); }
        }
      `}} />
    </div>
  );
}
