import axios from "axios";

export enum CryptoGranularity {
  one_minute = "1m",
  five_minute = "5m",
  fifteen_minute = "15m",
  one_hour = "1h",
  one_day = "1d",
}

export enum CryptoCoin {
  BTC = "BTC",
  ETH = "ETH",
  SOL = "SOL",
  ICP = "ICP",
  SHIB = "SHIB",
}

export interface GetCryptoDataOptions {
  coin: CryptoCoin;
  granularity: CryptoGranularity;
}

export async function getCryptoData(options: GetCryptoDataOptions) {
  const conversion = `${options.coin}-USD`;
  const url = `https://api.pro.coinbase.com/products/${conversion}/candles`;

  try {
    const res = await axios.get(url, {
      params: {
        granularity: options.granularity,
      },
    });

    return res.data;
  } catch (err) {
    alert("Error getting crypto data");
  }
}
