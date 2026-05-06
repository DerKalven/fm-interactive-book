import { formatCurrency } from "@/lib/financial-math/formatters";

type DecompositionBarProps = {
  principal: number;
  interest: number;
  label: string;
};

export function DecompositionBar({ principal, interest, label }: DecompositionBarProps) {
  const total = Math.max(principal + interest, 1);
  const principalWidth = Math.max(8, (principal / total) * 100);
  const interestWidth = Math.max(0, (interest / total) * 100);

  return (
    <div className="rounded-3xl border border-stone-200 bg-white/85 p-5 shadow-sm">
      <h2 className="font-serif text-2xl font-semibold text-stone-950">Principal + Interest</h2>
      <p className="mt-1 text-sm text-stone-600">{label}</p>

      <div className="mt-4 overflow-hidden rounded-full border border-stone-300 bg-stone-100" aria-label={label}>
        <div className="flex h-8 w-full">
          <div
            className="flex items-center justify-center bg-stone-900 text-xs font-semibold text-white"
            style={{ width: `${principalWidth}%` }}
          >
            Principal
          </div>
          <div
            className="flex items-center justify-center bg-stone-500 text-xs font-semibold text-white"
            style={{ width: `${interestWidth}%` }}
          >
            Interest
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-sm text-stone-700 md:grid-cols-3">
        <p><strong>Principal:</strong> {formatCurrency(principal)}</p>
        <p><strong>Interest earned:</strong> {formatCurrency(interest)}</p>
        <p><strong>Total:</strong> {formatCurrency(principal + interest)}</p>
      </div>
    </div>
  );
}
