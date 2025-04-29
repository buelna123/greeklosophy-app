import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/components/course/ExamComponent.tsx
import { useEffect, useState, useRef } from "react";
import { Container, Form, Button, Alert, Spinner, Row, Col, } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import api from "@/api";
import { useCourseContext } from "@/context/CourseContext";
import "@/styles/CourseExperience.css";
import { FaCheckCircle } from "react-icons/fa";
const localCompletedExam = {};
const examSubmitting = {};
const ExamComponent = () => {
    const { id: courseId } = useParams();
    const { exam, quizSubmitted, assignmentSubmitted } = useCourseContext();
    const queryClient = useQueryClient();
    const containerRef = useRef(null);
    const [responses, setResponses] = useState({});
    const [submitError, setSubmitError] = useState("");
    const [buttonPending, setButtonPending] = useState(false);
    const topicKey = `exam-${courseId}`;
    const isLocallyCompleted = localCompletedExam[topicKey] ?? false;
    const isBeingSent = examSubmitting[topicKey] ?? false;
    const { data: submissionStatus, isLoading: statusLoading, refetch: refetchSubmissionStatus, } = useQuery({
        queryKey: ["examSubmissionStatus", courseId],
        queryFn: async () => {
            const res = await api.get(`/courses/${courseId}/exam/submission-status`);
            return res.data;
        },
        enabled: !!courseId,
        staleTime: 0,
        refetchOnWindowFocus: true,
    });
    const finalScore = submissionStatus?.score ?? null;
    const passed = submissionStatus?.passed ?? false;
    const isSubmitted = submissionStatus?.submitted || isLocallyCompleted;
    const shouldShowFinalMessage = isSubmitted;
    const shouldShowSpinner = isBeingSent;
    useEffect(() => {
        setResponses({});
        setSubmitError("");
        setButtonPending(false);
    }, [courseId]);
    const handleOptionChange = (questionId, optionId) => {
        if (shouldShowFinalMessage || shouldShowSpinner)
            return;
        setResponses((prev) => ({ ...prev, [questionId]: optionId }));
    };
    const mutation = useMutation({
        mutationFn: async (payload) => {
            examSubmitting[topicKey] = true;
            setButtonPending(true);
            const res = await api.post(`/courses/${courseId}/exam/submit`, payload, { headers: { "Content-Type": "application/json" } });
            return res.data;
        },
        onSuccess: async () => {
            localCompletedExam[topicKey] = true;
            examSubmitting[topicKey] = false;
            setButtonPending(false);
            await Promise.all([
                queryClient.invalidateQueries(["examSubmissionStatus", courseId]),
                queryClient.invalidateQueries(["courseExperienceData", courseId]),
                queryClient.invalidateQueries(["allCourseExamResponses"]), // ✅ Muy importante para AdminExams
            ]);
            await refetchSubmissionStatus(); // 🔥 Para actualizar score y passed en tiempo real
        },
        onError: async (err) => {
            examSubmitting[topicKey] = false;
            setButtonPending(false);
            if (err.response?.status === 422) {
                localCompletedExam[topicKey] = true;
                await queryClient.invalidateQueries(["examSubmissionStatus", courseId]);
            }
            setSubmitError(err.response?.data?.error || "Error al enviar el examen.");
        },
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (shouldShowFinalMessage || shouldShowSpinner || buttonPending)
            return;
        if (!exam || !exam.examQuestions)
            return;
        for (const question of exam.examQuestions) {
            if (responses[question.id] === undefined) {
                setSubmitError(`Por favor, responde la pregunta "${question.question_text}".`);
                return;
            }
        }
        setSubmitError("");
        const payload = {
            responses: Object.entries(responses).map(([questionId, selected_option_id]) => ({
                question_id: Number(questionId),
                selected_option_id,
            })),
        };
        mutation.mutate(payload);
    };
    if (!quizSubmitted || !assignmentSubmitted) {
        return (_jsx(Container, { className: "course-experience-container text-center my-5", children: _jsxs(Alert, { variant: "warning", children: ["Debes completar el ", _jsx("strong", { children: "Quiz" }), " y la ", _jsx("strong", { children: "Tarea" }), " antes de hacer el examen."] }) }));
    }
    if (!exam || !exam.examQuestions) {
        return (_jsx(Container, { className: "course-experience-container text-center my-5", children: _jsx(Alert, { variant: "warning", children: "No se encontr\u00F3 examen para este curso." }) }));
    }
    return (_jsxs(Container, { className: "course-experience-container", ref: containerRef, children: [_jsx(motion.h2, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.8 }, className: "mb-4", children: exam.title }), _jsx(motion.p, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.8, delay: 0.2 }, children: exam.description }), statusLoading || shouldShowSpinner ? (_jsx("div", { className: "text-center my-5", children: _jsx(Spinner, { animation: "border", variant: "primary" }) })) : shouldShowFinalMessage ? (_jsxs(Alert, { variant: "success", className: "d-flex align-items-center gap-2", children: [_jsx(FaCheckCircle, {}), "Examen enviado. Puntos obtenidos: ", _jsx("strong", { children: finalScore }), passed ? " ✔️ Aprobado" : " ❌ No aprobado"] })) : (_jsxs(Form, { onSubmit: handleSubmit, children: [exam.examQuestions.map((question) => (_jsxs("div", { className: "mb-4", children: [_jsxs(motion.h5, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5 }, children: [question.question_text, " (Puntos: ", question.points, ")"] }), _jsx(Row, { children: question.examOptions.map((option) => (_jsx(Col, { md: 6, className: "mb-2", children: _jsx(Form.Check, { type: "radio", name: `question-${question.id}`, id: `option-${option.id}`, label: option.option_text, value: option.id, checked: responses[question.id] === option.id, onChange: () => handleOptionChange(question.id, option.id), disabled: shouldShowFinalMessage || shouldShowSpinner }) }, option.id))) })] }, question.id))), submitError && _jsx(Alert, { variant: "danger", children: submitError }), _jsx(Button, { variant: "primary", type: "submit", disabled: shouldShowFinalMessage || shouldShowSpinner || buttonPending, className: "btn-primary", children: buttonPending ? (_jsxs(_Fragment, { children: [_jsx(Spinner, { as: "span", animation: "border", size: "sm", role: "status", "aria-hidden": "true", className: "me-2" }), "Enviando..."] })) : ("Enviar Examen") })] }))] }));
};
export default ExamComponent;
