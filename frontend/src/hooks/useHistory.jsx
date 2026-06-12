import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clearAIHistory, deleteAIHistory, getAIHistory } from "../util/auth";
import toast from "react-hot-toast";

export const useAIHistory = () => {
  return useQuery({
    queryKey: ["ai-history"],
    queryFn: getAIHistory,
  });
};
export const useClearAI = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearAIHistory,
    onSuccess: () => {
      queryClient.invalidateQueries(["ai-history"]);
      toast.success("history clear successfully");
    },
  });
};
export const useDeleteAI = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAIHistory,
    onSuccess: () => {
      queryClient.invalidateQueries(["ai-history"]);
      toast.success("history deleted  successfully");
    },
  });
};
