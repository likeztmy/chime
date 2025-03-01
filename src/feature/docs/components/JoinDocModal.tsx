import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "@tanstack/react-router";
interface JoinDocModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JoinDocModal({ open, onOpenChange }: JoinDocModalProps) {
  const navigate = useNavigate();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            加入未知文档
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            提示：您正在加入一个未知文档，请谨慎操作。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              navigate({
                to: "/docs",
              });
            }}
          >
            取消
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
            }}
          >
            加入
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
