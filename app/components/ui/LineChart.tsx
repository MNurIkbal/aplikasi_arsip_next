"use client";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function LineChart() {
  const chartOptions: any = {
    chart: {
      type: "line",
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    stroke: {
      curve: "smooth", // Garis melengkung halus
      width: 4,
    },
    colors: ["#4f46e5"], 
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      labels: { style: { colors: "#9ca3af" } }
    },
    yaxis: {
      labels: { style: { colors: "#9ca3af" } }
    },
    grid: {
      borderColor: "#f1f1f1",
      strokeDashArray: 4, // Garis putus-putus pada grid
    },
    markers: {
      size: 4,
      colors: ["#4f46e5"],
      strokeColors: "#fff",
      strokeWidth: 2,
    },
    tooltip: { theme: "light" },
  };

  const chartSeries = [
    {
      name: "Orders",
      data: [30, 40, 35, 50, 49, 60],
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Statistik Pengarsipan Per Bulan</h2>
      <Chart options={chartOptions} series={chartSeries} type="line" height={300} />
    </div>
  );
}