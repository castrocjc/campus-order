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

function formatHour(hour: number | string) {
  return `${String(hour).padStart(2, "0")}:00`;
}

export default function PeakHoursChart({ data }: { data: any[] }) {
  const chartData = {
    labels: data.map((item) => formatHour(item.hour)),
    datasets: [
      {
        label: "Pedidos",
        data: data.map((item) => Number(item.totalOrders || 0)),
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
