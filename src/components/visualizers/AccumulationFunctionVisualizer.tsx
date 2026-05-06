"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { InlineMath } from "react-katex";
import {
  compareSimpleAndCompound,
  generateAccumulationGraphData,
} from "@/lib/financial-math/interest";
import { formatCurrency, formatDecimal, formatPercent } from "@/lib/financial-math/formatters";
import { ValueCard } from "./ValueCard";
import { FormulaPanel } from "./FormulaPanel";
import { DecompositionBar } from "./DecompositionBar";

type ModelView = "simple" | "compound" | "both";

export type AccumulationFunctionVisualizerProps = {
  principal?: number;
  rate?: number;
  timeHorizon?: number;
  selectedTime?: number;
  model?: ModelView;
  showFormulaPanel?: boolean;
  showDecompositionBar?: boolean;
};

const modelOptions: ModelView[] = ["simple", "compound", "both"];

export function AccumulationFunctionVisualizer({
  principal: initialPrincipal = 1000,
  rate: initialRate = 0.05,
  timeHorizon: initialTimeHorizon = 10,
  selectedTime: initialSelectedTime = 10,
  model: initialModel = "both",
  showFormulaPanel = true,
  showDecompositionBar = true,
}: AccumulationFunctionVisualizerProps) {
  const [principal, setPrincipal] = useState(initialPrincipal);
  const [ratePercent, setRatePercent] = useState(initialRate * 100);
  const [timeHorizon, setTimeHorizon] = useState(initialTimeHorizon);
  const [selectedTime, setSelectedTime] = useState(Math.min(initialSelectedTime, initialTimeHorizon));
  const [model, setModel] = useState<ModelView>(initialModel);

  const rate = ratePercent / 100;

  const graphData = useMemo(
    () => generateAccumulationGraphData(principal, rate, timeHorizon),
    [principal, rate, timeHorizon]
  );

  const comparison = useMemo(
    () => compareSimpleAndCompound(principal, rate, selectedTime),
    [principal, rate, selectedTime]
  );

  const showSimple = model === "simple" || model === "both";
  const showCompound = model === "compound" || model === "both";
  const selectedInterest = model === "simple" ? comparison.simpleInterest : comparison.compoundInterest;
  const selectedLabel = model === "simple" ? "Simple interest model" : "Compound interest model";

  function handleTimeHorizonChange(value: number) {
    setTimeHorizon(value);
    setSelectedTime((current) => Math.min(current, value));
  }

  return (
    <section className="mx-auto w-full max-w-7xl rounded-[2rem] border border-stone-200 bg-white/55 p-4 shadow-xl shadow-stone-200/60 backdrop-blur md:p-8">
      <div className="mb-8 grid gap-4 md:grid-cols-[1.3fr_0.7fr] md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-500">SOA Exam FM · Interest Theory</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-stone-950 md:text-6xl">
            Accumulation Function
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-stone-700">
            Explore how <InlineMath math="a(t)" /> transforms money today into money in the future. Compare
            simple interest, where growth is linear, with compound interest, where interest earns interest.
          </p>
        </div>
        <div className="rounded-3xl bg-stone-950 p-5 text-white">
          <p className="text-sm uppercase tracking-[0.18em] text-stone-300">Core identity</p>
          <p className="mt-3 font-serif text-3xl">A(t) = P · a(t)</p>
          <p className="mt-3 text-sm leading-6 text-stone-300">
            Changing the principal changes <InlineMath math="A(t)" /> but not <InlineMath math="a(t)" />.
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-3xl border border-stone-200 bg-white/85 p-5 shadow-sm">
          <h2 className="font-serif text-2xl font-semibold text-stone-950">Controls</h2>

          <ControlSlider
            label="Principal"
            value={principal}
            min={100}
            max={100000}
            step={100}
            displayValue={formatCurrency(principal)}
            onChange={setPrincipal}
          />

          <ControlSlider
            label="Annual interest rate"
            value={ratePercent}
            min={0}
            max={25}
            step={0.25}
            displayValue={formatPercent(rate)}
            onChange={setRatePercent}
          />

          <ControlSlider
            label="Time horizon"
            value={timeHorizon}
            min={0}
            max={40}
            step={1}
            displayValue={`${timeHorizon} years`}
            onChange={handleTimeHorizonChange}
          />

          <ControlSlider
            label="Selected time"
            value={selectedTime}
            min={0}
            max={timeHorizon}
            step={1}
            displayValue={`${selectedTime} years`}
            onChange={setSelectedTime}
          />

          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-stone-800">Interest model</p>
            <div className="grid grid-cols-3 gap-2">
              {modelOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setModel(option)}
                  className={`rounded-full px-3 py-2 text-sm font-semibold capitalize transition ${
                    model === option
                      ? "bg-stone-950 text-white"
                      : "border border-stone-300 bg-white text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ValueCard
              title="Simple a(t)"
              value={formatDecimal(comparison.simpleFactor)}
              subtitle="Linear growth factor"
            />
            <ValueCard
              title="Compound a(t)"
              value={formatDecimal(comparison.compoundFactor)}
              subtitle="Exponential growth factor"
            />
            <ValueCard
              title="Simple A(t)"
              value={formatCurrency(comparison.simpleAmount)}
              subtitle={`At t = ${selectedTime}`}
            />
            <ValueCard
              title="Compound A(t)"
              value={formatCurrency(comparison.compoundAmount)}
              subtitle={`Difference: ${formatCurrency(comparison.difference)}`}
            />
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white/85 p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-stone-950">Growth of 1 unit</h2>
                <p className="text-sm text-stone-600">
                  The graph shows <InlineMath math="a(t)" />, not the principal-specific amount.
                </p>
              </div>
              <p className="rounded-full bg-stone-100 px-4 py-2 text-sm text-stone-700">
                Selected time: <strong>{selectedTime}</strong>
              </p>
            </div>

            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={graphData} margin={{ top: 16, right: 24, bottom: 12, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" label={{ value: "Time in years", position: "insideBottom", offset: -6 }} />
                  <YAxis label={{ value: "a(t)", angle: -90, position: "insideLeft" }} />
                  <Tooltip
                    formatter={(value, name) => [typeof value === "number" ? formatDecimal(value) : String(value), String(name)]}
                    labelFormatter={(label) => `t = ${label} years`}
                  />
                  <Legend verticalAlign="top" />
                  <ReferenceLine x={selectedTime} strokeDasharray="4 4" label="selected t" />
                  {showSimple ? (
                    <Line
                      type="monotone"
                      dataKey="simpleFactor"
                      name="Simple a(t)"
                      stroke="currentColor"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  ) : null}
                  {showCompound ? (
                    <Line
                      type="monotone"
                      dataKey="compoundFactor"
                      name="Compound a(t)"
                      stroke="currentColor"
                      strokeWidth={3}
                      strokeDasharray="8 4"
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  ) : null}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {showFormulaPanel ? (
            <FormulaPanel
              principal={principal}
              rate={rate}
              selectedTime={selectedTime}
              simpleAmount={comparison.simpleAmount}
              compoundAmount={comparison.compoundAmount}
              model={model}
            />
          ) : null}

          {showDecompositionBar ? (
            <DecompositionBar principal={principal} interest={selectedInterest} label={selectedLabel} />
          ) : null}

          <ExerciseCard />
        </main>
      </div>
    </section>
  );
}

type ControlSliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  onChange: (value: number) => void;
};

function ControlSlider({ label, value, min, max, step, displayValue, onChange }: ControlSliderProps) {
  return (
    <label className="mt-6 block">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-stone-800">{label}</span>
        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">{displayValue}</span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function ExerciseCard() {
  return (
    <section className="rounded-3xl border border-stone-200 bg-white/85 p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">Embedded Exam FM-style check</p>
      <h2 className="mt-2 font-serif text-2xl font-semibold text-stone-950">Try it</h2>
      <p className="mt-2 text-sm leading-6 text-stone-700">
        An investment of 1,000 earns interest at an annual effective rate of 6%. Use the visualizer to compare the
        accumulated value after 10 years under simple interest and compound interest.
      </p>
      <details className="mt-4 rounded-2xl bg-stone-50 p-4">
        <summary className="cursor-pointer font-semibold text-stone-900">Show expected answer</summary>
        <div className="mt-3 space-y-2 text-sm text-stone-700">
          <p>Simple interest: A(10) = 1000(1 + 0.06 · 10) = 1,600.00</p>
          <p>Compound interest: A(10) = 1000(1.06)^10 = 1,790.85</p>
          <p>Difference: 190.85</p>
        </div>
      </details>
    </section>
  );
}
