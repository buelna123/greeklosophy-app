// src/hooks/useAdminExams.ts

import { useQuery } from "@tanstack/react-query";
import api from "@/api";

export interface ExamOption {
  id: number;
  option_text: string;
  is_correct: boolean;
}

export interface ExamQuestion {
  id: number;
  question_text: string;
  points: number;
  examOptions: ExamOption[];
}

export interface AdminExam {
  id: number;
  course_id: number;
  title: string;
  description: string;
  examQuestions: ExamQuestion[];
  course: {
    id: number;
    title: string;
  };
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  total: number;
  last_page: number;
}

export function useAdminExams(courseId?: number) {
  return useQuery<AdminExam[]>({
    queryKey: ["adminExams", courseId],
    queryFn: async () => {
      const query = courseId ? `?course_id=${courseId}` : "";
      const res = await api.get<PaginatedResponse<AdminExam>>(`/admin/exams${query}`);
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
