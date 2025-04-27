import { createContext, useContext } from "react";
import {
  CourseDetail,
  Topic,
  Assignment,
  Exam,
  QuizQuestion,
} from "@/hooks/useCourseExperienceData";

interface CourseContextType {
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

export const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourseContext = (): CourseContextType => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourseContext debe usarse dentro de <CourseContext.Provider>");
  }
  return context;
};
