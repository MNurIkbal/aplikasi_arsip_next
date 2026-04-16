import Layout from "@/app/components/layout";
import ArsipClientContent from "@/app/components/ui/ArsipTable";
import Breakbout from "@/app/components/ui/breakbout";

export default async function ArsipPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>; 
}) {
  // Ambil parameter dari URL
  const params = await searchParams;

  // 2. Ambil parameter dengan aman
  const search = typeof params.search === "string" ? params.search : "";
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.max(1, Number(params.limit) || 10);

  return (
    <Layout>
      <Breakbout menu="Pengarsipan" />
      <ArsipClientContent 
        serverPage={page} 
        serverLimit={limit} 
        serverSearch={search}
      />
    </Layout>
  );
}