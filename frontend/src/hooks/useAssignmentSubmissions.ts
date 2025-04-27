// src/hooks/useAssignmentSubmissions.ts

import { useQuery } from "@tanstack/react-query";
import api from "@/api";

export interface Submission {
  id: number;
  assignment_id: number;
  user_id: number;
  content: string;
  grade?: number | null;
  review_comment?: string | null;
  submitted_at: string;
  graded_at?: string | null;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface SubmissionsResponse {
  submissions: Submission[];
}

export function useAssignmentSubmissions(assignmentId: number) {
  return useQuery<Submission[]>({
    queryKey: ["assignmentSubmissions", assignmentId],
    queryFn: async () => {
      const res = await api.get<SubmissionsResponse>(`/admin/assignments/${assignmentId}/submissions`);
      return res.data.submissions;
    },
    enabled: !!assignmentId,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}
