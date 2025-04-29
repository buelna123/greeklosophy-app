// src/hooks/useExamResponses.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
/**
 * Hook para traer respuestas de un curso específico.
 */
export function useExamResponses(courseId) {
    return useQuery({
        queryKey: ["examResponses", courseId],
        queryFn: async () => {
            const res = await api.get(`/course-exams/${courseId}/results`);
            return res.data.data;
        },
        enabled: !!courseId, // Solo corre si hay courseId válido
        staleTime: 5 * 60 * 1000, // 5 minutos
        refetchOnWindowFocus: false,
    });
}
