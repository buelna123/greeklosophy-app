// src/hooks/useCourseExperienceData.ts

import { useQuery } from "@tanstack/react-query";
import api from "@/api";

// Tipos
export interface Topic {
  id: number;
  course_id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Assignment {
  id: number;
  course_id: number;
  title: string;
  description: string;
  due_date?: string | null;
}

export interface QuizOption {
  id: number;
  option_text: string;
  is_correct: boolean;
}

export interface QuizQuestion {
  id: number;
  topic_id: number;
  question_text: string;
  points: number;
  quizOptions: QuizOption[];
}

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

export interface Exam {
  id: number;
  title: string;
  description: string;
  examQuestions: ExamQuestion[];
}

export interface CourseDetail {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  created_at: string;
  updated_at?: string;
}

interface CourseExperienceData {
  course: CourseDetail;
  topics: Topic[];
  assignments: Assignment[];
  exam: Exam;
  quizQuestions: QuizQuestion[];
  quizSubmitted: boolean;
  assignmentSubmitted: boolean;
  quizProgressByTopic: Record<number, boolean>;
  quizScoresByTopic: Record<number, number>;
  examSubmitted: boolean;
  examScore?: number;
  examPassed?: boolean;
  examUnlocked: boolean;
  progressPercent: number;
  totalQuizzes?: number;
  completedQuizzes?: number;
  quizCompletionRatio?: number;
}

export function useCourseExperienceData(courseId: string) {
  return useQuery<CourseExperienceData>({
    queryKey: ["courseExperienceData", courseId],
    queryFn: async () => {
      const [
        courseRes,
        topicsRes,
        assignmentsRes,
        examRes,
        quizzesRes,
        progressRes,
      ] = await Promise.all([
        api.get<CourseDetail>(`/courses/${courseId}`),
        api.get<Topic[]>(`/courses/${courseId}/topics`),
        api.get<Assignment[]>(`/courses/${courseId}/assignments`),
        api.get<any>(`/courses/${courseId}/exam`),
        api.get<any>(`/courses/${courseId}/quizzes`),
        api.get<any>(`/courses/${courseId}/progress`),
      ]);

      const course = courseRes.data;
      const topics = topicsRes.data;
      const assignments = assignmentsRes.data.slice(0, 1); // solo una tarea por curso
      const quizzes = quizzesRes.data.quizzes || [];

      const quizQuestions: QuizQuestion[] = [];
      const quizProgressByTopic: Record<number, boolean> = {};
      const quizScoresByTopic: Record<number, number> = {};
      let quizSubmitted = true;
      let totalQuizzes = 0;
      let completedQuizzes = 0;

      quizzes.forEach((quizBlock: any) => {
        const topicId = quizBlock.topic_id;
        const isSubmitted = quizBlock.submitted;

        quizProgressByTopic[topicId] = isSubmitted;
        if (!isSubmitted) quizSubmitted = false;

        totalQuizzes++;
        if (isSubmitted) completedQuizzes++;

        if (quizBlock.total_score !== undefined && quizBlock.total_score !== null) {
          quizScoresByTopic[topicId] = quizBlock.total_score;
        }

        (quizBlock.quizQuestions || []).forEach((q: any) => {
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
          const res = await api.get<{ submitted: boolean }>(
            `/courses/${courseId}/assignments/${assignmentId}/submission-status`
          );
          assignmentSubmitted = res.data.submitted;
        } catch {
          console.warn("No se pudo verificar estado de entrega de la tarea.");
        }
      }

      const examData = examRes.data.exam;
      const formattedExam: Exam = {
        ...examData,
        examQuestions: examData.exam_questions.map((q: any) => ({
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
      } catch {
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
        quizCompletionRatio:
          totalQuizzes > 0 ? completedQuizzes / totalQuizzes : 0,
      };
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
}
