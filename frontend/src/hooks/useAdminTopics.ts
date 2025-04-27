// src/hooks/useAdminTopics.ts

import { useQuery } from "@tanstack/react-query";
import api from "@/api";

export interface AdminTopic {
  id: number;
  course_id: number;
  title: string;
  content: string;
  order: number;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  total: number;
  last_page: number;
}

export function useAdminTopics(courseId?: number) {
  return useQuery<AdminTopic[]>({
    queryKey: ["adminTopics", courseId],
    queryFn: async () => {
      const query = courseId ? `?course_id=${courseId}` : "";
      const res = await api.get<PaginatedResponse<AdminTopic>>(`/admin/topics${query}`);
      return res.data.data;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}
