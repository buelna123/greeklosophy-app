// src/hooks/useExamResponses.ts

import { useQuery } from "@tanstack/react-query";
import api from "@/api";

export interface ExamResponse {
  course_id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  score: number;
  passed: boolean;
  created_at: string;
  answers: {
    question_text: string;
    selected_option: string;
    is_correct: boolean;
    correct_option_text?: string;
  }[];
}

/**
 * Hook para traer respuestas de un curso específico.
 */
export function useExamResponses(courseId: number) {
  return useQuery<ExamResponse[]>({
    queryKey: ["examResponses", courseId],
    queryFn: async () => {
      const res = await api.get<{ data: ExamResponse[] }>(`/course-exams/${courseId}/results`);
      return res.data.data;
    },
    enabled: !!courseId, // Solo corre si hay courseId válido
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
}
