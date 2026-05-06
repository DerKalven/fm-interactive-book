type ValueCardProps = {
  title: string;
  value: string;
  subtitle?: string;
};

export function ValueCard({ title, value, subtitle }: ValueCardProps) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white/80 p-4 shadow-sm backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{title}</p>
      <p className="mt-2 font-serif text-2xl font-semibold text-stone-950">{value}</p>
      {subtitle ? <p className="mt-1 text-sm text-stone-600">{subtitle}</p> : null}
    </div>
  );
}
