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
import AccumulationGrowthAnimation from "./AccumulationGrowthAnimation";

type Mode = "simple" | "compound" | "both";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function clamp(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function generateGraphData(principal: number, rate: number, periods: number) {
  const safePeriods = Math.max(0, Math.floor(periods));
  const rows = [];

  for (let t = 0; t <= safePeriods; t++) {
    rows.push({
      t,
      simpleAmount: principal * (1 + rate * t),
      compoundAmount: principal * Math.pow(1 + rate, t),
    });
  }

  return rows;
}

export default function AccumulationFunctionVisualizer() {
  const [principalInput, setPrincipalInput] = useState("1000");
  const [rateInput, setRateInput] = useState("8");
  const [periodsInput, setPeriodsInput] = useState("5");
  const [mode, setMode] = useState<Mode>("both");

  const principal = clamp(Number(principalInput || 0), 0, 1_000_000_000);
  const ratePercent = clamp(Number(rateInput || 0), 0, 1000);
  const periods = clamp(Number(periodsInput || 0), 0, 50);
  const rate = ratePercent / 100;

  const graphData = useMemo(
    () => generateGraphData(principal, rate, periods),
    [principal, rate, periods]
  );

  const summary = useMemo(() => {
    const simpleAmount = principal * (1 + rate * periods);
    const simpleInterest = simpleAmount - principal;

    const compoundAmount = principal * Math.pow(1 + rate, periods);
    const compoundInterest = compoundAmount - principal;

    return {
      simpleAmount,
      simpleInterest,
      compoundAmount,
      compoundInterest,
    };
  }, [principal, rate, periods]);

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
          The main focus of this page is the accumulation animation. The graph
          remains below as a supporting representation of the user’s numerical
          values.
        </p>
      </header>

      {/* CONTROLS */}
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            Inputs
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            Enter the user values
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            These values control both the animation and the graph.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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
              Number of periods
            </span>
            <input
              type="number"
              step="1"
              min="0"
              value={periodsInput}
              onChange={(e) => setPeriodsInput(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </label>

          <div>
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Graph mode
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
      </section>

      {/* CENTRAL ANIMATION */}
      <AccumulationGrowthAnimation
        principal={principal}
        rate={rate}
        periods={periods}
      />

      {/* GRAPH */}
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            Supporting Graph
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            Amount values generated by the user inputs
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            The y-axis shows monetary amount values, not just the unit
            accumulation function.
          </p>
        </div>

        <div className="h-[420px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={graphData}
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="t"
                stroke="#475569"
                label={{
                  value: "t",
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

      {/* FORMULAS + RESULTS */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            Simple Interest
          </p>
          <h3 className="mt-2 text-xl font-bold text-slate-950">
            Formula and result
          </h3>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-lg">
            <InlineMath math={"A(t) = P(1 + it)"} />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Interest earned
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
            Compound Interest
          </p>
          <h3 className="mt-2 text-xl font-bold text-slate-950">
            Formula and result
          </h3>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-lg">
            <InlineMath math={"A(t) = P(1 + i)^t"} />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Interest earned
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
    </section>
  );
}
