import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Container, Row, Col, Nav, Spinner, Alert, OverlayTrigger, Tooltip, } from "react-bootstrap";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CallToAction } from "@/components/CallToAction";
import { Outlet, useParams, useLocation, NavLink } from "react-router-dom";
import "@/styles/CourseExperience.css";
import { useCourseExperienceData } from "@/hooks/useCourseExperienceData";
import { CourseContext } from "@/context/CourseContext";
import { FaCheckCircle, FaBookOpen, FaPen, FaCircle, } from "react-icons/fa";
const CourseExperience = () => {
    const { id } = useParams();
    const courseId = id;
    const basePath = `/course-experience/${courseId}`;
    const location = useLocation();
    const { data, isLoading, error } = useCourseExperienceData(courseId);
    if (isLoading) {
        return (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsx(Container, { className: "course-experience-container text-center my-5", children: _jsx(Spinner, { animation: "border", variant: "primary" }) }), _jsx(Footer, {})] }));
    }
    if (error || !data) {
        return (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsx(Container, { className: "course-experience-container", children: _jsx(Alert, { variant: "danger", children: error?.message || "Error al cargar los datos del curso." }) }), _jsx(Footer, {})] }));
    }
    const { course, topics, assignments, quizProgressByTopic, examUnlocked, progressPercent, totalQuizzes, completedQuizzes, } = data;
    const assignmentId = assignments.length > 0 ? assignments[0].id : null;
    const assignmentsLink = assignmentId
        ? `${basePath}/assignments/${assignmentId}`
        : `${basePath}/assignments`;
    const isActivePath = (targetPath) => typeof targetPath === "string"
        ? location.pathname === targetPath
        : targetPath.test(location.pathname);
    const isQuizRoute = location.pathname.includes("/quiz");
    return (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsx(CourseContext.Provider, { value: data, children: _jsxs(Container, { className: "course-experience-container", children: [_jsx("h1", { children: course.title }), _jsxs("p", { className: "text-muted mb-3", children: ["Avance actual: ", _jsxs("strong", { children: [Math.round(progressPercent), "%"] }), " ", totalQuizzes !== undefined && completedQuizzes !== undefined && (_jsxs("span", { className: "text-muted small", children: ["(", completedQuizzes, "/", totalQuizzes, " quizzes completados)"] }))] }), _jsxs(Row, { className: "mt-4", children: [_jsx(Col, { md: 3, children: _jsxs(Nav, { variant: "pills", className: "flex-column sidebar-nav", children: [_jsx(Nav.Item, { children: _jsxs(Nav.Link, { as: NavLink, to: `${basePath}/topics`, className: !isQuizRoute &&
                                                        isActivePath(new RegExp(`^${basePath}/topics(?:/\\d+)?$`))
                                                        ? "custom-nav-link active"
                                                        : "custom-nav-link", children: [_jsx(FaBookOpen, { className: "me-2" }), "Temas"] }) }), _jsxs(Nav.Item, { className: "mt-3 mb-1 text-muted", style: { fontSize: "0.9rem", fontWeight: 500 }, children: [_jsx(FaPen, { className: "me-2" }), "Quizzes"] }), topics.map((topic) => (_jsx(Nav.Item, { children: _jsx(OverlayTrigger, { placement: "right", overlay: _jsx(Tooltip, { id: `tooltip-quiz-${topic.id}`, children: topic.title }), children: _jsxs(Nav.Link, { as: NavLink, to: `${basePath}/topics/${topic.id}/quiz`, className: location.pathname === `${basePath}/topics/${topic.id}/quiz`
                                                            ? "quiz-subitem active d-flex justify-content-between align-items-center"
                                                            : "quiz-subitem d-flex justify-content-between align-items-center", children: [_jsx("span", { className: "text-truncate", style: { maxWidth: "75%" }, children: topic.title }), quizProgressByTopic[topic.id] ? (_jsx(FaCheckCircle, { size: 16, color: "green" })) : (_jsx(FaCircle, { size: 10, color: "#ccc" }))] }) }) }, topic.id))), assignmentId && (_jsx(Nav.Item, { className: "mt-3", children: _jsx(Nav.Link, { as: NavLink, to: assignmentsLink, className: !isQuizRoute &&
                                                        isActivePath(new RegExp(`^${basePath}/assignments(?:/\\d+)?$`))
                                                        ? "custom-nav-link active"
                                                        : "custom-nav-link", children: "Tareas" }) })), _jsx(Nav.Item, { children: _jsx(OverlayTrigger, { placement: "right", overlay: !examUnlocked ? (_jsx(Tooltip, { id: "tooltip-exam-disabled", children: "Debes completar Quiz y Tarea" })) : _jsx(_Fragment, {}), children: _jsx("div", { children: _jsx(Nav.Link, { as: NavLink, to: `${basePath}/exam`, disabled: !examUnlocked, className: examUnlocked && isActivePath(`${basePath}/exam`)
                                                                ? "custom-nav-link active"
                                                                : "custom-nav-link", style: !examUnlocked ? { pointerEvents: "none", opacity: 0.5 } : {}, children: "Examen" }) }) }) }), _jsx(Nav.Item, { children: _jsx(Nav.Link, { as: NavLink, to: `${basePath}/progress`, className: isActivePath(`${basePath}/progress`)
                                                        ? "custom-nav-link active"
                                                        : "custom-nav-link", children: "Progreso" }) }), _jsx(Nav.Item, { children: _jsx(Nav.Link, { as: NavLink, to: `${basePath}/badges`, className: isActivePath(`${basePath}/badges`)
                                                        ? "custom-nav-link active"
                                                        : "custom-nav-link", children: "Medallas" }) })] }) }), _jsx(Col, { md: 9, children: _jsx("div", { className: "content-area uniform-card", children: _jsx(Outlet, {}) }) })] })] }) }), _jsx(CallToAction, {}), _jsx(Footer, {})] }));
};
export default CourseExperience;
