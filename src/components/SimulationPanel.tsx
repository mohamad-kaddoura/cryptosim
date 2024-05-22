import {
  Box,
  Button,
  Grid,
  Input,
  Option,
  Select,
  Stack,
  Typography,
} from "@mui/joy";
import { useState } from "react";
import { CryptoGranularity } from "../services/crypto";
import { useGlobalContext } from "../contexts/Global";

export default function SimulationPanel() {
  const { setContext, context } = useGlobalContext();
  const [granularity, setGranularity] = useState<CryptoGranularity>(
    context.granularity
  );

  const [startCapital, setStartCapital] = useState(0);

  function handleLoadGraph() {
    setContext({
      ...context,
      granularity,
    });
  }

  return (
    <Box p={2} boxSizing="border-box">
      <Stack spacing={1}>
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
        <Input
          type="number"
          value={startCapital}
          onChange={(e) => setStartCapital(parseFloat(e.target.value))}
        />
        <Button onClick={handleLoadGraph}>Load Graph</Button>

        <Typography fontWeight="bold">
          Start Capital: {startCapital} USD
        </Typography>
        <Button color="success">Start</Button>
      </Stack>
    </Box>
  );
}
