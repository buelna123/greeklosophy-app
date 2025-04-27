// src/hooks/useAssignmentReviews.ts

import { useQuery } from "@tanstack/react-query";
import api from "@/api";

export interface AssignmentReview {
  id: number;
  assignment_id: number;
  assignment_title: string;
  user_id: number;
  user_name: string;
  file_path: string;
  submitted_at: string;
  grade: number | null;
  review_comment: string | null;
}

interface AssignmentReviewResponse {
  submissions: AssignmentReview[];
}

export function useAssignmentReviews(assignmentId: number) {
  return useQuery<AssignmentReview[]>({
    queryKey: ["assignmentReviews", assignmentId],
    queryFn: async () => {
      const res = await api.get<AssignmentReviewResponse>(`/admin/assignments/${assignmentId}/submissions`);
      return res.data.submissions;
    },
    enabled: !!assignmentId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
