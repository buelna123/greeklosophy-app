// src/hooks/useAdminQuizzes.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/api";

export interface QuizOption {
  id: number;
  option_text: string;
  is_correct: boolean;
}

export interface QuizQuestion {
  id: number;
  question_text: string;
  points: number;
  quizOptions: QuizOption[];
}

export interface QuizGroup {
  topic_id: number;
  topic_title: string;
  submitted: boolean;
  total_score: number | null;
  quizQuestions: QuizQuestion[];
}

export function useAdminQuizzes(courseId?: number) {
  return useQuery<QuizGroup[]>({
    queryKey: ["adminQuizzes", courseId],
    enabled: !!courseId, // solo se ejecuta si hay courseId válido
    queryFn: async () => {
      const res = await api.get<{ quizzes?: QuizGroup[] }>(`/courses/${courseId}/quizzes`);
      return res.data?.quizzes ?? []; // fallback seguro
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
