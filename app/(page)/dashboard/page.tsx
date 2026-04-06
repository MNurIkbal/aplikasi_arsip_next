import Layout from "@/app/components/layout";

export default function DashboardPage() {
  return (
    <>
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      <div className="bg-white p-6 rounded-xl shadow">
        <h2>Total Users</h2>
        <p className="text-2xl font-bold">120</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2>Revenue</h2>
        <p className="text-2xl font-bold">$2,300</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2>Orders</h2>
        <p className="text-2xl font-bold">320</p>
      </div>

    </div>
    </Layout>
    </>
  );
}