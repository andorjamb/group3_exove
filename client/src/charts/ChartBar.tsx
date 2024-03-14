import React from "react";
import {
  Legend,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Label,
} from "recharts";

interface Props {
  barChartData: {
    question: string;
    questionId: string;
    colleagueAverage: number;
    colleagues: number; //
    CM: number;
    self: number;
  }[];
}

const ChartBar = ({ barChartData }: Props) => {
  return (
    <div
      className="reportChart"
      style={{
        height: "300px",
        width: "400px",
        border: "1px solid gray",
        margin: "1rem",
        padding: "1rem",
      }}
    >
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          width={350}
          height={250}
          data={barChartData}
          margin={{
            top: 30,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="question" />
          <YAxis dataKey="" domain={[0, 5]}>
            <Label value="" angle={-90} position="insideBottomLeft" />
          </YAxis>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Tooltip />
          <Legend />
          <Bar dataKey="colleagues" fill="rgb(101,27,222)" />
          <Bar dataKey="CM" fill="rgb(99,173,123)" />
          <Bar dataKey="self" fill="rgb(241,156,91)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartBar;
