// src/hooks/useAssignmentReviews.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
export function useAssignmentReviews(assignmentId) {
    return useQuery({
        queryKey: ["assignmentReviews", assignmentId],
        queryFn: async () => {
            const res = await api.get(`/admin/assignments/${assignmentId}/submissions`);
            return res.data.submissions;
        },
        enabled: !!assignmentId,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
}
