import { BlockMath, InlineMath } from "react-katex";
import { formatCurrency, formatPercent } from "@/lib/financial-math/formatters";

type FormulaPanelProps = {
  principal: number;
  rate: number;
  selectedTime: number;
  simpleAmount: number;
  compoundAmount: number;
  model: "simple" | "compound" | "both";
};

export function FormulaPanel({
  principal,
  rate,
  selectedTime,
  simpleAmount,
  compoundAmount,
  model,
}: FormulaPanelProps) {
  const showSimple = model === "simple" || model === "both";
  const showCompound = model === "compound" || model === "both";

  return (
    <section className="rounded-3xl border border-stone-200 bg-white/85 p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="font-serif text-2xl font-semibold text-stone-950">Formula panel</h2>
        <p className="mt-1 text-sm text-stone-600">
          The accumulation function <InlineMath math="a(t)" /> tracks the growth of one unit. The amount
          function <InlineMath math="A(t)" /> scales that growth by the principal.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {showSimple ? (
          <div className="rounded-2xl bg-stone-50 p-4">
            <h3 className="font-semibold text-stone-900">Simple interest</h3>
            <BlockMath math="a(t)=1+it" />
            <BlockMath math="A(t)=P(1+it)" />
            <p className="text-sm text-stone-700">
              With <strong>P = {formatCurrency(principal)}</strong>, <strong>i = {formatPercent(rate)}</strong>, and{" "}
              <strong>t = {selectedTime}</strong>:
            </p>
            <BlockMath math={`A(${selectedTime})=${principal}(1+${rate.toFixed(4)}\\cdot ${selectedTime})=${simpleAmount.toFixed(2)}`} />
          </div>
        ) : null}

        {showCompound ? (
          <div className="rounded-2xl bg-stone-50 p-4">
            <h3 className="font-semibold text-stone-900">Compound interest</h3>
            <BlockMath math="a(t)=(1+i)^t" />
            <BlockMath math="A(t)=P(1+i)^t" />
            <p className="text-sm text-stone-700">
              With <strong>P = {formatCurrency(principal)}</strong>, <strong>i = {formatPercent(rate)}</strong>, and{" "}
              <strong>t = {selectedTime}</strong>:
            </p>
            <BlockMath math={`A(${selectedTime})=${principal}(1+${rate.toFixed(4)})^{${selectedTime}}=${compoundAmount.toFixed(2)}`} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
