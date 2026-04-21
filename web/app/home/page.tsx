import FileBrowser from "@/components/features/file-browser/FileBrowser";
import { PageContainer } from "@/components/ui/PageContainer";

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ folderId?: string }>;
}) {
  return (
    <PageContainer title="All Files">
      <HomeContent searchParams={searchParams} />
    </PageContainer>
  );
}

async function HomeContent({
  searchParams,
}: {
  searchParams: Promise<{ folderId?: string }>;
}) {
  const { folderId } = await searchParams;
  const initialFolderId = folderId ? parseInt(folderId, 10) : null;

  return <FileBrowser initialFolderId={initialFolderId} />;
}
