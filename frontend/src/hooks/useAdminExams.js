// src/hooks/useAdminExams.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
export function useAdminExams(courseId) {
    return useQuery({
        queryKey: ["adminExams", courseId],
        queryFn: async () => {
            const query = courseId ? `?course_id=${courseId}` : "";
            const res = await api.get(`/admin/exams${query}`);
            return res.data.data;
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
}
