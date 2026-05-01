import { useEffect, useState } from "react";
import api from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function ReportsPage() {
  const [salesByDay, setSalesByDay] = useState([]);

  useEffect(() => {
    api.get("/orders/reports/sales-by-day")
      .then(res => setSalesByDay(res.data.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <section className="mt-10">
      <h1 className="text-3xl font-bold mb-6">Reportes</h1>

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
        <h2 className="text-xl font-semibold mb-4">Ventas por día</h2>

        {salesByDay.length === 0 ? (
          <p className="text-slate-400">
            No hay ventas entregadas registradas.
          </p>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByDay}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  );
}

export default ReportsPage;