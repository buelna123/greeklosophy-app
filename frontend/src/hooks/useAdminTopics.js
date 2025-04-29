// src/hooks/useAdminTopics.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
export function useAdminTopics(courseId) {
    return useQuery({
        queryKey: ["adminTopics", courseId],
        queryFn: async () => {
            const query = courseId ? `?course_id=${courseId}` : "";
            const res = await api.get(`/admin/topics${query}`);
            return res.data.data;
        },
        staleTime: 0,
        refetchOnWindowFocus: true,
    });
}
