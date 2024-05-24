import { CandleData } from "../contexts/Global";
import { CryptoGranularity } from "../services/crypto";

type CryptoAlgorithm = (
  data: CandleData[],
  granularity: CryptoGranularity,
  startCapital: number
) => TradingDecision[];

export enum TradingAlgorithm {
  ALGORITHM_1,
}

export enum TradingAction {
  SELL,
  BUY,
  IGNORE,
}

export interface TradingDecision {
  time: number;
  action: TradingAction;
  transaction: CryptoTransaction;
}

export interface CryptoTransaction {
  startCapital: number;
  change: number; // Gain or Loss since start capital (after - startCapital)
  myBalance: {
    before: number;
    after: number;
  };
  coinBalance: {
    before: number;
    after: number;
  };
  time: number;
}

export function calculateSimulatedValues(
  data: CandleData[],
  granularity: CryptoGranularity,
  algorithm: TradingAlgorithm,
  startCapital: number
): TradingDecision[] {
  if ((algorithm = TradingAlgorithm.ALGORITHM_1))
    return runAlgorithm(algorithm1, data, granularity, startCapital);
  else return [];
}

function runAlgorithm(
  algorithm: CryptoAlgorithm,
  data: CandleData[],
  granularity: CryptoGranularity,
  startCapital: number
): TradingDecision[] {
  return algorithm(data, granularity, startCapital);
}

function algorithm1(
  data: CandleData[],
  granularity: CryptoGranularity,
  startCapital: number
): TradingDecision[] {
  // First iteration do anything?
  // Should I buy the coin?
  // Count previous history?

  //
  return [];
}
