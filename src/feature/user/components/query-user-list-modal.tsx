import { z } from "zod";
import { ResponsiveModal } from "@/components/common/responsive-modal";
import { useQueryUserListModal } from "../hooks/use-query-user-list-modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DottedSeparator } from "@/components/common/dotted-separator";
import { UserIcon, MailIcon, MessageSquare } from "lucide-react";
import { request } from "@/lib/request";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "../types";
import { useChatStore } from "@/feature/chat/store";
import { toast } from "sonner";

const formSchema = z.object({
  username: z.string().optional(),
  email: z.string().optional(),
});

export const QueryUserListModal = () => {
  const { isOpen, setIsOpen } = useQueryUserListModal();
  const [searchType, setSearchType] = useState<"username" | "email">(
    "username"
  );
  const { addConversation } = useChatStore();

  const [userList, setUserList] = useState<User[] | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const res = await request.get("/user/profiles", {
      username: data.username,
      email: data.email,
      page_index: 1,
      page_size: 10,
    });

    setUserList(res.user_list);
    form.reset();
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setUserList(null);
      form.reset();
    }
    setIsOpen(open);
  };

  const onChat = async (user: User) => {
    const res = await request.post(`/chatting/conversation/private/${user.id}`);
    const { conversation } = res;
    const newConversation = {
      ...conversation,
      messages: [],
      last_active_time: Date.now(),
    };
    addConversation(newConversation);
    setIsOpen(false);
    toast.success("创建会话成功！");
  };

  return (
    <ResponsiveModal open={isOpen} onOpenChange={onOpenChange}>
      <Card className="border-none border-[#d8d8d8] shadow-dialog">
        <CardHeader>
          <CardTitle className="text-[#1b1b1b]">查找用户</CardTitle>
          <CardDescription className="text-[#808080]">
            查找用户以开始聊天
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Tabs
                defaultValue={searchType}
                onValueChange={(value) =>
                  setSearchType(value as "username" | "email")
                }
              >
                <TabsList className="w-full">
                  <TabsTrigger value="username" className="w-full">
                    <UserIcon className="size-4 mr-2" />
                    用户名
                  </TabsTrigger>
                  <TabsTrigger value="email" className="w-full">
                    <MailIcon className="size-4 mr-2" />
                    邮箱
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="username">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="请输入用户名..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="email">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="请输入邮箱..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
              <DottedSeparator className="my-4" />
              <div className="flex justify-end">
                <Button type="submit" variant="submit" className="w-full">
                  查找
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        {userList && <DottedSeparator className="my-4" />}
        {userList && (
          <CardContent>
            <div className="flex flex-col gap-4">
              {userList.map((user) => (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>
                        {user.username?.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">
                        {user.username || "未命名"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    className="bg-primary text-white"
                    variant="outline"
                    onClick={() => onChat(user)}
                  >
                    <MessageSquare className="size-4 mr-2" />
                    聊天
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </ResponsiveModal>
  );
};
