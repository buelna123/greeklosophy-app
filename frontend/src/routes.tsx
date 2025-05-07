import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useAppStatus } from "@/hooks/useAppStatus";
import { Loader } from "@/components/Loader";
import { FraseMarquesina } from "@/components/FraseMarquesina";

import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import Blog from "@/pages/Blog";
import ArticleDetail from "@/pages/ArticleDetail";
import Profile from "@/pages/Profile";
import AdminPanel from "@/pages/AdminPanel";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminCourses from "@/components/admin/AdminCourses";
import AdminArticles from "@/components/admin/AdminArticles";
import AdminTopics from "@/components/admin/AdminTopics";
import AdminAssignments from "@/components/admin/AdminAssignments";
import AdminQuizzes from "@/components/admin/AdminQuizzes";
import AdminExams from "@/components/admin/AdminExams";
import AdminAssignmentReview from "@/components/admin/AdminAssignmentReview";

import CourseExperience from "@/pages/CourseExperience";
import TopicList from "@/components/course/TopicList";
import TopicDetail from "@/components/course/TopicDetail";
import QuizForm from "@/components/course/QuizForm";
import AssignmentSubmission from "@/components/course/AssignmentSubmission";
import ExamComponent from "@/components/course/ExamComponent";
import ProgressDisplay from "@/components/course/ProgressDisplay";
import BadgeList from "@/components/course/BadgeList";

import ContactPage from "@/pages/Contact"; // ✅ nuevo import

const AppRoutes = () => {
  const { user, isAdmin } = useAuth();
  const { appReady } = useAppStatus();

  if (!appReady) {
    return <Loader ready={false} />;
  }

  return (
    <>
      <FraseMarquesina />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/articles" element={<Blog />} />
        <Route path="/articles/:articleId" element={<ArticleDetail />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
        <Route path="/dashboard" element={isAdmin() ? <Dashboard /> : <Navigate to="/" />} />

        <Route path="/admin/*" element={isAdmin() ? <AdminPanel /> : <Navigate to="/" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="articles" element={<AdminArticles />} />
          <Route path="topics" element={<AdminTopics />} />
          <Route path="assignments" element={<AdminAssignments />} />
          <Route path="reviews" element={<AdminAssignmentReview />} />
          <Route path="quizzes" element={<AdminQuizzes />} />
          <Route path="exams" element={<AdminExams />} />
        </Route>

        <Route path="/course-experience/:id/*" element={<CourseExperience />}>
          <Route path="topics" element={<TopicList />} />
          <Route path="topics/:topicId" element={<TopicDetail />} />
          <Route path="topics/:topicId/quiz" element={<QuizForm />} />
          <Route path="assignments/:assignment" element={<AssignmentSubmission />} />
          <Route path="exam" element={<ExamComponent />} />
          <Route path="progress" element={<ProgressDisplay />} />
          <Route path="badges" element={<BadgeList />} />
          <Route path="*" element={<Navigate to="topics" replace />} />
        </Route>

        <Route path="/contacto" element={<ContactPage />} /> {/* ✅ nueva ruta */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
