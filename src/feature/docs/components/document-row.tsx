import { TableCell, TableRow } from "@/components/ui/table";
import { SiGoogledocs } from "react-icons/si";
import { Building2Icon, CircleUserIcon } from "lucide-react";
import { format } from "date-fns";

import { DocumentMenu } from "@/feature/docs/components/document-menu";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { formatUnixTime } from "@/lib/utils";

interface Document {
  id: number;
  created_at: number;
  content?: string | undefined;
  roomId?: string | undefined;
  organizationId?: string | undefined;
  title: string;
  creator_id: string;
}

interface DocumentRowProps {
  document: Document;
}

export const DocumentRow = ({ document }: DocumentRowProps) => {
  const navigate = useNavigate();

  const onRowClick = () => {
    navigate({
      to: "/docs/$id",
      params: { id: document.id.toString() },
    });
  };

  const onNewTabClick = (id: number) => {
    window.open(`/docs/${id}`, "_blank");
  };

  return (
    <TableRow onClick={onRowClick} className="cursor-pointer">
      <TableCell className="w-[50px]">
        <SiGoogledocs className="size-6 fill-blue-500" />
      </TableCell>
      <TableCell className="font-medium md:w-[45%]">{document.title}</TableCell>
      <TableCell className="text-muted-foreground hidden md:flex items-center gap-2">
        {document.organizationId ? (
          <Building2Icon className="size-4" />
        ) : (
          <CircleUserIcon className="size-4" />
        )}
        {document.organizationId ? "Organization" : "Personal"}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatUnixTime(document.created_at)}
      </TableCell>
      <TableCell className="flex justify-end">
        <DocumentMenu
          documentId={document.id}
          title={document.title}
          onNewTab={onNewTabClick}
        />
      </TableCell>
    </TableRow>
  );
};
