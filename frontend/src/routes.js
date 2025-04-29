import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
const AppRoutes = () => {
    const { user, isAdmin } = useAuth();
    const { appReady } = useAppStatus();
    if (!appReady) {
        return _jsx(Loader, { ready: false });
    }
    return (_jsxs(_Fragment, { children: [_jsx(FraseMarquesina, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/courses", element: _jsx(Courses, {}) }), _jsx(Route, { path: "/courses/:id", element: _jsx(CourseDetail, {}) }), _jsx(Route, { path: "/articles", element: _jsx(Blog, {}) }), _jsx(Route, { path: "/articles/:articleId", element: _jsx(ArticleDetail, {}) }), _jsx(Route, { path: "/profile", element: user ? _jsx(Profile, {}) : _jsx(Navigate, { to: "/" }) }), _jsx(Route, { path: "/dashboard", element: isAdmin() ? _jsx(Dashboard, {}) : _jsx(Navigate, { to: "/" }) }), _jsxs(Route, { path: "/admin/*", element: isAdmin() ? _jsx(AdminPanel, {}) : _jsx(Navigate, { to: "/" }), children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "dashboard", replace: true }) }), _jsx(Route, { path: "dashboard", element: _jsx(AdminDashboard, {}) }), _jsx(Route, { path: "courses", element: _jsx(AdminCourses, {}) }), _jsx(Route, { path: "articles", element: _jsx(AdminArticles, {}) }), _jsx(Route, { path: "topics", element: _jsx(AdminTopics, {}) }), _jsx(Route, { path: "assignments", element: _jsx(AdminAssignments, {}) }), _jsx(Route, { path: "reviews", element: _jsx(AdminAssignmentReview, {}) }), _jsx(Route, { path: "quizzes", element: _jsx(AdminQuizzes, {}) }), _jsx(Route, { path: "exams", element: _jsx(AdminExams, {}) })] }), _jsxs(Route, { path: "/course-experience/:id/*", element: _jsx(CourseExperience, {}), children: [_jsx(Route, { path: "topics", element: _jsx(TopicList, {}) }), _jsx(Route, { path: "topics/:topicId", element: _jsx(TopicDetail, {}) }), _jsx(Route, { path: "topics/:topicId/quiz", element: _jsx(QuizForm, {}) }), _jsx(Route, { path: "assignments/:assignment", element: _jsx(AssignmentSubmission, {}) }), _jsx(Route, { path: "exam", element: _jsx(ExamComponent, {}) }), _jsx(Route, { path: "progress", element: _jsx(ProgressDisplay, {}) }), _jsx(Route, { path: "badges", element: _jsx(BadgeList, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "topics", replace: true }) })] }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] })] }));
};
export default AppRoutes;
