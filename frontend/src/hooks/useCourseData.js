// src/hooks/useCourseData.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
/**
 * Hook para obtener las medallas asignadas al usuario en un curso.
 * Este sí se mantiene dinámico porque cambia después de completar tareas o exámenes.
 */
export function useBadges(courseId) {
    return useQuery({
        queryKey: ["courseBadges", courseId],
        queryFn: async () => {
            const response = await api.get(`/courses/${courseId}/badges`);
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
}
