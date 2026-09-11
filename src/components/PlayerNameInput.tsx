interface PlayerNameInputProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  placeholder?: string;
}

export default function PlayerNameInput({ value, onChange, label, placeholder }: PlayerNameInputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)', marginBottom: 'var(--space-sm)' }}>
      {label && <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{label}</label>}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          padding: 'var(--space-sm)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-medium)',
          background: 'var(--surface)',
          color: 'var(--text-primary)',
          fontSize: '1rem',
          outline: 'none'
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--accent-cyan)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--border-medium)'}
      />
    </div>
  );
}
