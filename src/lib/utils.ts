import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, fromUnixTime } from "date-fns";
import { zhCN } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 添加格式化时间的工具函数
export function formatUnixTime(timestamp: number) {
  const date = fromUnixTime(timestamp);
  return format(date, "MM-dd HH:mm", { locale: zhCN });
}
