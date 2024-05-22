import axios from "axios";

interface GetCryptoDataOptions {
  accuracy: "1m" | "1h" | "1d";
}

export async function getCryptoData(options: GetCryptoDataOptions) {
  const conversion = "BTC-USD";
  const url = `https://api.pro.coinbase.com/products/${conversion}/candles`;

  try {
    const res = await axios.get(url, {
      params: { granularity: options.accuracy },
    });

    return res.data;
  } catch (err) {
    alert("Error getting crypto data");
  }
}
