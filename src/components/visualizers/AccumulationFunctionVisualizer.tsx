"use client";

import { useMemo, useState } from "react";
import { InlineMath } from "react-katex";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AccumulationTimelineAnimation from "./AccumulationTimelineAnimation";

type Mode = "simple" | "compound" | "both";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

function clamp(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function generateGraphData(principal: number, rate: number, years: number) {
  const safeYears = Math.max(years, 0);
  const steps = Math.max(8, Math.round(safeYears * 8)); // smoother graph

  const rows = [];

  for (let i = 0; i <= steps; i++) {
    const t = steps === 0 ? 0 : (safeYears * i) / steps;

    const simpleAmount = principal * (1 + rate * t);
    const compoundAmount = principal * Math.pow(1 + rate, t);

    rows.push({
      t: Number(t.toFixed(2)),
      simpleAmount,
      compoundAmount,
    });
  }

  return rows;
}

export default function AccumulationFunctionVisualizer() {
  const [principalInput, setPrincipalInput] = useState("1000");
  const [rateInput, setRateInput] = useState("8");
  const [yearsInput, setYearsInput] = useState("5");
  const [mode, setMode] = useState<Mode>("both");

  const principal = clamp(Number(principalInput || 0), 0, 1_000_000_000);
  const annualRatePercent = clamp(Number(rateInput || 0), 0, 1000);
  const years = clamp(Number(yearsInput || 0), 0, 100);
  const rate = annualRatePercent / 100;

  const graphData = useMemo(
    () => generateGraphData(principal, rate, years),
    [principal, rate, years]
  );

  const summary = useMemo(() => {
    const simpleInterest = principal * rate * years;
    const simpleAmount = principal + simpleInterest;

    const compoundAmount = principal * Math.pow(1 + rate, years);
    const compoundInterest = compoundAmount - principal;

    return {
      simpleInterest,
      simpleAmount,
      compoundInterest,
      compoundAmount,
    };
  }, [principal, rate, years]);

  return (
    <section className="space-y-8">
      <header className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
          SOA FM · Measurement of Interest
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">
          Accumulation Function
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-7 text-slate-600">
          Explore how money grows under simple interest and compound interest.
          The central animation shows the accumulation process visually, and the
          graph below shows the corresponding amount function using the exact
          values entered by the user.
        </p>
      </header>

      {/* CENTRAL ANIMATION */}
      <AccumulationTimelineAnimation principal={principal} rate={rate} />

      {/* LOWER SECTION */}
      <div className="grid gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
        {/* CONTROLS */}
        <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-950">Controls</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Change the inputs and both the animation and the graph will update
              automatically.
            </p>
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Initial amount (P)
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={principalInput}
                onChange={(e) => setPrincipalInput(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Interest rate per period (%)
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={rateInput}
                onChange={(e) => setRateInput(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Time (t)
              </span>
              <input
                type="number"
                step="0.25"
                min="0"
                value={yearsInput}
                onChange={(e) => setYearsInput(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </label>

            <div>
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Display mode
              </span>

              <div className="grid grid-cols-3 gap-2">
                {(["simple", "compound", "both"] as Mode[]).map((value) => (
                  <button
                    key={value}
                    onClick={() => setMode(value)}
                    className={`rounded-2xl px-3 py-3 text-sm font-medium transition ${
                      mode === value
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {value === "simple"
                      ? "Simple"
                      : value === "compound"
                      ? "Compound"
                      : "Both"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Current inputs
            </p>

            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <p>
                <span className="font-semibold">P = </span>
                {formatCurrency(principal)}
              </p>
              <p>
                <span className="font-semibold">i = </span>
                {annualRatePercent.toFixed(2)}%
              </p>
              <p>
                <span className="font-semibold">t = </span>
                {formatNumber(years)}
              </p>
            </div>
          </div>
        </aside>

        {/* GRAPH + RESULTS */}
        <div className="space-y-8">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                Graph
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                Amount Function A(t)
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                This graph now shows the user-based amount values on the y-axis,
                not the unit accumulation function a(t).
              </p>
            </div>

            <div className="h-[420px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={graphData}
                  margin={{ top: 20, right: 16, left: 16, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="t"
                    tickFormatter={(value) => `${value}`}
                    stroke="#475569"
                    label={{
                      value: "Time t",
                      position: "insideBottom",
                      offset: -10,
                    }}
                  />
                  <YAxis
                    width={90}
                    stroke="#475569"
                    tickFormatter={(value) => formatCurrency(Number(value))}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      formatCurrency(Number(value)),
                      name,
                    ]}
                    labelFormatter={(label) => `t = ${label}`}
                  />
                  <Legend />

                  {(mode === "simple" || mode === "both") && (
                    <Line
                      type="monotone"
                      dataKey="simpleAmount"
                      name="Simple A(t)"
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  )}

                  {(mode === "compound" || mode === "both") && (
                    <Line
                      type="monotone"
                      dataKey="compoundAmount"
                      name="Compound A(t)"
                      stroke="#dc2626"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                Formula
              </p>
              <h3 className="mt-2 text-xl font-bold text-slate-950">
                Simple Interest
              </h3>

              <div className="mt-5 space-y-4 text-slate-700">
                <div className="rounded-2xl bg-slate-50 p-4 text-lg">
                  <InlineMath math={"A(t) = P(1 + it)"} />
                </div>
                <p className="text-sm leading-6">
                  Interest is earned only on the original principal.
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Simple interest
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {formatCurrency(summary.simpleInterest)}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Final amount
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {formatCurrency(summary.simpleAmount)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                Formula
              </p>
              <h3 className="mt-2 text-xl font-bold text-slate-950">
                Compound Interest
              </h3>

              <div className="mt-5 space-y-4 text-slate-700">
                <div className="rounded-2xl bg-slate-50 p-4 text-lg">
                  <InlineMath math={"A(t) = P(1 + i)^t"} />
                </div>
                <p className="text-sm leading-6">
                  Interest is earned on the accumulated balance, so interest
                  earns interest.
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Compound interest
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {formatCurrency(summary.compoundInterest)}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Final amount
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {formatCurrency(summary.compoundAmount)}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
