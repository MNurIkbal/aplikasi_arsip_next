import Layout from "@/app/components/layout";
import Breakbout from "@/app/components/ui/breakbout";
import DonutChart from "@/app/components/ui/DonutChart";
import LineChart from "@/app/components/ui/LineChart";
import { Calendar, FileText, Users } from "lucide-react";

export default function DashboardPage() {
  return (
    <Layout>
      <Breakbout menu="Dashboard" />

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card Total Pengguna */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="text-center md:text-left">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Pengguna</h2>
            <p className="text-3xl font-black text-gray-800 mt-1">120</p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-xl">
            <Users className="text-indigo-600" size={28} />
          </div>
        </div>

        {/* Card Total Pengarsipan */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="text-center md:text-left">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Pengarsipan</h2>
            <p className="text-3xl font-black text-gray-800 mt-1">2,300</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl">
            <FileText className="text-emerald-600" size={28} />
          </div>
        </div>

        {/* Card Total Arsip Hari Ini */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="text-center md:text-left">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Arsip Hari Ini</h2>
            <p className="text-3xl font-black text-gray-800 mt-1">320</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl">
            <Calendar className="text-amber-600" size={28} />
          </div>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart mengambil 2 kolom */}
        <div className="lg:col-span-2">
          <LineChart />
        </div>

        {/* Donut Chart mengambil 1 kolom */}
        <div className="lg:col-span-1">
          <DonutChart />
        </div>
      </div>
    </Layout>
  );
}