import { request } from "@/lib/request";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetVerificationCode = () => {
  const mutation = useMutation({
    mutationFn: (data: { email: string }) => {
      return request.post("/user/email", data);
    },
    onSuccess: () => {
      toast.success("Verification code sent!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
