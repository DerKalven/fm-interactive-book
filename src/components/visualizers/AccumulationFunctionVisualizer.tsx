"use client";

import { useMemo, useState } from "react";
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
import { InlineMath } from "react-katex";
import {
  compareSimpleAndCompound,
  generateAccumulationGraphData,
  getCompoundDataKey,
  getSimpleDataKey,
  getYAxisLabel,
  type GraphMode,
} from "@/lib/financial-math/interest";
import {
  formatCurrency,
  formatDecimal,
  formatPercent,
} from "@/lib/financial-math/formatters";

type DisplayModel = "simple" | "compound" | "both";

export type AccumulationFunctionVisualizerProps = {
  principal?: number;
  rate?: number;
  timeHorizon?: number;
  selectedTime?: number;
  model?: DisplayModel;
};

const graphModeCopy: Record<GraphMode, string> = {
  factor:
    "This graph shows a(t), the growth of 1 monetary unit invested at time 0. Changing the principal does not change this graph.",
  amount:
    "This graph shows A(t), the accumulated value of the principal entered by the user. This is the graph most directly connected to future value.",
  interest:
    "This graph shows I(t), the interest earned over time. It excludes the original principal and shows only the growth portion.",
};

function formatGraphValue(value: number, graphMode: GraphMode) {
  if (graphMode === "factor") return formatDecimal(value);
  return formatCurrency(value);
}

function getSimpleLabel(graphMode: GraphMode) {
  if (graphMode === "factor") return "Simple a(t)";
  if (graphMode === "amount") return "Simple A(t)";
  return "Simple I(t)";
}

function getCompoundLabel(graphMode: GraphMode) {
  if (graphMode === "factor") return "Compound a(t)";
  if (graphMode === "amount") return "Compound A(t)";
  return "Compound I(t)";
}

export default function AccumulationFunctionVisualizer({
  principal: initialPrincipal = 1000,
  rate: initialRate = 0.05,
  timeHorizon: initialTimeHorizon = 10,
  selectedTime: initialSelectedTime = 10,
  model: initialModel = "both",
}: AccumulationFunctionVisualizerProps) {
  const [principal, setPrincipal] = useState(initialPrincipal);
  const [ratePercent, setRatePercent] = useState(initialRate * 100);
  const [timeHorizon, setTimeHorizon] = useState(initialTimeHorizon);
  const [selectedTime, setSelectedTime] = useState(
    Math.min(initialSelectedTime, initialTimeHorizon)
  );
  const [model, setModel] = useState<DisplayModel>(initialModel);
  const [graphMode, setGraphMode] = useState<GraphMode>("amount");

  const rate = ratePercent / 100;

  const graphData = useMemo(
    () => generateAccumulationGraphData(principal, rate, timeHorizon),
    [principal, rate, timeHorizon]
  );

  const selectedValues = useMemo(
    () => compareSimpleAndCompound(principal, rate, selectedTime),
    [principal, rate, selectedTime]
  );

  const simpleDataKey = getSimpleDataKey(graphMode);
  const compoundDataKey = getCompoundDataKey(graphMode);
  const yAxisLabel = getYAxisLabel(graphMode);

  const showSimple = model === "simple" || model === "both";
  const showCompound = model === "compound" || model === "both";

  function handleTimeHorizonChange(value: number) {
    setTimeHorizon(value);
    if (selectedTime > value) {
      setSelectedTime(value);
    }
  }

  return (
    <section className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          SOA Exam FM · Interest Theory
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Accumulation Function Visualizer
        </h2>
        <p className="mt-3 max-w-3xl text-slate-600">
          Explore how money accumulates over time. Compare simple interest,
          compound interest, the accumulation factor <InlineMath math="a(t)" />,
          the amount function <InlineMath math="A(t)" />, and interest earned{" "}
          <InlineMath math="I(t)" />.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-lg font-semibold text-slate-900">Controls</h3>

          <div className="mt-5 space-y-6">
            <label className="block">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-slate-700">
                  Principal P
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {formatCurrency(principal)}
                </span>
              </div>
              <input
                type="range"
                min={100}
                max={100000}
                step={100}
                value={principal}
                onChange={(event) => setPrincipal(Number(event.target.value))}
                className="mt-3 w-full"
              />
            </label>

            <label className="block">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-slate-700">
                  Annual interest rate i
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {ratePercent.toFixed(2)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={25}
                step={0.25}
                value={ratePercent}
                onChange={(event) => setRatePercent(Number(event.target.value))}
                className="mt-3 w-full"
              />
            </label>

            <label className="block">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-slate-700">
                  Time horizon
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {timeHorizon} years
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={40}
                step={1}
                value={timeHorizon}
                onChange={(event) =>
                  handleTimeHorizonChange(Number(event.target.value))
                }
                className="mt-3 w-full"
              />
            </label>

            <label className="block">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-slate-700">
                  Selected time
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  t = {selectedTime}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={timeHorizon}
                step={1}
                value={selectedTime}
                onChange={(event) => setSelectedTime(Number(event.target.value))}
                className="mt-3 w-full"
              />
            </label>

            <div>
              <p className="text-sm font-medium text-slate-700">
                Interest model
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {(["simple", "compound", "both"] as DisplayModel[]).map(
                  (option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setModel(option)}
                      className={`rounded-xl border px-3 py-2 text-sm font-semibold capitalize transition ${
                        model === option
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                      }`}
                    >
                      {option}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700">
                Graph displays
              </p>
              <div className="mt-3 grid gap-2">
                {[
                  ["factor", "Accumulation factor a(t)"],
                  ["amount", "Amount function A(t)"],
                  ["interest", "Interest earned I(t)"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setGraphMode(value as GraphMode)}
                    className={`rounded-xl border px-3 py-2 text-left text-sm font-semibold transition ${
                      graphMode === value
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <ValueTile
              title="Simple amount"
              value={formatCurrency(selectedValues.simpleAmount)}
              subtitle={`A(${selectedTime}) = P(1 + it)`}
              visible={showSimple}
            />
            <ValueTile
              title="Compound amount"
              value={formatCurrency(selectedValues.compoundAmount)}
              subtitle={`A(${selectedTime}) = P(1 + i)^t`}
              visible={showCompound}
            />
            <ValueTile
              title="Simple interest"
              value={formatCurrency(selectedValues.simpleInterest)}
              subtitle={`I(${selectedTime}) = A(t) - P`}
              visible={showSimple}
            />
            <ValueTile
              title="Compound advantage"
              value={formatCurrency(selectedValues.difference)}
              subtitle="Compound amount minus simple amount"
              visible={model === "both"}
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {yAxisLabel}
                </h3>
                <p className="mt-1 max-w-3xl text-sm text-slate-600">
                  {graphModeCopy[graphMode]}
                </p>
              </div>
              <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                i = {formatPercent(rate)}
              </div>
            </div>

            <div className="h-[420px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={graphData}
                  margin={{ top: 20, right: 28, left: 22, bottom: 18 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    label={{
                      value: "Time in years",
                      position: "insideBottom",
                      offset: -10,
                    }}
                  />
                  <YAxis
                    width={90}
                    tickFormatter={(value) =>
                      graphMode === "factor"
                        ? formatDecimal(Number(value))
                        : formatCurrency(Number(value))
                    }
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      typeof value === "number"
                        ? formatGraphValue(value, graphMode)
                        : String(value),
                      String(name),
                    ]}
                    labelFormatter={(label) => `t = ${label} years`}
                  />
                  <Legend verticalAlign="top" height={36} />

                  {showSimple && (
                    <Line
                      type="monotone"
                      dataKey={simpleDataKey}
                      name={getSimpleLabel(graphMode)}
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  )}

                  {showCompound && (
                    <Line
                      type="monotone"
                      dataKey={compoundDataKey}
                      name={getCompoundLabel(graphMode)}
                      stroke="#dc2626"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-lg font-semibold text-slate-900">
                Formula panel
              </h3>
              <div className="mt-4 space-y-4 text-slate-700">
                {showSimple && (
                  <div className="rounded-xl bg-white p-4">
                    <p className="font-semibold text-slate-900">
                      Simple interest
                    </p>
                    <p className="mt-2">
                      <InlineMath math="a(t)=1+it" />
                    </p>
                    <p className="mt-2">
                      <InlineMath
                        math={`A(${selectedTime})=${principal}(1+${rate.toFixed(
                          4
                        )}\\cdot ${selectedTime})`}
                      />
                    </p>
                    <p className="mt-2 font-semibold">
                      <InlineMath
                        math={`A(${selectedTime})=${selectedValues.simpleAmount.toFixed(
                          2
                        )}`}
                      />
                    </p>
                  </div>
                )}

                {showCompound && (
                  <div className="rounded-xl bg-white p-4">
                    <p className="font-semibold text-slate-900">
                      Compound interest
                    </p>
                    <p className="mt-2">
                      <InlineMath math="a(t)=(1+i)^t" />
                    </p>
                    <p className="mt-2">
                      <InlineMath
                        math={`A(${selectedTime})=${principal}(1+${rate.toFixed(
                          4
                        )})^{${selectedTime}}`}
                      />
                    </p>
                    <p className="mt-2 font-semibold">
                      <InlineMath
                        math={`A(${selectedTime})=${selectedValues.compoundAmount.toFixed(
                          2
                        )}`}
                      />
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-lg font-semibold text-slate-900">
                Principal and interest decomposition
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Accumulated value is principal plus interest earned.
              </p>

              <div className="mt-6 space-y-5">
                {showSimple && (
                  <DecompositionRow
                    label="Simple"
                    principal={principal}
                    interest={selectedValues.simpleInterest}
                  />
                )}
                {showCompound && (
                  <DecompositionRow
                    label="Compound"
                    principal={principal}
                    interest={selectedValues.compoundInterest}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-slate-900">
              Concept checkpoint
            </h3>
            <p className="mt-2 text-slate-600">
              Change the principal while the graph mode is set to{" "}
              <strong>Accumulation factor a(t)</strong>. The graph does not
              change because <InlineMath math="a(t)" /> tracks the growth of 1
              unit. Now switch to <strong>Amount function A(t)</strong>. The
              graph changes because <InlineMath math="A(t)=P\\cdot a(t)" />.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ValueTile({
  title,
  value,
  subtitle,
  visible,
}: {
  title: string;
  value: string;
  subtitle: string;
  visible: boolean;
}) {
  if (!visible) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}

function DecompositionRow({
  label,
  principal,
  interest,
}: {
  label: string;
  principal: number;
  interest: number;
}) {
  const total = principal + interest;
  const principalPercent = total > 0 ? (principal / total) * 100 : 100;
  const interestPercent = total > 0 ? (interest / total) * 100 : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className="text-slate-500">{formatCurrency(total)}</span>
      </div>
      <div className="flex h-8 overflow-hidden rounded-full border border-slate-200 bg-white">
        <div
          className="flex items-center justify-center bg-slate-300 text-xs font-semibold text-slate-800"
          style={{ width: `${principalPercent}%` }}
        >
          P
        </div>
        <div
          className="flex items-center justify-center bg-slate-900 text-xs font-semibold text-white"
          style={{ width: `${interestPercent}%` }}
        >
          I
        </div>
      </div>
      <div className="mt-2 flex justify-between text-xs text-slate-500">
        <span>Principal: {formatCurrency(principal)}</span>
        <span>Interest: {formatCurrency(interest)}</span>
      </div>
    </div>
  );
}
