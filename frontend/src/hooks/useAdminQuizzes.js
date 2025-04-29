// src/hooks/useAdminQuizzes.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
export function useAdminQuizzes(courseId) {
    return useQuery({
        queryKey: ["adminQuizzes", courseId],
        enabled: !!courseId, // solo se ejecuta si hay courseId válido
        queryFn: async () => {
            const res = await api.get(`/courses/${courseId}/quizzes`);
            return res.data?.quizzes ?? []; // fallback seguro
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
}
