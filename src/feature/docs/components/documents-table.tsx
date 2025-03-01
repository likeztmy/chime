import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InboxIcon, LoaderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentRow } from "@/feature/docs/components/document-row";

type PaginationStatus =
  | "LoadingFirstPage"
  | "CanLoadMore"
  | "LoadingMore"
  | "Exhausted";

interface Document {
  id: number;
  created_at: number;
  content?: string | undefined;
  roomId?: string | undefined;
  organizationId?: string | undefined;
  title: string;
  creator_id: string;
}

interface DocumentsTableProps {
  documents: Document[] | undefined;
  loadMore: (numItems: number) => void;
  status: PaginationStatus;
}

export const DocumentsTable = ({
  documents,
  loadMore,
  status,
}: DocumentsTableProps) => {
  return (
    <div className="max-w-screen-xl mx-auto px-16 py-6 flex flex-col gap-5">
      {documents === undefined ? (
        <div className="flex justify-center items-center h-24">
          <LoaderIcon className="animate-spin text-muted-foreground size-5" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-none">
              <TableHead>名称</TableHead>
              <TableHead>&nbsp;</TableHead>
              <TableHead className="hidden md:table-cell">归属</TableHead>
              <TableHead className="hidden md:table-cell">创建时间</TableHead>
            </TableRow>
          </TableHeader>
          {documents.length === 0 ? (
            <TableBody>
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={4} className="h-[400px] text-center">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-muted/30 flex items-center justify-center">
                      <InboxIcon className="size-12 bg-transparent text-muted-foreground" />
                    </div>
                    <div className="space-y-2 max-w-[320px] text-center">
                      <h3 className="text-lg font-medium">暂无文档</h3>
                      <p className="text-sm text-muted-foreground">
                        创建你的第一个文档，开始记录和分享你的想法
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {documents.map((document) => (
                <DocumentRow key={document.id} document={document} />
              ))}
            </TableBody>
          )}
        </Table>
      )}
      {status !== "Exhausted" && (
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => loadMore(5)}
            disabled={status !== "CanLoadMore"}
          >
            {status === "CanLoadMore" ? "加载更多" : "没有更多了"}
          </Button>
        </div>
      )}
    </div>
  );
};
