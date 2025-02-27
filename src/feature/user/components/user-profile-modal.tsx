import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Loader } from "lucide-react";
import { User } from "../types";
import { request } from "@/lib/request";
import { toast } from "sonner";

interface UserProfileModalProps {
  userId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileModal({
  userId,
  open,
  onOpenChange,
}: UserProfileModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState<User | null>(null);

  const fetchUserInfo = React.useCallback(async (id: number) => {
    try {
      setLoading(true);
      const res = await request.get(`/user/profile/${id}`);
      setUserInfo(res.user);
    } catch (error) {
      toast.error("获取用户信息失败");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (open && userId) {
      fetchUserInfo(userId);
    } else {
      setUserInfo(null);
    }
  }, [open, userId, fetchUserInfo]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>用户信息</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          {loading ? (
            <div className="flex items-center justify-center w-full h-32">
              <Loader className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : userInfo ? (
            <>
              <Avatar className="h-24 w-24">
                <AvatarImage src={userInfo.avatar} />
                <AvatarFallback>
                  {userInfo.username?.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-center gap-1">
                <h3 className="text-lg font-semibold">{userInfo.username}</h3>
                <p className="text-sm text-muted-foreground">
                  {userInfo.email}
                </p>
                {userInfo.signature && (
                  <p className="text-sm text-center text-muted-foreground mt-2">
                    {userInfo.signature}
                  </p>
                )}
              </div>
              <Button className="mt-2" onClick={() => onOpenChange(false)}>
                <MessageSquare className="mr-2 h-4 w-4" />
                发消息
              </Button>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
