// src/hooks/useQuizByTopic.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
export function useQuizByTopic(courseId, topicId) {
    return useQuery({
        queryKey: ["quizByTopic", courseId, topicId],
        enabled: !!courseId && !!topicId,
        queryFn: async () => {
            const res = await api.get(`/courses/${courseId}/topics/${topicId}/quiz`);
            return res.data;
        },
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: false
    });
}
