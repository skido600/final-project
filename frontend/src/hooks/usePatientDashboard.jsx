import { useQuery } from "@tanstack/react-query";
import { getPatientHistory, getPatientStats } from "../util/auth";

export function usePatientDashboard() {
  const historyQuery = useQuery({
    queryKey: ["patient-history"],
    queryFn: getPatientHistory,
  });

  const statsQuery = useQuery({
    queryKey: ["patient-stats"],
    queryFn: getPatientStats,
  });

  const history = historyQuery.data?.data || [];
  const stats = statsQuery.data?.data;

  return {
    history,
    stats,

    // loading states
    historyLoading: historyQuery.isLoading,
    statsLoading: statsQuery.isLoading,

    // optional for UI handling
    isError: historyQuery.isError || statsQuery.isError,
  };
}
