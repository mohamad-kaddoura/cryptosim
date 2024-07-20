import { Box, Grid } from "@mui/joy";
import Graph from "./components/Graph";
import SimulationPanel from "./components/SimulationPanel";
import ResultsTable from "./components/ResultsTable";
import { useGlobalContext } from "./contexts/Global";

function App() {
  const { context } = useGlobalContext();
  return (
    <Box sx={{ height: 1, width: 1, overflow: "hidden" }}>
      <Box>
        <Grid container spacing={2}>
          <Grid md={8}>
            <Graph />
          </Grid>
          <Grid md={4}>
            <SimulationPanel />
          </Grid>
        </Grid>
      </Box>
      <Box p={4}>
        <ResultsTable decisions={context.results} />
      </Box>
    </Box>
  );
}

export default App;
