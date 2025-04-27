import { useQuery } from "@tanstack/react-query";
import api from "@/api";

export interface AdminAssignment {
  id: number;
  course_id: number;
  title: string;
  description: string;
  due_date?: string | null;
  created_at: string;
  updated_at: string;
  course_name?: string;
  student_name?: string;
  grade?: number | null;
  status?: "pending" | "submitted" | "reviewed";
}

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  total: number;
  last_page: number;
}

export function useAdminAssignments(courseId?: number) {
  return useQuery<AdminAssignment[]>({
    queryKey: ["adminAssignments", courseId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (courseId) params.append("course_id", courseId.toString());

      const response = await api.get<PaginatedResponse<AdminAssignment>>(
        `/admin/assignments${params.toString() ? `?${params}` : ""}`
      );
      return response.data.data;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}
