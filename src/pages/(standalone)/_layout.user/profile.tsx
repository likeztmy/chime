import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUserStore } from "@/feature/user/store";
import type { User } from "@/feature/user/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { ImageIcon, Loader } from "lucide-react";
import { useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { DottedSeparator } from "@/components/common/dotted-separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { request } from "@/lib/request";
import { toast } from "sonner";

const profileSchema = z.object({
  username: z.string().trim().min(1, "用户名不能为空"),
  signature: z.string(),
  avatar: z.union([z.instanceof(File), z.string()]).optional(),
});

export const Route = createFileRoute("/(standalone)/_layout/user/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, updateUser } = useUserStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      signature: user?.signature || "",
      avatar: user?.avatar || "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("avatar", file);
    }
  };

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      const updateData: Partial<User> = {
        username: values.username,
        signature: values.signature,
      };

      if (values.avatar) {
        if (values.avatar instanceof File) {
          // 先上传图片
          const formData = new FormData();
          formData.append("file", values.avatar);
          const uploadRes = await request.post("/user/oss/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          const { url } = uploadRes;
          updateData.avatar = url;
        } else {
          updateData.avatar = values.avatar;
        }
      }

      await request.put("/user/profile", updateData);
      updateUser(updateData);

      toast.success("更新个人资料成功");
      // 返回上一级
      window.history.back();
    } catch (error) {
      toast.error("更新个人资料失败");
    }
  };

  return (
    <div className="w-full lg:max-w-xl">
      <Card className="mt-10 border-none border-neutral-400 shadow-xl">
        <CardHeader className="flex px-7 py-4">
          <CardTitle className="text-xl font-bold">个人资料</CardTitle>
          <CardDescription className="text-[#666666] dark:text-[#888888] text-sm">
            管理您的个人信息和偏好设置
          </CardDescription>
        </CardHeader>

        <CardContent className="overflow-hidden">
          <div className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* 头像部分 */}
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        {field.value ? (
                          <div className="size-20 relative rounded-full overflow-hidden border-2 border-white dark:border-[#2A2A2A] shadow-sm">
                            <img
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                              alt="avatar"
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ) : (
                          <Avatar className="size-20 border-2 border-white dark:border-[#2A2A2A] shadow-sm">
                            <AvatarFallback>
                              <ImageIcon className="size-8 text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <FormLabel className="text-base font-medium text-[#1A1A1A] dark:text-white">
                          个人头像
                        </FormLabel>
                        <FormDescription className="text-sm text-[#666666] dark:text-[#888888] mt-1">
                          支持 JPG、PNG、SVG 格式，文件大小不超过 1MB
                        </FormDescription>
                        <input
                          className="hidden"
                          type="file"
                          accept=".jpg, .png, .jpeg, .svg"
                          ref={inputRef}
                          onChange={handleImageChange}
                        />
                        {field.value ? (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="w-fit mt-2"
                            onClick={() => {
                              field.onChange(null);
                              if (inputRef.current) {
                                inputRef.current.value = "";
                              }
                            }}
                          >
                            移除头像
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-fit mt-2"
                            onClick={() => inputRef.current?.click()}
                          >
                            上传头像
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                />

                <DottedSeparator />

                {/* 用户名部分 */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-[#1A1A1A] dark:text-white">
                        用户名
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="max-w-md border-[#E5E5E5] dark:border-[#2A2A2A] focus:ring-primary/30"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* 个人签名部分 */}
                <FormField
                  control={form.control}
                  name="signature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-[#1A1A1A] dark:text-white">
                        个人签名
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="写点什么来介绍自己吧..."
                          rows={4}
                          className="max-w-2xl border-[#E5E5E5] dark:border-[#2A2A2A] focus:ring-primary/30 resize-none"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* 底部操作栏 */}
                <div className="flex items-center justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="mr-2"
                    onClick={() => window.history.back()}
                  >
                    返回
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-white px-6"
                  >
                    保存修改
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
