import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { RenameDialog } from "@/components/common/rename-dialog";
import { Clock, PencilIcon } from "lucide-react";

interface DocumentHeaderProps {
  title: string;
  updatedAt: number;
  documentId: number;
}

export const DocumentHeader = ({
  title,
  updatedAt,
  documentId,
}: DocumentHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
      <div className="max-w-screen-xl mx-auto w-full px-6">
        <div className="flex flex-col gap-1 py-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold flex-1 text-foreground/90">
              {title}
            </h1>
            <RenameDialog documentId={documentId} initialTitle={title}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-muted/80 transition-colors"
              >
                <PencilIcon className="size-4 text-muted-foreground" />
              </Button>
            </RenameDialog>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-3.5" />
            <span>
              最后更新于 {format(new Date(updatedAt), "yyyy年MM月dd日 HH:mm")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
