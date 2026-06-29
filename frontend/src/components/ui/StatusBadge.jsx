const VARIANTS = {
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  mint: 'bg-mint-light text-mint-dark border-mint',
  ghost: 'bg-surface-soft text-gray-500 border-border-strong',
};

const DOTS = {
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  mint: 'bg-mint',
  ghost: 'bg-gray-400',
};

export default function StatusBadge({ variant = 'ghost', label, dot = true }) {
  const cls = VARIANTS[variant] ?? VARIANTS.ghost;
  const dotCls = DOTS[variant] ?? DOTS.ghost;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotCls}`} />}
      {label}
    </span>
  );
}
