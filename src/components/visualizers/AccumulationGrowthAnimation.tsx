"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  principal: number;
  rate: number; // decimal, e.g. 0.08
  periods: number; // integer number of periods
};

type BarData = {
  t: number;
  amount: number;
  previousAmount: number;
  newInterest: number;
  gains: number[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(2)}%`;
}

function buildBars(principal: number, rate: number, periods: number): BarData[] {
  const safePrincipal = Math.max(0, principal);
  const safeRate = Math.max(0, rate);
  const safePeriods = Math.max(0, Math.floor(periods));

  const bars: BarData[] = [];
  let currentAmount = safePrincipal;
  const gains: number[] = [];

  bars.push({
    t: 0,
    amount: safePrincipal,
    previousAmount: safePrincipal,
    newInterest: 0,
    gains: [],
  });

  for (let t = 1; t <= safePeriods; t++) {
    const interest = currentAmount * safeRate;
    gains.push(interest);
    const nextAmount = currentAmount + interest;

    bars.push({
      t,
      amount: nextAmount,
      previousAmount: currentAmount,
      newInterest: interest,
      gains: [...gains],
    });

    currentAmount = nextAmount;
  }

  return bars;
}

function getSegmentStyle(kind: "principal" | "oldInterest" | "newInterest") {
  if (kind === "principal") {
    return {
      backgroundColor: "#e2e8f0",
      borderColor: "#64748b",
    };
  }

  if (kind === "oldInterest") {
    return {
      backgroundImage:
        "repeating-linear-gradient(-45deg, #dbeafe, #dbeafe 8px, #93c5fd 8px, #93c5fd 16px)",
      borderColor: "#3b82f6",
    };
  }

  return {
    backgroundImage:
      "repeating-linear-gradient(-45deg, #fde68a, #fde68a 8px, #f59e0b 8px, #f59e0b 16px)",
    borderColor: "#d97706",
  };
}

export default function AccumulationGrowthAnimation({
  principal,
  rate,
  periods,
}: Props) {
  const safePeriods = Math.max(0, Math.floor(periods));

  const bars = useMemo(
    () => buildBars(principal, rate, safePeriods),
    [principal, rate, safePeriods]
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    setCurrentStep(0);
    setPlaying(true);
  }, [principal, rate, safePeriods]);

  useEffect(() => {
    if (!playing) return;
    if (currentStep >= safePeriods) return;

    const id = window.setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, safePeriods));
    }, 1300);

    return () => window.clearTimeout(id);
  }, [playing, currentStep, safePeriods]);

  const activeBar = bars[currentStep] ?? bars[0];
  const maxAmount = Math.max(bars[bars.length - 1]?.amount ?? 1, 1);

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            Central Animation
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
            How the balance accumulates period by period
          </h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600 md:text-base">
            The first bar is the initial investment. Each new bar appears to the
            right and shows the previous accumulated balance plus the new
            interest earned during that period.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setPlaying((prev) => !prev)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              playing
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {playing ? "Pause" : "Play"}
          </button>

          <button
            onClick={() => {
              setCurrentStep(0);
              setPlaying(true);
            }}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          >
            Restart
          </button>

          <button
            onClick={() => {
              setPlaying(false);
              setCurrentStep((prev) => Math.max(prev - 1, 0));
            }}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          >
            Prev
          </button>

          <button
            onClick={() => {
              setPlaying(false);
              setCurrentStep((prev) => Math.min(prev + 1, safePeriods));
            }}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          >
            Next
          </button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-4">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Current period
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            t = {activeBar.t}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Current amount
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            {formatCurrency(activeBar.amount)}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            New interest
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            {formatCurrency(activeBar.newInterest)}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Rate per period
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            {formatPercent(rate)}
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-3xl border border-blue-100 bg-blue-50/60 p-4 text-sm leading-6 text-slate-700">
        {activeBar.t === 0 ? (
          <p>
            At <strong>t = 0</strong>, the only amount present is the{" "}
            <strong>initial investment</strong>.
          </p>
        ) : (
          <p>
            At <strong>t = {activeBar.t}</strong>, the balance from{" "}
            <strong>t = {activeBar.t - 1}</strong> was{" "}
            <strong>{formatCurrency(activeBar.previousAmount)}</strong>. Applying{" "}
            <strong>i = {formatPercent(rate)}</strong> generates a new interest
            amount of <strong>{formatCurrency(activeBar.newInterest)}</strong>,
            so the new accumulated value becomes{" "}
            <strong>{formatCurrency(activeBar.amount)}</strong>.
          </p>
        )}
      </div>

      <div className="overflow-x-auto pb-4">
        <div
          className="flex min-w-max items-end gap-6 px-2 pt-8"
          style={{ minHeight: "430px" }}
        >
          {bars.map((bar) => {
            const isVisible = bar.t <= currentStep;
            const isActive = bar.t === currentStep;

            return (
              <div
                key={bar.t}
                className="flex w-24 shrink-0 flex-col items-center"
              >
                <div className="relative h-[320px] w-full">
                  {isActive && bar.t > 0 && isVisible && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 shadow-sm">
                      +{formatCurrency(bar.newInterest)}
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 border-b-2 border-slate-300" />

                  <div className="absolute inset-x-2 bottom-0 flex h-full flex-col-reverse">
                    <div
                      className="w-full border-x border-t transition-all duration-700"
                      style={{
                        ...getSegmentStyle("principal"),
                        height: isVisible
                          ? `${(principal / maxAmount) * 100}%`
                          : "0%",
                        opacity: isVisible ? 1 : 0,
                      }}
                    />

                    {bar.gains.map((gain, idx) => {
                      const isNewest = idx === bar.gains.length - 1;
                      const style = getSegmentStyle(
                        isNewest ? "newInterest" : "oldInterest"
                      );

                      return (
                        <div
                          key={`${bar.t}-${idx}`}
                          className="w-full border-x border-t transition-all duration-700"
                          style={{
                            ...style,
                            height: isVisible
                              ? `${(gain / maxAmount) * 100}%`
                              : "0%",
                            opacity: isVisible ? 1 : 0,
                          }}
                        />
                      );
                    })}
                  </div>

                  {isActive && (
                    <div className="pointer-events-none absolute inset-x-1 bottom-0 top-2 rounded-t-xl ring-2 ring-blue-300" />
                  )}
                </div>

                <div className="mt-3 text-sm font-semibold text-slate-900">
                  t = {bar.t}
                </div>

                <div className="mt-1 text-center text-xs text-slate-500">
                  {isVisible ? formatCurrency(bar.amount) : ""}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
          <span className="inline-block h-4 w-4 rounded-sm border border-slate-500 bg-slate-200" />
          <span className="text-sm text-slate-700">Initial investment</span>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
          <span
            className="inline-block h-4 w-4 rounded-sm border"
            style={getSegmentStyle("oldInterest")}
          />
          <span className="text-sm text-slate-700">
            Interest earned in previous periods
          </span>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
          <span
            className="inline-block h-4 w-4 rounded-sm border"
            style={getSegmentStyle("newInterest")}
          />
          <span className="text-sm text-slate-700">
            New interest added in the current period
          </span>
        </div>
      </div>
    </section>
  );
}
