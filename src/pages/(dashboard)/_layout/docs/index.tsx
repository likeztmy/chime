import { DocumentsTable } from "@/feature/docs/components/documents-table";
import { TemplateGallery } from "@/feature/docs/components/template-gallery";
import { request } from "@/lib/request";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/(dashboard)/_layout/docs/")({
  component: RouteComponent,
});

interface Document {
  id: number;
  created_at: number;
  content?: string | undefined;
  roomId?: string | undefined;
  organizationId?: string | undefined;
  title: string;
  creator_id: string;
}

function RouteComponent() {
  const [documents, setDocuments] = useState<Document[]>([]);

  const loadMore = () => {};
  const status = "Exhausted";

  useEffect(() => {
    const fetchDocuments = async () => {
      const res = await request.get("/docs");
      const { docs } = res;
      setDocuments(docs ?? []);
    };
    fetchDocuments();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="">
        <TemplateGallery />
        <DocumentsTable
          documents={documents}
          loadMore={loadMore}
          status={status}
        />
      </div>
    </div>
  );
}
