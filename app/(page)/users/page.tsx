import Layout from "@/app/components/layout";
import Breakbout from "@/app/components/ui/breakbout";
import UserTable from "@/app/components/ui/UserTable";


export default function UsersPage() {
  return (
    <Layout>
      <Breakbout menu="Users" />
      <div className="mt-6" >
        <UserTable />
      </div>
    </Layout>
  );
}