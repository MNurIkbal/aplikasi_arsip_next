"use client";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: true });

export default function DonutChart() {
  const chartOptions: any = {
    chart: {
      type: "donut",
      fontFamily: "inherit",
    },
    labels: ["Dokumen Rahasia", "Dokumen Publik", "Dokumen Khusus"],
    colors: ["#4f46e5", "#10b981", "#f59e0b"], // Indigo, Green, Amber
    legend: {
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              formatter: () => "120",
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    tooltip: { theme: "light" },
  };

  const chartSeries = [60, 45, 15];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Statistik Sebaran Kategori</h2>
      <Chart options={chartOptions} series={chartSeries} type="donut" height={300} />
    </div>
  );
}