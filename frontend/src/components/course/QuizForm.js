import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Container, Form, Button, Alert, Spinner, Row, Col, } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCourseContext } from "@/context/CourseContext";
import api from "@/api";
import "@/styles/CourseExperience.css";
import { FaCheckCircle } from "react-icons/fa";
// Estado local persistente por sesión
const localCompletedTopics = new Set();
const topicsSubmitting = new Set();
const QuizForm = () => {
    const { id: courseId, topicId } = useParams();
    const { topics, quizQuestions, quizProgressByTopic, quizScoresByTopic, } = useCourseContext();
    const queryClient = useQueryClient();
    const containerRef = useRef(null);
    const [responses, setResponses] = useState({});
    const [submitError, setSubmitError] = useState("");
    const [buttonPending, setButtonPending] = useState(false); // ← spinner embebido en botón
    const topic = topics.find((t) => t.id.toString() === topicId);
    const topicIdNumber = Number(topicId);
    const scoreFromBackend = quizScoresByTopic[topicIdNumber] ?? null;
    const isCompletedLocally = localCompletedTopics.has(topicIdNumber);
    const isSending = topicsSubmitting.has(topicIdNumber);
    const shouldShowFinalMessage = scoreFromBackend !== null || isCompletedLocally;
    const shouldShowSpinner = isSending || (scoreFromBackend === null && isCompletedLocally);
    const filteredQuestions = useMemo(() => {
        return quizQuestions.filter((q) => q.topic_id === topicIdNumber);
    }, [quizQuestions, topicIdNumber]);
    useEffect(() => {
        setResponses({});
        setSubmitError("");
        setButtonPending(false);
    }, [topicIdNumber]);
    const handleOptionChange = useCallback((questionId, optionId) => {
        if (shouldShowFinalMessage || shouldShowSpinner)
            return;
        setResponses((prev) => ({ ...prev, [questionId]: optionId }));
    }, [shouldShowFinalMessage, shouldShowSpinner]);
    const mutation = useMutation(async (payload) => {
        topicsSubmitting.add(topicIdNumber);
        setButtonPending(true);
        const res = await api.post(`/courses/${courseId}/topics/${topicId}/quiz/submit`, payload, { headers: { "Content-Type": "application/json" } });
        return res.data;
    }, {
        onSuccess: (data) => {
            localCompletedTopics.add(topicIdNumber);
            topicsSubmitting.delete(topicIdNumber);
            queryClient.invalidateQueries(["courseExperienceData", courseId]);
            queryClient.refetchQueries(["courseExperienceData", courseId]);
            setSubmitError("");
            setResponses({});
            setButtonPending(false);
        },
        onError: (err) => {
            topicsSubmitting.delete(topicIdNumber);
            setButtonPending(false);
            const error = err;
            if (error.response?.data?.error) {
                setSubmitError(error.response.data.error);
            }
            else if (error.message) {
                setSubmitError(error.message);
            }
            else {
                setSubmitError("Error desconocido al enviar el quiz");
            }
        },
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (shouldShowFinalMessage || shouldShowSpinner || buttonPending) {
            return;
        }
        if (filteredQuestions.length === 0) {
            setSubmitError("No hay preguntas en el quiz");
            return;
        }
        for (const question of filteredQuestions) {
            if (responses[question.id] === undefined) {
                setSubmitError(`Por favor, responde la pregunta ${question.id}`);
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
    if (!topic) {
        return (_jsx(Container, { className: "course-experience-container", children: _jsx(Alert, { variant: "danger", children: "Tema no encontrado." }) }));
    }
    return (_jsxs(Container, { className: "course-experience-container", ref: containerRef, children: [_jsxs("h2", { className: "mb-4", children: ["Quiz: ", topic.title] }), shouldShowSpinner ? (_jsx("div", { className: "text-center my-5", children: _jsx(Spinner, { animation: "border", variant: "primary" }) })) : shouldShowFinalMessage ? (_jsxs(Alert, { variant: "success", className: "d-flex align-items-center gap-2", children: [_jsx(FaCheckCircle, {}), "Ha enviado el quiz. Gracias.", scoreFromBackend !== null && (_jsxs("span", { className: "ms-2", children: [_jsx("strong", { children: "Puntuaci\u00F3n:" }), " ", scoreFromBackend, " puntos"] }))] })) : (_jsxs(Form, { onSubmit: handleSubmit, children: [filteredQuestions.map((question) => (_jsxs("div", { className: "mb-4", children: [_jsxs("h5", { children: [question.question_text, " (Puntos: ", question.points, ")"] }), _jsx(Row, { children: question.quizOptions.map((option) => (_jsx(Col, { md: 6, className: "mb-2", children: _jsx(Form.Check, { type: "radio", name: `question-${question.id}`, id: `option-${option.id}`, label: option.option_text, value: option.id, checked: responses[question.id] === option.id, onChange: () => handleOptionChange(question.id, option.id), disabled: shouldShowFinalMessage || shouldShowSpinner }) }, option.id))) })] }, question.id))), submitError && _jsx(Alert, { variant: "danger", children: submitError }), _jsx(Button, { variant: "primary", type: "submit", disabled: shouldShowFinalMessage || shouldShowSpinner || buttonPending, className: "btn-primary", children: buttonPending ? (_jsxs(_Fragment, { children: [_jsx(Spinner, { as: "span", animation: "border", size: "sm", role: "status", "aria-hidden": "true", className: "me-2" }), "Enviando..."] })) : ("Enviar Quiz") })] }))] }, topicId));
};
export default QuizForm;
