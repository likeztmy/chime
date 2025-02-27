import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Message {
  id: number;
  content_body: string;
  content_type: "text" | "image" | "audio" | "video";
  content_length: number;
  created_at: number;
  conversation_id: number;
  ip_address: string;
  ip_location: string;
  read_user: number;
  sender: number;
  total_user: number;
}

interface Conversation {
  id: number;
  avatar: string;
  created_at: number;
  chat_user_id: number;
  last_message_id: number;
  last_active_time: number;
  nickname: string;
  read_message_at: number;
  type: "private" | "group";
  total_user: number;
  unread_message: number;
  messages: Message[];
}

interface ChatState {
  conversationList: Conversation[];
  setConversationList: (conversationList: Conversation[]) => void;
  currentConversation: Conversation | null;
  setCurrentConversation: (conversation: Conversation | null) => void;
  addConversation: (conversation: Conversation) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      conversationList: [],
      currentConversation: null,
      setConversationList: (conversationList) => set({ conversationList }),
      setCurrentConversation: (conversation) =>
        set({ currentConversation: conversation }),
      addConversation: (conversation) =>
        set((state) => ({
          conversationList: [...state.conversationList, conversation],
        })),
    }),
    {
      name: "chat-storage", // 存储的唯一名称
      partialize: (state) => ({
        conversationList: state.conversationList,
        currentConversation: state.currentConversation,
      }), // 只持久化这些字段
    }
  )
);

// 导出直接访问store的方法，可以在非React组件环境中使用
export const chatStore = {
  getState: useChatStore.getState,
  setState: useChatStore.setState,
};
