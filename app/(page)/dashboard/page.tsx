import Layout from "@/app/components/layout";
import Breakbout from "@/app/components/ui/breakbout";
import DonutChart from "@/app/components/ui/DonutChart";
import LineChart from "@/app/components/ui/LineChart";

export default function DashboardPage() {
  return (
    <Layout>
      <Breakbout menu="Dashboard" />
      
      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 text-center md:text-left">
          <h2 className="text-sm font-semibold text-gray-400 uppercase">Total Users</h2>
          <p className="text-3xl font-black text-gray-800 mt-1">120</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 text-center md:text-left">
          <h2 className="text-sm font-semibold text-gray-400 uppercase">Revenue</h2>
          <p className="text-3xl font-black text-indigo-600 mt-1">$2,300</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 text-center md:text-left">
          <h2 className="text-sm font-semibold text-gray-400 uppercase">Orders</h2>
          <p className="text-3xl font-black text-gray-800 mt-1">320</p>
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