import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function SalesByDayChart({ data }: { data: any[] }) {
  const chartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: "Ventas",
        data: data.map((item) => Number(item.total || 0)),
        backgroundColor: "#f57c00",
      },
    ],
  };

  return (
    <div
      style={{
        height: 260,
      }}
    >
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
}
