import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { request } from "@/lib/request";
import React, { useState } from "react";
import { toast } from "sonner";

interface RemoveDialogProps {
  documentId: number;
  children: React.ReactNode;
}

export const RemoveDialog = ({ documentId, children }: RemoveDialogProps) => {
  // const remove = useMutation(api.documents.removeById);
  const [isDeleting, setIsDeleting] = useState(false);

  const onSubmit = async () => {
    setIsDeleting(true);
    await request.delete(`/docs/${documentId}`);
    toast.success("文档删除成功");
    setIsDeleting(false);
    window.location.reload();
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>确定要删除吗？</AlertDialogTitle>
          <AlertDialogDescription>
            此操作无法撤回。这将永久删除您的文档。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
            取消
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={(e) => {
              e.stopPropagation();
              onSubmit();
            }}
          >
            删除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
