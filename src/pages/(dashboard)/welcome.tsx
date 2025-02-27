import { z } from "zod";
import {
  createFileRoute,
  redirect,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useChatStore } from "@/feature/chat/store";
import { request } from "@/lib/request";
import { motion } from "framer-motion";
import { useUserStore } from "@/feature/user/store";
import { Conversation } from "@/feature/chat/types";
import { toast } from "sonner";

const welcomeSearchSchema = z.object({
  code: z.string().optional(),
});

export const Route = createFileRoute("/(dashboard)/welcome")({
  component: RouteComponent,
  validateSearch: welcomeSearchSchema,
  beforeLoad: async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");

    // 如果有 code 参数,允许加载页面
    if (code) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      throw redirect({
        to: "/login",
      });
    }
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const { setConversationList, currentConversation, setCurrentConversation } =
    useChatStore();
  const { setUser } = useUserStore();
  const [loadingText, setLoadingText] = useState("正在连接服务器");
  const [progress, setProgress] = useState(0);
  const search = useSearch({ from: "/(dashboard)/welcome" });

  useEffect(() => {
    if (search.code) {
      const { code } = search;
      const getToken = async () => {
        const res = await request.get(`user/oauth2/exchange?code=${code}`);
        const { token } = res;
        const { access_token, refresh_token, token_type, expire_in } = token;
        // 保存 token 到 localStorage
        localStorage.setItem("token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("token_type", token_type);
        localStorage.setItem("expire_in", expire_in.toString());
        localStorage.setItem("redirect_url", "/welcome");
        toast.success("Login success!");
      };
      getToken();
    }
  }, []);

  useEffect(() => {
    const loadingTexts = [
      "正在连接服务器",
      "正在获取会话列表",
      "正在初始化数据",
      "即将进入应用",
    ];

    let currentIndex = 0;
    const textInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % loadingTexts.length;
      setLoadingText(loadingTexts[currentIndex]);
    }, 800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 2, 100));
    }, 60);

    const initializeData = async () => {
      try {
        const res = await request.get("/chatting/conversation");
        const { conversations } = res;
        setConversationList(conversations || []);

        if (currentConversation) {
          const conversation = conversations.find(
            (item: Conversation) => item.id === currentConversation.id
          );
          if (conversation) {
            setCurrentConversation(conversation);
          } else {
            setCurrentConversation(null);
          }
        }

        const userRes = await request.get("/user/profile");
        const { user } = userRes;
        setUser(user);

        // 确保动画展示3秒
        await new Promise((resolve) => setTimeout(resolve, 3000));
        navigate({ to: "/chat" });
      } catch (error) {
        console.error("Failed to initialize data:", error);
      }
    };

    initializeData();

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, [navigate, setConversationList]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex flex-col items-center gap-8 p-12 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg">
        <motion.div
          className="relative size-24"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 border-t-4 border-primary rounded-full" />
          <div className="absolute inset-2 border-t-4 border-primary/60 rounded-full rotate-45" />
          <div className="absolute inset-4 border-t-4 border-primary/40 rounded-full rotate-90" />
        </motion.div>

        <div className="flex flex-col items-center gap-4">
          <span className="text-lg font-medium text-gray-700 min-w-48 text-center">
            {loadingText}
          </span>

          <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span className="text-sm text-gray-500">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
