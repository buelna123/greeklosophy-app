// src/hooks/useCourseData.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/api";

export interface Badge {
  id: number;
  name: string;
  description: string;
  criteria: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

/**
 * Hook para obtener las medallas asignadas al usuario en un curso.
 * Este sí se mantiene dinámico porque cambia después de completar tareas o exámenes.
 */
export function useBadges(courseId: string) {
  return useQuery<Badge[]>({
    queryKey: ["courseBadges", courseId],
    queryFn: async () => {
      const response = await api.get<Badge[]>(`/courses/${courseId}/badges`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
