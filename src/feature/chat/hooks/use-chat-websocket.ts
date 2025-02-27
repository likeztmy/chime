import { useEffect, useRef } from "react";
import { useChatStore, chatStore } from "../store";
import { Message } from "../types";
import useWebSocket from "react-use-websocket";
import { request } from "@/lib/request";

export function useChatWebSocket() {
  const {
    conversationList,
    setConversationList,
    currentConversation,
    setCurrentConversation,
    addConversation,
  } = useChatStore();

  // 添加对conversationList的监听
  useEffect(() => {
    console.log("conversationList updated:", conversationList);
  }, [conversationList]);

  const token = localStorage.getItem("token");
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    token ? "ws://47.120.14.30:8082/api/v1/chatting/ws" : null,
    {
      shouldReconnect: () => true, // 自动重连
      reconnectAttempts: 10, // 最大重连次数
      reconnectInterval: 3000, // 重连间隔时间
      onOpen: () => {
        console.log("WebSocket连接已建立");
        // 发送认证信息
        sendMessage(JSON.stringify({ type: "auth", token: `Bearer ${token}` }));
      },
      onClose: () => {
        console.log("WebSocket连接已关闭");
      },
      onError: (error) => {
        console.error("WebSocket错误:", error);
      },
    }
  );

  useEffect(() => {
    if (lastMessage) {
      (async () => {
        try {
          const data = JSON.parse(lastMessage.data);
          // 处理接收到的消息
          if (data.receive_type === "new_message") {
            const newMessage: Message = data.payload.message;

            // 保存当前滚动位置
            const container = messagesContainerRef.current;
            const isAtBottom = container
              ? container.scrollTop + container.clientHeight >=
                container.scrollHeight - 10
              : false;

            const isNewConversation = !conversationList
              .map((item) => item.id)
              .includes(newMessage.conversation_id);

            if (isNewConversation) {
              const res = await request.get(
                `/chatting/conversation/${newMessage.conversation_id}`
              );
              const { conversation } = res;
              addConversation(conversation);
            } else {
              // 更新会话列表中的最后一条消息
              // 使用getState获取最新状态
              const latestState = chatStore.getState();
              const updatedConversationList = latestState.conversationList.map(
                (conversation) => {
                  if (conversation.id === newMessage.conversation_id) {
                    if (conversation.id === currentConversation?.id) {
                      request.put(
                        `/chatting/conversation/notification/${conversation.id}?read_message_at=${newMessage.id}`
                      );

                      return {
                        ...conversation,
                        messages: [newMessage, ...conversation.messages],
                        last_message_id: newMessage.id,
                        last_active_time: newMessage.created_at,
                        unread_message: 0,
                      };
                    }

                    return {
                      ...conversation,
                      messages: [newMessage, ...conversation.messages],
                      last_message_id: newMessage.id,
                      last_active_time: newMessage.created_at,
                      unread_message: data.payload.unread_message,
                    };
                  }
                  return conversation;
                }
              );
              setConversationList(updatedConversationList);
            }

            // 如果当前正在查看这个会话，也更新当前会话
            if (
              !isNewConversation &&
              currentConversation?.id === newMessage.conversation_id
            ) {
              setCurrentConversation({
                ...currentConversation,
                messages: [newMessage, ...currentConversation.messages],
                last_message_id: newMessage.id,
                last_active_time: newMessage.created_at,
              });

              // 只有当用户在底部时才自动滚动到底部
              if (isAtBottom && container) {
                requestAnimationFrame(() => {
                  container.scrollTop = container.scrollHeight;
                });
              }
            }
          }
        } catch (error) {
          console.error("处理WebSocket消息时出错:", error);
        }
      })();
    }
  }, [lastMessage, setConversationList, setCurrentConversation]);

  return {
    sendMessage,
    readyState,
    messagesContainerRef,
  };
}
