import { useQuery } from "@tanstack/react-query";
import api from "@/api";
export function useAdminAssignments(courseId) {
    return useQuery({
        queryKey: ["adminAssignments", courseId],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (courseId)
                params.append("course_id", courseId.toString());
            const response = await api.get(`/admin/assignments${params.toString() ? `?${params}` : ""}`);
            return response.data.data;
        },
        staleTime: 0,
        refetchOnWindowFocus: true,
    });
}
