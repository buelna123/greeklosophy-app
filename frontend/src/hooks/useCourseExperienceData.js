// src/hooks/useCourseExperienceData.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
export function useCourseExperienceData(courseId) {
    return useQuery({
        queryKey: ["courseExperienceData", courseId],
        queryFn: async () => {
            const [courseRes, topicsRes, assignmentsRes, examRes, quizzesRes, progressRes,] = await Promise.all([
                api.get(`/courses/${courseId}`),
                api.get(`/courses/${courseId}/topics`),
                api.get(`/courses/${courseId}/assignments`),
                api.get(`/courses/${courseId}/exam`),
                api.get(`/courses/${courseId}/quizzes`),
                api.get(`/courses/${courseId}/progress`),
            ]);
            const course = courseRes.data;
            const topics = topicsRes.data;
            const assignments = assignmentsRes.data.slice(0, 1); // solo una tarea por curso
            const quizzes = quizzesRes.data.quizzes || [];
            const quizQuestions = [];
            const quizProgressByTopic = {};
            const quizScoresByTopic = {};
            let quizSubmitted = true;
            let totalQuizzes = 0;
            let completedQuizzes = 0;
            quizzes.forEach((quizBlock) => {
                const topicId = quizBlock.topic_id;
                const isSubmitted = quizBlock.submitted;
                quizProgressByTopic[topicId] = isSubmitted;
                if (!isSubmitted)
                    quizSubmitted = false;
                totalQuizzes++;
                if (isSubmitted)
                    completedQuizzes++;
                if (quizBlock.total_score !== undefined && quizBlock.total_score !== null) {
                    quizScoresByTopic[topicId] = quizBlock.total_score;
                }
                (quizBlock.quizQuestions || []).forEach((q) => {
                    quizQuestions.push({
                        ...q,
                        topic_id: topicId,
                        quizOptions: q.quizOptions || q.quiz_options || [],
                    });
                });
            });
            let assignmentSubmitted = false;
            if (assignments.length > 0) {
                try {
                    const assignmentId = assignments[0].id;
                    const res = await api.get(`/courses/${courseId}/assignments/${assignmentId}/submission-status`);
                    assignmentSubmitted = res.data.submitted;
                }
                catch {
                    console.warn("No se pudo verificar estado de entrega de la tarea.");
                }
            }
            const examData = examRes.data.exam;
            const formattedExam = {
                ...examData,
                examQuestions: examData.exam_questions.map((q) => ({
                    ...q,
                    examOptions: q.exam_options,
                })),
            };
            const examSubmitted = examRes.data.submitted ?? false;
            const examScore = examRes.data.score ?? null;
            const examPassed = examRes.data.passed ?? null;
            const examUnlocked = quizSubmitted && assignmentSubmitted;
            let progressPercent = 0;
            try {
                progressPercent = progressRes.data?.progress || 0;
            }
            catch {
                console.warn("Fallo al obtener progreso global del curso.");
            }
            return {
                course,
                topics,
                assignments,
                exam: formattedExam,
                quizQuestions,
                quizSubmitted,
                assignmentSubmitted,
                quizProgressByTopic,
                quizScoresByTopic,
                examSubmitted,
                examScore,
                examPassed,
                examUnlocked,
                progressPercent,
                totalQuizzes,
                completedQuizzes,
                quizCompletionRatio: totalQuizzes > 0 ? completedQuizzes / totalQuizzes : 0,
            };
        },
        staleTime: 0,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
    });
}
