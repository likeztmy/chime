export type Message = {
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
};

export type Conversation = {
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
};
