import FileBrowser from "@/components/features/file-browser/FileBrowser";
import { PageContainer } from "@/components/ui/PageContainer";

export default function Home() {
  return (
    <PageContainer title="All Files">
      <FileBrowser />
    </PageContainer>
  );
}
