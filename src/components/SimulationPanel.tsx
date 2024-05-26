import {
  Box,
  Button,
  CircularProgress,
  FormLabel,
  Grid,
  Input,
  Option,
  Select,
  Stack,
  Typography,
} from "@mui/joy";
import { useState } from "react";
import { CryptoCoin, CryptoGranularity } from "../services/crypto";
import { useGlobalContext } from "../contexts/Global";
import {
  TradingAlgorithm,
  calculateSimulatedValues,
} from "../utils/algorithms";

export default function SimulationPanel() {
  const { setContext, context } = useGlobalContext();
  const [pending, setPending] = useState(false);
  const [coin, setCoin] = useState(context.coin);
  const [granularity, setGranularity] = useState<CryptoGranularity>(
    context.granularity
  );

  const [startCapital, setStartCapital] = useState(0);

  function handleStartSimulation() {
    setPending(true);
    const decisions = calculateSimulatedValues(
      context.data.sort((a, b) => (a.time > b.time ? 1 : -1)),
      granularity,
      TradingAlgorithm.ALGORITHM_1,
      startCapital
    );
    decisions.forEach((decision) => {
      console.log(
        `Action: ${decision.action}, Time: ${decision.time}, my balance (before: ${decision.transaction.myBalance.before}, after: ${decision.transaction.myBalance.after}), coin balance (before: ${decision.transaction.coinBalance.before}, after: ${decision.transaction.coinBalance.after})`
      );
    });
    setPending(false);
  }

  function handleLoadGraph() {
    setContext({
      ...context,
      coin,
      granularity,
    });
  }

  return (
    <Box p={2} boxSizing="border-box">
      <Stack spacing={1}>
        <FormLabel>Starting Capital</FormLabel>
        <Select
          value={coin}
          onChange={(e, value) => setCoin(value as CryptoCoin)}
        >
          {Object.keys(CryptoCoin).map((key) => {
            return (
              <Option key={key} value={key}>
                {key}
              </Option>
            );
          })}
        </Select>
        <Box>
          <Grid container spacing={1}>
            <Grid xs={4} sx={{ display: "flex", alignItems: "center" }}>
              <Typography fontWeight="bold">Every</Typography>
            </Grid>
            <Grid xs={8}>
              <Select
                value={granularity}
                onChange={(e, value) =>
                  setGranularity(value as CryptoGranularity)
                }
              >
                <Option value={CryptoGranularity.one_minute}>Minute</Option>
                <Option value={CryptoGranularity.five_minute}>5 Minutes</Option>
                <Option value={CryptoGranularity.fifteen_minute}>
                  15 Minutes
                </Option>
                <Option value={CryptoGranularity.one_hour}>Hour</Option>
                <Option value={CryptoGranularity.one_day}>Day</Option>
              </Select>
            </Grid>
          </Grid>
        </Box>
        <FormLabel>Starting Capital</FormLabel>
        <Input
          type="number"
          value={startCapital.toString()}
          onChange={(e) =>
            setStartCapital(
              Number.isNaN(parseFloat(e.target.value))
                ? 0
                : parseFloat(e.target.value)
            )
          }
        />
        <Button onClick={handleLoadGraph}>Load Graph</Button>

        <Typography fontWeight="bold">
          Start Capital: {startCapital.toFixed(2)} USD
        </Typography>
        <Button
          color="success"
          disabled={pending}
          onClick={handleStartSimulation}
        >
          {pending ? <CircularProgress /> : "Start"}
        </Button>
      </Stack>
    </Box>
  );
}
