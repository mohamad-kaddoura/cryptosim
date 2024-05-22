import { Box, Grid } from "@mui/joy";
import Graph from "./components/Graph";
import SimulationPanel from "./components/SimulationPanel";

function App() {
  return (
    <Box sx={{ height: 1, width: 1, overflow: "hidden" }}>
      <Grid container spacing={2}>
        <Grid md={8}>
          <Graph />
        </Grid>
        <Grid md={4}>
          <SimulationPanel />
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
