export type InterestModel = "simple" | "compound";

export type AccumulationGraphPoint = {
  time: number;
  simpleFactor: number;
  compoundFactor: number;
  simpleAmount: number;
  compoundAmount: number;
  simpleInterest: number;
  compoundInterest: number;
};

export function simpleAccumulationFactor(rate: number, time: number): number {
  return 1 + rate * time;
}

export function compoundAccumulationFactor(rate: number, time: number): number {
  return Math.pow(1 + rate, time);
}

export function accumulationFactor(
  rate: number,
  time: number,
  model: InterestModel
): number {
  if (model === "simple") return simpleAccumulationFactor(rate, time);
  if (model === "compound") return compoundAccumulationFactor(rate, time);
  throw new Error("Invalid interest model");
}

export function accumulatedValue(
  principal: number,
  rate: number,
  time: number,
  model: InterestModel
): number {
  return principal * accumulationFactor(rate, time, model);
}

export function interestEarned(
  principal: number,
  rate: number,
  time: number,
  model: InterestModel
): number {
  return accumulatedValue(principal, rate, time, model) - principal;
}

export function compareSimpleAndCompound(
  principal: number,
  rate: number,
  time: number
) {
  const simpleFactor = simpleAccumulationFactor(rate, time);
  const compoundFactor = compoundAccumulationFactor(rate, time);

  const simpleAmount = principal * simpleFactor;
  const compoundAmount = principal * compoundFactor;

  return {
    simpleFactor,
    compoundFactor,
    simpleAmount,
    compoundAmount,
    simpleInterest: simpleAmount - principal,
    compoundInterest: compoundAmount - principal,
    difference: compoundAmount - simpleAmount,
  };
}

export function generateAccumulationGraphData(
  principal: number,
  rate: number,
  timeHorizon: number
): AccumulationGraphPoint[] {
  const points: AccumulationGraphPoint[] = [];

  for (let t = 0; t <= timeHorizon; t++) {
    const simpleFactor = simpleAccumulationFactor(rate, t);
    const compoundFactor = compoundAccumulationFactor(rate, t);

    const simpleAmount = principal * simpleFactor;
    const compoundAmount = principal * compoundFactor;

    points.push({
      time: t,
      simpleFactor,
      compoundFactor,
      simpleAmount,
      compoundAmount,
      simpleInterest: simpleAmount - principal,
      compoundInterest: compoundAmount - principal,
    });
  }

  return points;
}
