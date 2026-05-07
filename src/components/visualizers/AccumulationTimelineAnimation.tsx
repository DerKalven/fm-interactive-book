"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  principal: number;
  rate: number; // decimal, e.g. 0.08
};

type Stage = 0 | 1 | 2;

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

function stripedFill(colorA: string, colorB: string) {
  return `repeating-linear-gradient(
    -45deg,
    ${colorA},
    ${colorA} 8px,
    ${colorB} 8px,
    ${colorB} 16px
  )`;
}

type ColumnProps = {
  title: string;
  subtitle: string;
  active: boolean;
  principalHeight: string;
  interestOneHeight?: string;
  interestTwoHeight?: string;
  showPrincipal: boolean;
  showInterestOne: boolean;
  showInterestTwo: boolean;
  labelOne?: string;
  labelTwo?: string;
  amountLabel: string;
};

function AccumulationColumn({
  title,
  subtitle,
  active,
  principalHeight,
  interestOneHeight = "0%",
  interestTwoHeight = "0%",
  showPrincipal,
  showInterestOne,
  showInterestTwo,
  labelOne,
  labelTwo,
  amountLabel,
}: ColumnProps) {
  return (
    <div
      className={`rounded-3xl border bg-white p-4 shadow-sm transition-all duration-500 ${
        active
          ? "border-blue-400 ring-2 ring-blue-200 shadow-lg"
          : "border-slate-200"
      }`}
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            active
              ? "bg-blue-100 text-blue-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {amountLabel}
        </span>
      </div>

      <div className="relative mx-auto h-72 w-32 border-b-2 border-slate-300">
        <div className="absolute inset-x-4 bottom-0 top-2 rounded-t-xl border border-slate-300 bg-slate-50/60" />

        <div className="absolute inset-x-4 bottom-0 flex flex-col-reverse">
          {showPrincipal && (
            <div
              className="w-full rounded-t-sm border border-slate-400 bg-slate-200 transition-all duration-700"
              style={{ height: principalHeight }}
            />
          )}

          {showInterestOne && (
            <div
              className="w-full border border-slate-500 transition-all duration-700"
              style={{
                height: interestOneHeight,
                backgroundImage: stripedFill("#dbeafe", "#93c5fd"),
              }}
            />
          )}

          {showInterestTwo && (
            <div
              className="w-full border border-slate-600 transition-all duration-700"
              style={{
                height: interestTwoHeight,
                backgroundImage: stripedFill("#fde68a", "#f59e0b"),
              }}
            />
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm border border-slate-400 bg-slate-200" />
          <span className="text-slate-700">Initial investment</span>
        </div>

        {showInterestOne && labelOne && (
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-sm border border-slate-500"
              style={{
                backgroundImage: stripedFill("#dbeafe", "#93c5fd"),
              }}
            />
            <span className="text-slate-700">{labelOne}</span>
          </div>
        )}

        {showInterestTwo && labelTwo && (
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-sm border border-slate-600"
              style={{
                backgroundImage: stripedFill("#fde68a", "#f59e0b"),
              }}
            />
            <span className="text-slate-700">{labelTwo}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AccumulationTimelineAnimation({
  principal,
  rate,
}: Props) {
  const [stage, setStage] = useState<Stage>(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    const id = window.setInterval(() => {
      setStage((prev) => {
        if (prev === 2) return 0;
        return (prev + 1) as Stage;
      });
    }, 1800);

    return () => window.clearInterval(id);
  }, [autoPlay]);

  const values = useMemo(() => {
    const P = Math.max(principal, 0);
    const i1 = P * rate;
    const A1 = P + i1;
    const i2 = A1 * rate;
    const A2 = A1 + i2;
    const maxAmount = Math.max(A2, 1);

    const toHeight = (value: number) => `${(value / maxAmount) * 100}%`;

    return {
      P,
      i1,
      A1,
      i2,
      A2,
      toHeight,
    };
  }, [principal, rate]);

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            Accumulation Story
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
            How the money grows over time
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
            This animation shows the original investment first, then the
            interest earned after one period, and then the next period’s
            interest earned on the already accumulated balance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[0, 1, 2].map((value) => (
            <button
              key={value}
              onClick={() => {
                setStage(value as Stage);
                setAutoPlay(false);
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                stage === value
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              t = {value}
            </button>
          ))}

          <button
            onClick={() => setAutoPlay((prev) => !prev)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              autoPlay
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50"
            }`}
          >
            {autoPlay ? "Autoplay on" : "Autoplay off"}
          </button>
        </div>
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Principal
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            {formatCurrency(values.P)}
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

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Second-period amount
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            {formatCurrency(values.A2)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <AccumulationColumn
          title="t = 0"
          subtitle="Initial investment"
          active={stage === 0}
          principalHeight={values.toHeight(values.P)}
          showPrincipal={true}
          showInterestOne={false}
          showInterestTwo={false}
          amountLabel={formatCurrency(values.P)}
        />

        <AccumulationColumn
          title="t = 1"
          subtitle="After one period"
          active={stage === 1}
          principalHeight={values.toHeight(values.P)}
          interestOneHeight={values.toHeight(values.i1)}
          showPrincipal={stage >= 1}
          showInterestOne={stage >= 1}
          showInterestTwo={false}
          labelOne="Interest earned from t = 0"
          amountLabel={formatCurrency(values.A1)}
        />

        <AccumulationColumn
          title="t = 2"
          subtitle="After two periods"
          active={stage === 2}
          principalHeight={values.toHeight(values.P)}
          interestOneHeight={values.toHeight(values.i1)}
          interestTwoHeight={values.toHeight(values.i2)}
          showPrincipal={stage >= 2}
          showInterestOne={stage >= 2}
          showInterestTwo={stage >= 2}
          labelOne="Interest earned from t = 0"
          labelTwo="Interest earned from t = 1"
          amountLabel={formatCurrency(values.A2)}
        />
      </div>
    </section>
  );
}
