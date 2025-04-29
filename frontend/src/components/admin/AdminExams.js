import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/admin/AdminExams.tsx
import { useState } from "react";
import { Container, Card, Button, Collapse, Spinner, ListGroup, OverlayTrigger, Tooltip, } from "react-bootstrap";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaBell, FaBellSlash } from "react-icons/fa";
import ExamModal from "./modals/ExamModal";
import ExamResponsesModal from "./modals/ExamResponsesModal";
import api from "@/api";
import "../../styles/admin.css";
const AdminExams = () => {
    const queryClient = useQueryClient();
    const [expandedExamId, setExpandedExamId] = useState(null);
    const [selectedExam, setSelectedExam] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showResponsesModal, setShowResponsesModal] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const { data: exams, isLoading } = useQuery({
        queryKey: ["adminExams"],
        queryFn: async () => {
            const res = await api.get("/admin/exams");
            return res.data.data.map((exam) => ({
                ...exam,
                examQuestions: exam.exam_questions?.map((q) => ({
                    id: q.id,
                    question_text: q.question_text,
                    points: q.points,
                    examOptions: q.exam_options?.map((opt) => ({
                        id: opt.id,
                        option_text: opt.option_text,
                        is_correct: !!opt.is_correct,
                    })),
                })),
            }));
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
    const { data: allResponses, isLoading: loadingResponses } = useQuery({
        queryKey: ["allCourseExamResponses"],
        queryFn: async () => {
            const res = await api.get("/course-exams/results");
            return res.data.data;
        },
        staleTime: 2 * 60 * 1000,
        refetchOnWindowFocus: true,
    });
    const handleToggle = (examId) => {
        setExpandedExamId((prev) => (prev === examId ? null : examId));
    };
    const handleEdit = (exam) => {
        setSelectedExam(exam);
        setShowModal(true);
    };
    const handleShowResponses = (courseId) => {
        setSelectedCourseId(courseId);
        setShowResponsesModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedExam(null);
    };
    const handleCloseResponses = () => {
        setShowResponsesModal(false);
        setSelectedCourseId(null);
    };
    const handleSuccess = (updatedExam) => {
        queryClient.setQueryData(["adminExams"], (prev) => {
            if (!prev)
                return [];
            return prev.map((ex) => ex.course_id === updatedExam.course_id ? updatedExam : ex);
        });
        setShowModal(false);
    };
    const getHasResponses = (courseId) => {
        if (!allResponses)
            return false;
        return allResponses.some((resp) => resp.course_id === courseId);
    };
    return (_jsxs(Container, { className: "admin-container", children: [_jsx("h1", { children: "Gesti\u00F3n de Ex\u00E1menes" }), isLoading ? (_jsx("div", { className: "text-center my-4", children: _jsx(Spinner, { animation: "border" }) })) : (exams?.map((exam) => {
                const hasResponses = getHasResponses(exam.course_id);
                return (_jsxs(Card, { className: "mb-3 shadow-sm", children: [_jsxs(Card.Header, { onClick: () => handleToggle(exam.id), className: "d-flex justify-content-between align-items-center clickable", style: { cursor: "pointer" }, children: [_jsxs("div", { children: [_jsx("strong", { children: "Curso:" }), " ", exam.course?.title || "Sin curso", " ", _jsx("br", {}), _jsx("strong", { children: "T\u00EDtulo:" }), " ", exam.title] }), _jsxs("div", { className: "d-flex align-items-center gap-2", children: [_jsx(OverlayTrigger, { placement: "top", overlay: _jsx(Tooltip, { children: hasResponses ? "Hay respuestas nuevas" : "Sin respuestas aún" }), children: _jsx(Button, { variant: hasResponses ? "danger" : "outline-secondary", onClick: (e) => {
                                                    e.stopPropagation();
                                                    handleShowResponses(exam.course_id);
                                                }, children: hasResponses ? (_jsx(FaBell, { color: "white" })) : (_jsx(FaBellSlash, { color: "gray" })) }) }), _jsx(Button, { variant: "outline-primary", onClick: (e) => {
                                                e.stopPropagation();
                                                handleEdit(exam);
                                            }, children: "Editar" })] })] }), _jsx(Collapse, { in: expandedExamId === exam.id, children: _jsxs(Card.Body, { children: [_jsxs("p", { children: [_jsx("strong", { children: "Descripci\u00F3n:" }), " ", exam.description] }), !exam.examQuestions?.length ? (_jsx("p", { className: "text-muted", children: "No hay preguntas asignadas." })) : (_jsx(ListGroup, { children: exam.examQuestions.map((question) => (_jsxs(ListGroup.Item, { children: [_jsx("strong", { children: question.question_text }), " (", question.points, " pts)", _jsx("ul", { className: "mb-0", children: question.examOptions?.length ? (question.examOptions.map((opt) => (_jsxs("li", { children: [opt.option_text, " ", opt.is_correct ? "✔️" : ""] }, `option-${opt.id}`)))) : (_jsx("li", { className: "text-muted", children: "Sin opciones disponibles" })) })] }, `question-${question.id}`))) }))] }) })] }, exam.id));
            })), selectedExam && (_jsx(ExamModal, { show: showModal, onHide: handleCloseModal, onSuccess: handleSuccess, initialData: selectedExam })), showResponsesModal && selectedCourseId !== null && (_jsx(ExamResponsesModal, { show: showResponsesModal, onHide: handleCloseResponses, courseId: selectedCourseId }))] }));
};
export default AdminExams;
