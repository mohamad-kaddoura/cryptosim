import { Table } from "@mui/joy";
import { TradingAction, TradingDecision } from "../utils/algorithms";
import { useGlobalContext } from "../contexts/Global";

interface ResultsTableProps {
  decisions: TradingDecision[];
}

export default function ResultsTable(props: ResultsTableProps) {
  const { context } = useGlobalContext();
  return (
    <Table>
      <thead>
        <tr>
          <th style={{ width: 50 }}>Action</th>
          <th style={{ width: 150 }}>Time</th>
          <th>Exchange Rate</th>
          <th>My Balance (Before)</th>
          <th>My Balance (After)</th>
          <th>Coin Balance (Before)</th>
          <th>Coin Balance (After)</th>
          <th>Total Gain/Loss</th>
        </tr>
      </thead>
      <tbody>
        {props.decisions.map((decision) => {
          return (
            <tr>
              <td>{decision.action}</td>
              <td>{new Date(decision.time).toLocaleString("tr")}</td>
              <td>{decision.transaction.rate} USD</td>
              <td>{decision.transaction.myBalance.before.toFixed(4)} USD</td>
              <td>{decision.transaction.myBalance.after.toFixed(4)} USD</td>
              <td>
                {decision.transaction.coinBalance.before.toFixed(4)}{" "}
                {context.coin}
              </td>
              <td>
                {decision.transaction.coinBalance.after.toFixed(4)}{" "}
                {context.coin}
              </td>
              <td>
                {decision.action === TradingAction.SELL
                  ? `${decision.transaction.change.toFixed(4)} USD`
                  : ""}
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
