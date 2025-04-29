import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/admin/modals/TopicModal.tsx
import { useEffect, useMemo, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";
import api from "@/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
const TopicModal = ({ show, onHide, editingTopic, onSuccess, }) => {
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, control, formState: { errors }, } = useForm({
        defaultValues: {
            course: null,
            title: "",
            content: "",
        },
    });
    const [selectedCourse, setSelectedCourse] = useState(null);
    const { data: coursesRaw = [], isLoading: loadingCourses } = useQuery({
        queryKey: ["adminCoursesList"],
        queryFn: async () => {
            const res = await api.get("/courses");
            return res.data.data;
        },
    });
    const courseOptions = useMemo(() => {
        return coursesRaw.map(c => ({ value: c.id, label: c.title }));
    }, [coursesRaw]);
    useEffect(() => {
        if (!show)
            return;
        if (editingTopic) {
            const selected = courseOptions.find(o => o.value === editingTopic.course_id) || null;
            setSelectedCourse(selected);
            reset({
                course: selected,
                title: editingTopic.title,
                content: editingTopic.content,
            });
        }
        else {
            setSelectedCourse(null);
            reset({
                course: null,
                title: "",
                content: "",
            });
        }
    }, [show, editingTopic, reset, courseOptions]);
    const mutation = useMutation(async (formData) => {
        let res;
        if (editingTopic?.id) {
            formData.append("_method", "PUT");
            res = await api.post(`/admin/topics/${editingTopic.id}`, formData);
        }
        else {
            res = await api.post("/admin/topics", formData);
        }
        return res.data;
    }, {
        onSuccess: data => {
            if (data.success) {
                toast.success(data.success);
                queryClient.invalidateQueries(["adminTopics"]);
                onHide();
                onSuccess();
            }
            else {
                toast.error(data.error || "Error desconocido.");
            }
        },
        onError: err => {
            toast.error(err.message || "Error al guardar el tema.");
        },
    });
    const onSubmit = (data) => {
        if (!data.course) {
            toast.error("Selecciona un curso.");
            return;
        }
        const formData = new FormData();
        formData.append("course_id", data.course.value.toString());
        formData.append("title", data.title);
        formData.append("content", data.content);
        mutation.mutate(formData);
    };
    return (_jsxs(Modal, { show: show, onHide: onHide, size: "lg", centered: true, children: [_jsx(Modal.Header, { closeButton: true, children: _jsx(Modal.Title, { children: editingTopic ? "Editar Tema" : "Crear Tema" }) }), _jsx(Modal.Body, { children: loadingCourses ? (_jsx("div", { className: "text-center my-3", children: _jsx(Spinner, { animation: "border" }) })) : (_jsxs(Form, { onSubmit: handleSubmit(onSubmit), children: [_jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Curso" }), _jsx(Controller, { name: "course", control: control, rules: { required: "Curso obligatorio" }, render: ({ field }) => (_jsx(Select, { ...field, options: courseOptions, value: selectedCourse, onChange: (opt) => {
                                            field.onChange(opt);
                                            setSelectedCourse(opt);
                                        }, placeholder: "Selecciona un curso" })) }), errors.course && (_jsx(Form.Text, { className: "text-danger", children: errors.course.message }))] }), _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "T\u00EDtulo" }), _jsx(Form.Control, { type: "text", ...register("title", { required: "El título es obligatorio" }), isInvalid: !!errors.title }), _jsx(Form.Control.Feedback, { type: "invalid", children: errors.title?.message })] }), _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Contenido" }), _jsx(Form.Control, { as: "textarea", rows: 4, ...register("content", { required: "El contenido es obligatorio" }), isInvalid: !!errors.content }), _jsx(Form.Control.Feedback, { type: "invalid", children: errors.content?.message })] }), _jsx("div", { className: "text-end", children: _jsx(Button, { variant: "primary", type: "submit", disabled: mutation.isLoading, children: mutation.isLoading
                                    ? "Guardando..."
                                    : editingTopic
                                        ? "Actualizar Tema"
                                        : "Crear Tema" }) })] })) })] }));
};
export default TopicModal;
