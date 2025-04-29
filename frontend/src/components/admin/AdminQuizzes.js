import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/admin/AdminQuizzes.tsx
import { useState, useEffect } from "react";
import { Container, Card, Button, Collapse, Spinner, ListGroup, Form } from "react-bootstrap";
import { useQueryClient } from "@tanstack/react-query";
import Select from "react-select";
import { useCoursesQuery } from "@/hooks/useCourses";
import { useAdminQuizzes } from "@/hooks/useAdminQuizzes";
import QuizModal from "./modals/QuizModal";
import { useSearchParams } from "react-router-dom";
import "../../styles/admin.css";
const AdminQuizzes = () => {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const initialCourseId = searchParams.get("course");
    const initialCourseTitle = searchParams.get("title");
    const [selectedCourse, setSelectedCourse] = useState(initialCourseId && initialCourseTitle
        ? { value: parseInt(initialCourseId), label: initialCourseTitle }
        : null);
    const [expandedTopic, setExpandedTopic] = useState(null);
    const [selectedTopicId, setSelectedTopicId] = useState(null);
    const [selectedQuizQuestions, setSelectedQuizQuestions] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { data: courseList, isLoading: loadingCourses } = useCoursesQuery();
    const courseOptions = courseList?.map(c => ({ value: c.id, label: c.title })) || [];
    const { data: quizzesData = [], isLoading: loadingQuizzes, isError } = useAdminQuizzes(selectedCourse?.value);
    useEffect(() => {
        if (!selectedCourse && initialCourseId && courseList) {
            const match = courseList.find(c => c.id === parseInt(initialCourseId));
            if (match) {
                setSelectedCourse({ value: match.id, label: match.title });
            }
        }
    }, [courseList]);
    const toggleTopic = (id) => {
        setExpandedTopic(prev => (prev === id ? null : id));
    };
    const handleEdit = (topicId) => {
        const quizGroup = quizzesData.find(q => q.topic_id === topicId);
        if (quizGroup) {
            setSelectedTopicId(topicId);
            setSelectedQuizQuestions(quizGroup.quizQuestions);
            setShowModal(true);
        }
    };
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTopicId(null);
        setSelectedQuizQuestions(null);
    };
    return (_jsxs(Container, { className: "admin-container", children: [_jsx("h1", { children: "Gesti\u00F3n de Quizzes" }), _jsxs(Form.Group, { className: "mb-3", style: { maxWidth: 400 }, children: [_jsx(Form.Label, { children: "Seleccionar curso" }), loadingCourses ? (_jsx(Spinner, { animation: "border" })) : (_jsx(Select, { value: selectedCourse, options: courseOptions, onChange: (opt) => setSelectedCourse(opt), placeholder: "Elige un curso..." }))] }), !selectedCourse ? (_jsx("div", { className: "text-muted", children: "Selecciona un curso para ver los quizzes." })) : loadingQuizzes ? (_jsx("div", { className: "text-center my-5", children: _jsx(Spinner, { animation: "border" }) })) : isError ? (_jsx("div", { className: "text-danger", children: "Error al cargar quizzes del curso." })) : quizzesData.length === 0 ? (_jsx("div", { className: "text-muted", children: "No hay quizzes disponibles para este curso." })) : (quizzesData.map(group => (_jsxs(Card, { className: "mb-3 shadow-sm", children: [_jsxs(Card.Header, { onClick: () => toggleTopic(group.topic_id), className: "d-flex justify-content-between align-items-center clickable", style: { cursor: "pointer" }, children: [_jsxs("span", { className: "fw-bold", children: ["Tema: ", group.topic_title] }), _jsx(Button, { variant: "outline-primary", onClick: (e) => {
                                    e.stopPropagation();
                                    handleEdit(group.topic_id);
                                }, children: "Editar" })] }), _jsx(Collapse, { in: expandedTopic === group.topic_id, children: _jsx(Card.Body, { children: group.quizQuestions.length === 0 ? (_jsx("p", { className: "text-muted", children: "No hay preguntas asignadas." })) : (_jsx(ListGroup, { children: group.quizQuestions.map((question) => (_jsxs(ListGroup.Item, { children: [_jsx("strong", { children: question.question_text }), " (", question.points, " pts)", _jsx("ul", { children: question.quizOptions.map((opt) => (_jsxs("li", { children: [opt.option_text, " ", opt.is_correct ? "✔️" : ""] }, opt.id))) })] }, question.id))) })) }) })] }, group.topic_id)))), selectedTopicId !== null && selectedQuizQuestions !== null && (_jsx(QuizModal, { topicId: selectedTopicId, initialQuestions: selectedQuizQuestions, show: showModal, onHide: handleCloseModal, onSuccess: () => {
                    if (selectedCourse?.value) {
                        queryClient.invalidateQueries(["adminQuizzes", selectedCourse.value]);
                    }
                } }))] }));
};
export default AdminQuizzes;
