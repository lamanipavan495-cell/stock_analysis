export const API_BASE = 'http://127.0.0.1:8000'

export const COLORS = {
    bull: '#00E676',
    bear: '#FF3B30',
    surface: '#0F0F11',
    elevated: '#17171B',
    borderDim: '#24242A',
    textPrimary: '#EDEDED',
    textSecondary: '#8B8B9E',
    textDim: '#55555F',
};

export const fmt = {
    price: (n) => Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    volume: (n) => {
        if (!n && n !== 0) return '—';
        const abs = Math.abs(n);
        if (abs >= 1e9) return (n / 1e9).toFixed(2) + 'B';
        if (abs >= 1e6) return (n / 1e6).toFixed(2) + 'M';
        if (abs >= 1e3) return (n / 1e3).toFixed(2) + 'K';
        return String(n);
    },
    pct: (n) => `${n >= 0 ? '+' : ''}${Number(n).toFixed(2)}%`,
    signed: (n) => `${n >= 0 ? '+' : ''}${Number(n).toFixed(2)}`,
    date: (iso) => {
        const d = typeof iso === 'string' ? new Date(iso) : iso;
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    },
};
