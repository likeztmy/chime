import { useQuery } from "@tanstack/react-query";
import { User } from "../types";
import { request } from "@/lib/request";

interface QueryUserListResponse {
  pagination: {
    page_index: number;
    page_size: number;
    total: number;
  };
  user_list: User[];
}

interface UseQueryUserListProps {
  page_index: number;
  page_size: number;
  username: string;
  email: string;
  enabled?: boolean;
}

export const useQueryUserList = ({
  page_index,
  page_size,
  username,
  email,
  enabled = true,
}: UseQueryUserListProps) => {
  const query = useQuery({
    queryKey: ["query-user-list", page_index, page_size, username, email],
    queryFn: async () => {
      const response = await request.get<QueryUserListResponse>(
        "/user/profiles",
        {
          page_index,
          page_size,
          username,
          email,
        }
      );
      return response;
    },
    enabled,
  });

  return query;
};
