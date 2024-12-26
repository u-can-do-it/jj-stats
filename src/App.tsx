import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./App.css";
import { getJustJoinItLogs } from "./firebase";

export type TData = {
  [key: string]: number;
} & {
  timestamp: string;
};

function App() {
  const [data, setData] = useState([] as TData[]);
  const [currentDataKey, setCurrentDataKey] = useState<keyof TData>("all");

  useEffect(() => {
    getJustJoinItLogs().then((data) => {
      setData(data as unknown as TData[]);
    });
  }, []);

  const keys = Object.keys(data.at(-1) || {})
    ?.filter((key) => key !== "timestamp")
    .sort();

  const chartData = data?.map(({ timestamp, ...d }) => {
    const count = d[currentDataKey as keyof TData];
    return { count, timestamp };
  });
  console.log(data);
  return (
    <>
      {data.length === 0 && <p>Loading...</p>}
      <div>
        {keys.map((key) => (
          <button
            key={key}
            onClick={() => setCurrentDataKey(key as keyof TData)}
            disabled={key === currentDataKey}
            className={`${key === currentDataKey ? "selected" : ""}`}
          >
            {key}
          </button>
        ))}
      </div>

      <div style={{ width: "100%", height: "400px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData || [{ timestamp: new Date(), count: 0 }]}
            margin={{
              top: 40,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(value) => new Date(value).toLocaleString()}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

export default App;
