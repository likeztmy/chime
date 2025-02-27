import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface ImagePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageFile: File | null;
  onConfirm: () => void;
  loading?: boolean;
}

export function ImagePreviewModal({
  open,
  onOpenChange,
  imageFile,
  onConfirm,
  loading = false,
}: ImagePreviewModalProps) {
  const [previewUrl, setPreviewUrl] = React.useState<string>("");

  React.useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>发送图片</DialogTitle>
          <DialogDescription>
            确认要发送这张图片吗？图片大小：
            {imageFile ? (imageFile.size / 1024 / 1024).toFixed(2) : 0} MB
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-4">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="预览图片"
              className="max-w-full max-h-[400px] rounded-lg object-contain"
            />
          )}
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            取消
          </Button>
          <Button onClick={onConfirm} disabled={loading}>
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                发送中...
              </>
            ) : (
              "发送"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
