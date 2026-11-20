import { StudioHome } from "@/components/studio-home";
import { readContent } from "@/lib/cms/store";
export const dynamic = "force-dynamic";
export default async function Home() { return <StudioHome content={await readContent()}/>; }
