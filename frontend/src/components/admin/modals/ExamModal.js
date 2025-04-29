import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from "react";
import { Modal, Button, Form, Spinner, Row, Col, } from "react-bootstrap";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import api from "@/api";
const ExamModal = ({ initialData, show, onHide, onSuccess, }) => {
    const { control, register, handleSubmit, reset, formState: { errors }, } = useForm({
        defaultValues: {
            title: "",
            description: "",
            questions: [],
        },
    });
    const { fields: questionFields, append: appendQuestion, remove: removeQuestion, } = useFieldArray({
        control,
        name: "questions",
    });
    useEffect(() => {
        if (show && initialData) {
            const transformedQuestions = (initialData.examQuestions || []).map((q) => ({
                question_text: q.question_text,
                points: Number(q.points),
                options: (q.examOptions || q.exam_options || []).map((o) => ({
                    option_text: o.option_text,
                    is_correct: !!o.is_correct,
                })),
            }));
            reset({
                title: initialData.title,
                description: initialData.description,
                questions: transformedQuestions,
            });
        }
    }, [initialData, show, reset]);
    const mutation = useMutation({
        mutationFn: async (payload) => {
            const res = await api.put(`/course-exams/${initialData.course_id}`, {
                title: payload.title,
                description: payload.description,
                questions: payload.questions.map((q) => ({
                    question_text: q.question_text,
                    points: Number(q.points),
                    options: q.options.map((opt) => ({
                        option_text: opt.option_text,
                        is_correct: !!opt.is_correct,
                    })),
                })),
            });
            const updated = res.data.exam;
            // normalizar snake_case a camelCase si es necesario
            const transformed = {
                ...updated,
                examQuestions: (updated.exam_questions || []).map((q) => ({
                    question_text: q.question_text,
                    points: q.points,
                    examOptions: (q.exam_options || []).map((o) => ({
                        option_text: o.option_text,
                        is_correct: !!o.is_correct,
                    })),
                })),
            };
            return transformed;
        },
        onSuccess: (updatedExam) => {
            toast.success("Examen actualizado correctamente");
            onSuccess(updatedExam);
            onHide();
        },
        onError: (err) => {
            console.error("Error al guardar examen:", err);
            toast.error(err.response?.data?.error || "Error al guardar examen");
        },
    });
    const onSubmit = (data) => {
        if (data.questions.length === 0) {
            toast.error("Agrega al menos una pregunta");
            return;
        }
        mutation.mutate(data);
    };
    return (_jsxs(Modal, { show: show, onHide: onHide, size: "lg", centered: true, children: [_jsx(Modal.Header, { closeButton: true, children: _jsx(Modal.Title, { children: "Editar Examen" }) }), _jsx(Modal.Body, { children: _jsxs(Form, { onSubmit: handleSubmit(onSubmit), children: [_jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "T\u00EDtulo" }), _jsx(Form.Control, { type: "text", ...register("title", {
                                        required: "Título requerido",
                                        maxLength: { value: 255, message: "Máximo 255 caracteres" },
                                    }), isInvalid: !!errors.title }), errors.title && (_jsx(Form.Control.Feedback, { type: "invalid", children: errors.title.message }))] }), _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Descripci\u00F3n" }), _jsx(Form.Control, { as: "textarea", rows: 3, ...register("description", {
                                        required: "Descripción requerida",
                                    }), isInvalid: !!errors.description }), errors.description && (_jsx(Form.Control.Feedback, { type: "invalid", children: errors.description.message }))] }), questionFields.map((question, qIdx) => (_jsxs("div", { className: "mb-4 border p-3 rounded", children: [_jsxs(Row, { className: "mb-2", children: [_jsxs(Col, { md: 9, children: [_jsxs(Form.Label, { children: ["Pregunta ", qIdx + 1] }), _jsx(Form.Control, { type: "text", ...register(`questions.${qIdx}.question_text`, {
                                                        required: "Pregunta obligatoria",
                                                    }), isInvalid: !!errors.questions?.[qIdx]?.question_text }), errors.questions?.[qIdx]?.question_text && (_jsx(Form.Text, { className: "text-danger", children: errors.questions[qIdx].question_text?.message }))] }), _jsxs(Col, { md: 2, children: [_jsx(Form.Label, { children: "Puntos" }), _jsx(Form.Control, { type: "number", ...register(`questions.${qIdx}.points`, {
                                                        required: "Puntos requeridos",
                                                        min: { value: 1, message: "Mínimo 1 punto" },
                                                        valueAsNumber: true,
                                                    }), isInvalid: !!errors.questions?.[qIdx]?.points }), errors.questions?.[qIdx]?.points && (_jsx(Form.Control.Feedback, { type: "invalid", children: errors.questions[qIdx].points?.message }))] }), _jsx(Col, { md: 1, className: "d-flex align-items-end", children: _jsx(Button, { variant: "outline-danger", size: "sm", onClick: () => removeQuestion(qIdx), title: "Eliminar pregunta", children: "\uD83D\uDDD1" }) })] }), _jsx(Form.Label, { children: "Opciones" }), _jsx(OptionGroup, { control: control, register: register, errors: errors, questionIndex: qIdx })] }, question.id))), _jsxs("div", { className: "d-grid gap-2", children: [_jsx(Button, { variant: "outline-secondary", onClick: () => appendQuestion({
                                        question_text: "",
                                        points: 1,
                                        options: [
                                            { option_text: "", is_correct: false },
                                            { option_text: "", is_correct: false },
                                        ],
                                    }), children: "+ Agregar pregunta" }), _jsx(Button, { type: "submit", variant: "primary", disabled: mutation.isLoading, children: mutation.isLoading ? (_jsxs(_Fragment, { children: [_jsx(Spinner, { size: "sm", animation: "border", className: "me-2" }), "Guardando..."] })) : ("Guardar Cambios") })] })] }) })] }));
};
export default ExamModal;
// Mueve OptionGroup después para que esté definido antes de ser usado
const OptionGroup = ({ control, register, errors, questionIndex, }) => {
    const { fields: optionFields, append: appendOption, remove: removeOption, } = useFieldArray({
        control,
        name: `questions.${questionIndex}.options`,
    });
    return (_jsxs(_Fragment, { children: [optionFields.map((option, oIdx) => (_jsxs(Row, { className: "mb-2 align-items-center", children: [_jsx(Col, { md: 7, children: _jsx(Form.Control, { type: "text", placeholder: `Opción ${oIdx + 1}`, ...register(`questions.${questionIndex}.options.${oIdx}.option_text`, {
                                required: "Texto requerido",
                            }), isInvalid: !!errors.questions?.[questionIndex]?.options?.[oIdx]?.option_text }) }), _jsx(Col, { md: 3, children: _jsx(Form.Check, { type: "checkbox", label: "Correcta", ...register(`questions.${questionIndex}.options.${oIdx}.is_correct`) }) }), _jsx(Col, { md: 2, children: _jsx(Button, { size: "sm", variant: "outline-danger", onClick: () => {
                                if (optionFields.length <= 2) {
                                    toast.warning("Debe haber al menos dos opciones");
                                    return;
                                }
                                removeOption(oIdx);
                            }, children: "Eliminar" }) })] }, option.id))), _jsx(Button, { variant: "secondary", size: "sm", className: "mt-2", onClick: () => appendOption({ option_text: "", is_correct: false }), children: "+ Agregar opci\u00F3n" })] }));
};
