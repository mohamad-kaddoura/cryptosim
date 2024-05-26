import { useDebugValue } from "react";
import { CandleData } from "../contexts/Global";
import { CryptoGranularity } from "../services/crypto";
import { average, stdDev } from "./statistics";

type CryptoAlgorithm = (
  data: CandleData[],
  granularity: CryptoGranularity,
  startCapital: number
) => TradingDecision[];

export enum TradingAlgorithm {
  ALGORITHM_1,
}

export enum TradingAction {
  SELL, // Sell the coin back to USD
  BUY, // Buy coin with USD
  IGNORE, // Do nothng
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
  console.log(data.length, "candles");
  if (algorithm === TradingAlgorithm.ALGORITHM_1)
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
  // Round robin trade
  const decisions: TradingDecision[] = [];
  let myBalance = startCapital;
  let coinBalance = 0;
  let lastBuyRate = 0;
  let lastSellRate = 0;

  function exchangeToCoin(rate: number, time: number) {
    const oldCoinBalance = coinBalance;
    const oldMyBalance = myBalance;
    lastBuyRate = rate;
    coinBalance += myBalance / rate;
    myBalance = 0;
    decisions.push({
      action: TradingAction.BUY,
      time,
      transaction: {
        startCapital,
        time,
        coinBalance: {
          before: oldCoinBalance,
          after: coinBalance,
        },
        myBalance: {
          before: oldMyBalance,
          after: myBalance,
        },
        change: myBalance - startCapital,
      },
    });
  }

  function exchangeToUSD(rate: number, time: number) {
    const oldCoinBalance = coinBalance;
    const oldMyBalance = myBalance;
    lastSellRate = rate;
    myBalance += coinBalance * rate;
    coinBalance = 0;
    decisions.push({
      action: TradingAction.SELL,
      time,
      transaction: {
        startCapital,
        time,
        coinBalance: {
          before: oldCoinBalance,
          after: coinBalance,
        },
        myBalance: {
          before: oldMyBalance,
          after: myBalance,
        },
        change: myBalance - startCapital,
      },
    });
  }
  function ignore(time: number) {
    decisions.push({
      action: TradingAction.BUY,
      time,
      transaction: {
        startCapital,
        time,
        coinBalance: {
          before: coinBalance,
          after: coinBalance,
        },
        myBalance: {
          before: myBalance,
          after: myBalance,
        },
        change: myBalance - startCapital,
      },
    });
  }
  // First iteration do anything?
  // Should I buy the coin?
  // Count previous history?

  // every sample size check the data

  const N = 7; // Sample size, the larger the sample size the more time will be sampled for each trade decision

  const LOSS_THRESHOLD = 0.05; // if the exchange rate reduces by less than 5% sell for safety

  let averages: number[] = [];
  console.log("Starting Balance:", myBalance);
  data.forEach((candle, i) => {
    averages.push(candle.average);
    // if (candle.close / candle.open < 1 - LOSS_THRESHOLD) {
    //   const oldCoinBalance = coinBalance;
    //   const oldMyBalance = myBalance;
    //   exchangeToUSD(candle.close, candle.time);
    //   decisions.push({
    //     action: TradingAction.SELL,
    //     time: candle.time,
    //     transaction: {
    //       startCapital,
    //       time: candle.time,
    //       coinBalance: {
    //         before: oldCoinBalance,
    //         after: coinBalance,
    //       },
    //       myBalance: {
    //         before: oldMyBalance,
    //         after: myBalance,
    //       },
    //       change: myBalance - startCapital,
    //     },
    //   });
    //   return;
    // }
    if (i % N !== 0 || i === 0) return; // Hit a sample size milestone
    const mean = average(averages);
    const standardDev = stdDev(averages);
    averages = [];

    const firstCandle = data[Math.floor(i / N)];
    const before = firstCandle.open;
    const after = candle.close;
    const change = after / before;
    const changeThreshold = standardDev / mean;
    // if change is positive is it good?
    // Large high negative change means more likely to drop - SELL

    // Large high positive change means more likely to rise - BUY

    // if change is negative is it good?

    // A trading decision should happen! SELL, BUY, IGNORE (We will consider selling, buying all)

    if (changeThreshold > 0.001) {
      const drop = change < 1;
      if (drop) {
        exchangeToUSD(candle.close, candle.time);
      } else {
        exchangeToCoin(candle.close, candle.time);
      }
    } else {
      ignore(candle.time);
    }
    console.log(myBalance);
  });

  // Exchange all what's left to my balance
  const lastCandle = data[data.length - 1];
  if (coinBalance > 0) {
    exchangeToUSD(lastCandle.close, lastCandle.time);
  }
  console.log("Ending Balance:", myBalance);

  return decisions;
}

//
function algorithm2(
  data: CandleData[],
  granularity: CryptoGranularity,
  startCapital: number
): TradingDecision[] {
  const decisions: TradingDecision[] = [];
  let myBalance = startCapital;
  let coinBalance = 0;
  let lastBuyRate = data[0].open;
  let profitSellRate = 0;
  let stopSellRate = 0;

  function exchangeToCoin(rate: number, time: number) {
    const oldCoinBalance = coinBalance;
    const oldMyBalance = myBalance;
    lastBuyRate = rate;
    coinBalance += myBalance / rate;
    myBalance = 0;
    decisions.push({
      action: TradingAction.BUY,
      time,
      transaction: {
        startCapital,
        time,
        coinBalance: {
          before: oldCoinBalance,
          after: coinBalance,
        },
        myBalance: {
          before: oldMyBalance,
          after: myBalance,
        },
        change: myBalance - startCapital,
      },
    });
  }

  function exchangeToUSD(rate: number, time: number) {
    const oldCoinBalance = coinBalance;
    const oldMyBalance = myBalance;
    stopSellRate = 0;
    profitSellRate = 0;
    myBalance += coinBalance * rate;
    coinBalance = 0;
    decisions.push({
      action: TradingAction.SELL,
      time,
      transaction: {
        startCapital,
        time,
        coinBalance: {
          before: oldCoinBalance,
          after: coinBalance,
        },
        myBalance: {
          before: oldMyBalance,
          after: myBalance,
        },
        change: myBalance - startCapital,
      },
    });
  }
  function ignore(time: number) {
    decisions.push({
      action: TradingAction.BUY,
      time,
      transaction: {
        startCapital,
        time,
        coinBalance: {
          before: coinBalance,
          after: coinBalance,
        },
        myBalance: {
          before: myBalance,
          after: myBalance,
        },
        change: myBalance - startCapital,
      },
    });
  }
  const N = 50;
  // max - min over N past candles
  const X = 7;
  const LOSS_THRESHOLD = 0.05; // if the exchange rate reduces by less than 5% sell for safety
  console.log("Starting Balance:", myBalance);

  let averages: number[] = [];
  data.forEach((candle, i) => {
    if (i < N) return;

    if (stopSellRate > 0 && profitSellRate > 0) {
      if (candle.close < stopSellRate || candle.average >= profitSellRate) {
        // sell back to USD if we hit the profit limit or the stop limit
        exchangeToUSD(candle.close, candle.time);
      }
      return;
    }
    // if we detect an upward trend
    averages.push(candle.average);
    const mean = average(averages);
    const standardDev = stdDev(averages);
    averages = [];

    const firstCandle = data[i - X];
    const before = firstCandle.open;
    const after = candle.close;
    const change = after / before;
    const changeThreshold = standardDev / mean;

    if (changeThreshold < 0.001) {
      const rise = change > 1;
      if (rise) {
        const firstIndex = i - N;
        let min = data[firstIndex].low;
        let max = data[firstIndex].high;
        for (let j = firstIndex; j < i; j++) {
          const currentCandle = data[j];
          if (currentCandle.low < min) min = currentCandle.low;
          if (currentCandle.high < max) max = currentCandle.high;
        }
        const difference = (max - min) * 0.618;
        profitSellRate = max + difference; // Sell when this goal is reached
        stopSellRate = candle.close * (1 - LOSS_THRESHOLD);
        exchangeToCoin(candle.close, candle.time);
      }
    }
  });
  // Exchange all what's left to my balance
  const lastCandle = data[data.length - 1];
  if (coinBalance > 0) {
    exchangeToUSD(lastCandle.close, lastCandle.time);
  }
  console.log("Ending Balance:", myBalance);
  return decisions;
}
