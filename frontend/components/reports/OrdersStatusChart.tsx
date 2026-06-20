import { Doughnut } from "react-chartjs-2";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function formatStatus(status: string) {
  const labels: Record<string, string> = {
    RECEIVED: "Recibido",
    IN_PREPARATION: "En preparación",
    READY_FOR_PICKUP: "Listo para recoger",
    DELIVERED: "Entregado",
    NOT_ATTENDED: "No entregado",
    CANCELLED: "Cancelado",
  };

  return labels[status] || status;
}

export default function OrdersStatusChart({ data }: { data: any[] }) {
  const chartData = {
    labels: data.map((item) => formatStatus(item.status)),
    datasets: [
      {
        label: "Pedidos",
        data: data.map((item) => Number(item.total || 0)),
        backgroundColor: [
          "#f57c00",
          "#ffb74d",
          "#4caf50",
          "#2e7d32",
          "#c62828",
        ],
      },
    ],
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 240,
        margin: "0 auto",
      }}
    >
      <Doughnut
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: "top",
            },
          },
        }}
      />
    </div>
  );
}
