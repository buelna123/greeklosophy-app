// src/hooks/useAllExamResponses.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
export function useAllExamResponses() {
    return useQuery({
        queryKey: ["examResponses"],
        queryFn: async () => {
            const res = await api.get("/course-exams/results");
            return res.data.data;
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
}
