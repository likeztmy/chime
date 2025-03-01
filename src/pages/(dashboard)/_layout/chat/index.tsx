import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  FilePlusIcon,
  ImagePlusIcon,
  Loader,
  MoreHorizontal,
  PlusIcon,
  SendIcon,
  SmileIcon,
  MessageSquare,
  Users,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useQueryUserListModal } from "@/feature/user/hooks/use-query-user-list-modal";
import { useChatStore, chatStore } from "@/feature/chat/store";
import { request } from "@/lib/request";
import { cn, formatUnixTime } from "@/lib/utils";
import { useUserStore } from "@/feature/user/store";
import React, { useRef, useEffect, useCallback } from "react";
import { Conversation, Message } from "@/feature/chat/types";
import EmojiPicker from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";
import { useClickAway } from "react-use";
import { useChatWebSocket } from "@/feature/chat/hooks/use-chat-websocket";
import { toast } from "sonner";
import { ImagePreviewModal } from "@/components/common/image-preview-modal";
import { useUserProfileModal } from "@/feature/user/hooks/use-user-profile-modal";
import { UserProfileModal } from "@/feature/user/components/user-profile-modal";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/(dashboard)/_layout/chat/")({
  component: RouteComponent,
  beforeLoad: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw redirect({
        to: "/login",
      });
    }

    // 检查是否有持久化的数据
    const persistedState = localStorage.getItem("chat-storage");
    if (
      !persistedState ||
      !JSON.parse(persistedState).state.conversationList?.length
    ) {
      // 如果没有持久化数据，才请求新数据
      const res = await request.get("/chatting/conversation");
      const { conversations } = res;
      chatStore.setState({ conversationList: conversations || [] });
    }
  },
});

function RouteComponent() {
  const { open } = useQueryUserListModal();
  const {
    conversationList,
    currentConversation,
    setCurrentConversation,
    setConversationList,
  } = useChatStore();

  console.log(currentConversation);

  const { user } = useUserStore();
  const [message, setMessage] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const [loadingHistory, setLoadingHistory] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [showImagePreview, setShowImagePreview] = React.useState(false);
  const {
    open: userProfileOpen,
    isOpen,
    selectedUserId,
    setIsOpen,
  } = useUserProfileModal();

  // 初始化WebSocket连接
  useChatWebSocket();

  const handleConversationClick = async (conversation: Conversation) => {
    if (conversation.messages.length > 0) {
      await request.put(
        `/chatting/conversation/notification/${conversation.id}?read_message_at=${conversation.messages[0].id}`
      );
    }
    setCurrentConversation(conversation);
    setConversationList(
      conversationList.map((item) =>
        item.id === conversation.id ? { ...item, unread_message: 0 } : item
      )
    );
  };

  useClickAway(emojiPickerRef, () => {
    setShowEmojiPicker(false);
  });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowEmojiPicker(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages[0]]);

  const loadHistoryMessages = useCallback(async () => {
    if (!currentConversation || loadingHistory || !hasMore) return;

    try {
      setLoadingHistory(true);
      const oldestMessage =
        currentConversation.messages[currentConversation.messages.length - 1];
      const container = messagesContainerRef.current;
      if (!container) return;

      // 保存当前第一条可见消息的引用
      const firstVisibleMessage = container.querySelector("[data-message-id]");
      const firstVisibleMessageId =
        firstVisibleMessage?.getAttribute("data-message-id");
      const firstVisibleMessageTop =
        firstVisibleMessage?.getBoundingClientRect().top;

      const res = await request.get(
        `/chatting/conversation/message/${currentConversation.id}`,
        {
          last_message_id: oldestMessage?.id,
        }
      );

      const { messages: historyMessages } = res;

      if (!historyMessages || historyMessages.length === 0) {
        setHasMore(false);
        return;
      }

      // 更新消息列表
      const updatedConversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, ...historyMessages],
      };

      const updatedConversationList = conversationList.map((item) =>
        item.id === currentConversation.id ? updatedConversation : item
      );

      setCurrentConversation(updatedConversation);
      setConversationList(updatedConversationList);

      // 在下一个渲染周期恢复滚动位置
      requestAnimationFrame(() => {
        if (firstVisibleMessageId) {
          const element = container.querySelector(
            `[data-message-id="${firstVisibleMessageId}"]`
          );
          if (element && firstVisibleMessageTop) {
            const newTop = element.getBoundingClientRect().top;
            const scrollAdjustment = newTop - firstVisibleMessageTop;
            container.scrollTop += scrollAdjustment;
          }
        }
      });
    } catch (error) {
      console.error("加载历史消息失败:", error);
    } finally {
      setLoadingHistory(false);
    }
  }, [currentConversation, loadingHistory, hasMore, conversationList]);

  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // 当滚动到顶部时加载历史消息
    if (container.scrollTop === 0) {
      loadHistoryMessages();
    }
  }, [loadHistoryMessages]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (currentConversation) {
      setHasMore(true);
    }
  }, [currentConversation?.id]);

  const sendMessage = async () => {
    if (!message.trim() || !currentConversation || sending) return;

    try {
      setSending(true);
      const res = await request.post(
        `/chatting/conversation/message/${currentConversation.id}`,
        {
          content_body: message,
          content_type: "text",
          content_length: message.length,
        }
      );

      const { message: newMessage } = res as { message: Message };

      const updatedConversation = {
        ...currentConversation,
        messages: [newMessage, ...currentConversation.messages],
        last_message_id: newMessage.id,
        last_active_time: newMessage.created_at,
        unread_message: 0,
      };

      const updatedConversationList = conversationList.map((item) =>
        item.id === currentConversation.id ? updatedConversation : item
      );
      setCurrentConversation(updatedConversation);
      setConversationList(updatedConversationList);

      setMessage("");
    } catch (error) {
      console.error("发送消息失败:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentConversation || !e.target.files?.[0]) return;

    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast.error("图片大小不能超过5MB");
      return;
    }

    setSelectedImage(file);
    setShowImagePreview(true);
  };

  const handleImageUpload = async () => {
    if (!currentConversation || !selectedImage) return;

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      setSending(true);
      // 先上传图片
      const uploadRes = await request.post("/user/oss/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { url } = uploadRes;

      // 发送图片消息
      const res = await request.post(
        `/chatting/conversation/message/${currentConversation.id}`,
        {
          content_body: url,
          content_type: "image",
          content_length: selectedImage.size,
        }
      );

      const { message: newMessage } = res as { message: Message };

      const updatedConversation = {
        ...currentConversation,
        messages: [newMessage, ...currentConversation.messages],
        last_message_id: newMessage.id,
        last_active_time: newMessage.created_at,
      };

      const updatedConversationList = conversationList.map((item) =>
        item.id === currentConversation.id ? updatedConversation : item
      );
      setCurrentConversation(updatedConversation);
      setConversationList(updatedConversationList);

      // 清空状态
      setSelectedImage(null);
      setShowImagePreview(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    } catch (error) {
      console.error("发送图片失败:", error);
      toast.error("发送图片失败");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full h-full overflow-hidden bg-[#FAFAFA]">
      <div className="flex w-full h-full overflow-hidden">
        <div className="md:w-[280px] sm:w-[240px] w-0 transition-all duration-300 bg-white border-r border-[#E5E7EB]">
          <div className="flex flex-col w-full h-full overflow-hidden">
            <div className="flex justify-between items-center w-full border-b border-[#E5E7EB] px-4 py-3">
              <span className="text-base font-medium text-[#111827]">消息</span>
              <Button
                onClick={() => open()}
                className="rounded-full hover:bg-[#F3F4F6]"
                variant="ghost"
                size="icon"
              >
                <PlusIcon className="size-4 text-[#374151]" />
              </Button>
            </div>
            <div className="flex-1 w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#E5E7EB] hover:scrollbar-thumb-[#D1D5DB]">
              <div className="flex flex-col w-full h-full py-2">
                {conversationList.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleConversationClick(conversation)}
                    className={cn(
                      "w-full flex p-3 mb-0.5 cursor-pointer hover:bg-[#F3F4F6] transition-colors",
                      currentConversation?.id === conversation.id &&
                        "bg-[#F3F4F6]"
                    )}
                  >
                    <div className="flex items-center">
                      <Avatar className="size-10 border border-[#E5E7EB] rounded-full">
                        <AvatarImage src={conversation.avatar} />
                        <AvatarFallback>
                          {<Loader className="text-[#6B7280]" />}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 flex flex-col ml-3">
                      <span className="text-sm font-medium text-[#111827]">
                        {conversation?.nickname}
                      </span>
                      <span className="text-xs text-[#6B7280] mt-1 line-clamp-1 truncate max-w-[100px]">
                        {conversation?.messages?.[0]?.content_type === "image"
                          ? "【图片】"
                          : conversation?.messages?.[0]?.content_body}
                      </span>
                    </div>
                    <div className="flex items-center pt-0.5">
                      {conversation.unread_message === 0 ? (
                        <span className="text-xs text-[#6B7280]">
                          {formatUnixTime(conversation.last_active_time)}
                        </span>
                      ) : (
                        <Badge className="text-[12px] bg-red-500 rounded-full text-white hover:bg-red-600">
                          {conversation.unread_message}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-white">
          {!currentConversation ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-white to-[#F9FAFB]">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full blur opacity-20 animate-pulse"></div>
                <div className="relative bg-white p-8 rounded-full shadow-sm">
                  <MessageSquare className="size-16 text-[#6B7280]" />
                </div>
              </div>
              <div className="mt-8 text-center space-y-2 max-w-[320px]">
                <h3 className="text-2xl font-semibold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">
                  开始新的对话
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  从左侧选择一个联系人开始聊天，或者点击
                  <Button
                    variant="link"
                    className="px-1 text-[#4F46E5] hover:text-[#7C3AED] transition-colors"
                    onClick={() => open()}
                  >
                    <PlusIcon className="size-4 mr-1" />
                    添加新联系人
                  </Button>
                </p>
              </div>
              <div className="mt-12 flex items-center gap-3 text-[#9CA3AF]">
                <Users className="size-5" />
                <span className="text-sm">
                  已有 {conversationList.length} 个联系人
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB] bg-white">
                <div className="flex items-center gap-2">
                  <Avatar
                    className="cursor-pointer"
                    onClick={() =>
                      userProfileOpen(currentConversation.chat_user_id)
                    }
                  >
                    <AvatarImage src={currentConversation.avatar} />
                    <AvatarFallback>
                      {currentConversation.nickname?.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-base font-medium text-[#111827]">
                    {currentConversation.nickname}
                  </span>
                </div>
                <Button
                  className="rounded-full hover:bg-[#F3F4F6]"
                  variant="ghost"
                  size="icon"
                >
                  <MoreHorizontal className="size-4 text-[#374151]" />
                </Button>
              </div>
              <div
                ref={messagesContainerRef}
                className="flex-1 w-full h-[calc(100%-12rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-[#E5E7EB] hover:scrollbar-thumb-[#D1D5DB] px-4"
              >
                <div className="py-6 space-y-6">
                  {loadingHistory && (
                    <div className="flex justify-center items-center py-4">
                      <Loader className="size-4 text-[#374151] animate-spin mr-2" />
                      <span className="text-sm text-[#374151]">
                        加载历史消息...
                      </span>
                    </div>
                  )}
                  {!hasMore && (
                    <div className="flex justify-center items-center py-4">
                      <span className="text-sm text-[#9CA3AF]">
                        没有更多消息了
                      </span>
                    </div>
                  )}
                  {currentConversation.messages
                    .slice()
                    .reverse()
                    .map((message) => (
                      <div
                        key={message.id}
                        data-message-id={message.id}
                        className={`flex items-end gap-2 group ${
                          message.sender === currentConversation.chat_user_id
                            ? ""
                            : "flex-row-reverse"
                        }`}
                      >
                        <Avatar
                          className="size-8 border border-[#E5E7EB] rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() =>
                            userProfileOpen(
                              message.sender ===
                                currentConversation.chat_user_id
                                ? message.sender
                                : user?.id!
                            )
                          }
                        >
                          <AvatarImage
                            src={
                              message.sender ===
                              currentConversation.chat_user_id
                                ? currentConversation.avatar
                                : user?.avatar || ""
                            }
                          />
                          <AvatarFallback>
                            {<Loader className="text-[#6B7280]" />}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={cn(
                            "max-w-[70%] rounded-2xl",
                            message.content_type === "image"
                              ? "p-1 bg-white border border-[#E5E7EB]"
                              : cn(
                                  "px-4 py-2.5",
                                  message.sender ===
                                    currentConversation.chat_user_id
                                    ? "bg-[#4F46E5] bg-opacity-95 text-white"
                                    : "bg-[#F3F4F6] text-[#111827]"
                                )
                          )}
                        >
                          {message.content_type === "image" ? (
                            <img
                              src={message.content_body}
                              alt="chat image"
                              className="max-w-full rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() =>
                                window.open(message.content_body, "_blank")
                              }
                            />
                          ) : (
                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                              {message.content_body}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-[#9CA3AF] group-hover:opacity-100 opacity-0 transition-opacity">
                          {formatUnixTime(message.created_at)}
                        </span>
                      </div>
                    ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              <div className="w-full h-[12rem] border-t border-[#E5E7EB] bg-white">
                <div className="w-full flex flex-col overflow-hidden px-4 py-3">
                  <div className="flex items-center w-full justify-between mb-2">
                    <div className="flex items-center gap-1">
                      <div className="relative" ref={emojiPickerRef}>
                        <Button
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="rounded-full hover:bg-[#F3F4F6]"
                          variant="ghost"
                          size="icon"
                        >
                          <SmileIcon className="size-4 text-[#374151]" />
                        </Button>
                        {showEmojiPicker && (
                          <div className="fixed bottom-[12rem] z-[9999] shadow-lg rounded-lg bg-white">
                            <EmojiPicker
                              onEmojiClick={onEmojiClick}
                              lazyLoadEmojis
                              searchPlaceHolder="搜索表情"
                              skinTonesDisabled
                              width={320}
                              height={400}
                            />
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={imageInputRef}
                        onChange={handleImageSelect}
                      />
                      <Button
                        className="rounded-full hover:bg-[#F3F4F6]"
                        variant="ghost"
                        size="icon"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={sending}
                      >
                        <ImagePlusIcon className="size-4 text-[#374151]" />
                      </Button>
                      <Button
                        className="rounded-full hover:bg-[#F3F4F6]"
                        variant="ghost"
                        size="icon"
                      >
                        <FilePlusIcon className="size-4 text-[#374151]" />
                      </Button>
                    </div>
                    <Button
                      onClick={sendMessage}
                      disabled={!message.trim() || sending}
                      className="rounded-full hover:bg-[#F3F4F6]"
                      variant="ghost"
                      size="icon"
                    >
                      {sending ? (
                        <Loader className="size-4 text-[#374151] animate-spin" />
                      ) : (
                        <SendIcon className="size-4 text-[#374151]" />
                      )}
                    </Button>
                  </div>
                  <div className="w-full">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="w-full min-h-[100px] max-h-[200px] border-none bg-[#F9FAFB] focus-visible:ring-1 focus-visible:ring-[#E5E7EB] focus-visible:ring-offset-0 resize-none rounded-lg px-4 py-3 text-[#111827] placeholder:text-[#9CA3AF] scrollbar-thin scrollbar-thumb-[#E5E7EB] hover:scrollbar-thumb-[#D1D5DB]"
                      placeholder="请输入消息"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ImagePreviewModal
        open={showImagePreview}
        onOpenChange={setShowImagePreview}
        imageFile={selectedImage}
        onConfirm={handleImageUpload}
        loading={sending}
      />
      <UserProfileModal
        userId={selectedUserId}
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    </div>
  );
}
