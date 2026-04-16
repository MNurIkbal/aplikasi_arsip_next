import { getArsipAction } from "@/app/api/arsip/route";
import Layout from "@/app/components/layout";
import ArsipClientContent from "@/app/components/ui/ArsipTable";
import Breakbout from "@/app/components/ui/breakbout";

export default async function ArsipPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Ambil parameter dari URL
  const search = typeof searchParams.search === "string" ? searchParams.search : "";
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;

  // Fetch data di server
  const { data, meta } = await getArsipAction({ search, page, limit });

  return (
    <Layout>
      <Breakbout menu="Pengarsipan" />
      <ArsipClientContent 
        initialData={data} 
        meta={meta} 
        serverPage={page} 
        serverLimit={limit} 
        serverSearch={search}
      />
    </Layout>
  );
}