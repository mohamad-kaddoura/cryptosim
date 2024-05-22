import { useEffect, useState } from "react";
import { getCryptoData } from "../services/crypto";
import { Box } from "@mui/joy";
import { AgChartsReact } from "ag-charts-react";
import "ag-charts-enterprise";

interface CandleData {
  time: number;
  low: number;
  high: number;
  open: number;
  close: number;
  average: number;
  volume: number;
}

export default function Graph() {
  const [data, setData] = useState<CandleData[]>();

  const loadCryptoData = async () => {
    const res = (await getCryptoData({ accuracy: "1d" })) as Array<
      Array<number>
    >;
    const arr: CandleData[] = res.map((arr) => {
      return {
        time: arr[0] * 1000,
        low: arr[1],
        high: arr[2],
        open: arr[3],
        close: arr[4],
        volume: arr[5],
        average: (arr[4] + arr[3]) / 2,
      };
    });
    // console.log(arr);
    setData(arr);
  };

  useEffect(() => {
    loadCryptoData();
  }, []);

  return (
    <Box minHeight={100}>
      <AgChartsReact
        options={{
          title: {
            text: "BTC-USD",
          },
          height: 500,
          data,
          zoom: {
            enabled: true,
            enableScrolling: true,
          },
          series: [
            {
              xKey: "time",
              yKey: "average",
              xName: "Time",
              yName: "USD",
              tooltip: {
                renderer({ datum }) {
                  const candle = datum as CandleData;
                  return {
                    title: new Date(datum.time).toLocaleString("tr"),
                    backgroundColor: "black",
                    color: "white",
                    content: `Open: ${candle.open} USD<br/>Close: ${candle.close} USD`,
                  };
                },
              },
            },
          ],
          axes: [
            {
              type: "number",
              position: "left",
              label: {
                format: "#{.1f} USD",
                color: "green",
              },
            },
            {
              type: "time",
              position: "bottom",
            },
          ],
        }}
      />
    </Box>
  );
}
