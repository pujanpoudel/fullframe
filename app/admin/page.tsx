import { isAdmin } from "@/lib/cms/auth";
import { readContent } from "@/lib/cms/store";
import { StudioAdmin } from "@/components/studio-admin";
export const dynamic = "force-dynamic";
export const metadata = {title:"Studio Admin",robots:{index:false,follow:false}};
export default async function AdminPage() { const authorized = await isAdmin(); return <StudioAdmin initial={authorized ? await readContent("draft") : null}/>; }
