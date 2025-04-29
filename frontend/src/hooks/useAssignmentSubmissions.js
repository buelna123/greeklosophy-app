// src/hooks/useAssignmentSubmissions.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
export function useAssignmentSubmissions(assignmentId) {
    return useQuery({
        queryKey: ["assignmentSubmissions", assignmentId],
        queryFn: async () => {
            const res = await api.get(`/admin/assignments/${assignmentId}/submissions`);
            return res.data.submissions;
        },
        enabled: !!assignmentId,
        staleTime: 0,
        refetchOnWindowFocus: true,
    });
}
