// src/hooks/useQuizByTopic.ts
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

export interface QuizResponse {
  quizQuestions: QuizQuestion[];
  submitted: boolean;
  total_score: number | null;
}

export function useQuizByTopic(courseId?: number, topicId?: number) {
  return useQuery<QuizResponse>({
    queryKey: ["quizByTopic", courseId, topicId],
    enabled: !!courseId && !!topicId,
    queryFn: async () => {
      const res = await api.get<QuizResponse>(`/courses/${courseId}/topics/${topicId}/quiz`);
      return res.data;
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false
  });
}
