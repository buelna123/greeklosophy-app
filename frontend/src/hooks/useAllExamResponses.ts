// src/hooks/useAllExamResponses.ts

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

export function useAllExamResponses() {
  return useQuery<ExamResponse[]>({
    queryKey: ["examResponses"],
    queryFn: async () => {
      const res = await api.get<{ data: ExamResponse[] }>("/course-exams/results");
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
