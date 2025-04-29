import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/admin/modals/AssignmentModal.tsx
import { useEffect, useMemo, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api";
const AssignmentModal = ({ show, onHide, editingAssignment, onSuccess, }) => {
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, control, formState: { errors }, } = useForm({
        defaultValues: {
            course: null,
            title: "",
            description: "",
            due_date: "",
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
        if (editingAssignment) {
            const selected = courseOptions.find(opt => opt.value === editingAssignment.course_id) || null;
            setSelectedCourse(selected);
            reset({
                course: selected,
                title: editingAssignment.title,
                description: editingAssignment.description,
                due_date: editingAssignment.due_date ?? "",
            });
        }
        else {
            setSelectedCourse(null);
            reset({
                course: null,
                title: "",
                description: "",
                due_date: "",
            });
        }
    }, [show, editingAssignment, reset, courseOptions]);
    const mutation = useMutation(async (formData) => {
        let response;
        if (editingAssignment?.id) {
            formData.append("_method", "PUT");
            response = await api.post(`/admin/assignments/${editingAssignment.id}`, formData);
        }
        else {
            response = await api.post(`/admin/assignments`, formData);
        }
        return response.data;
    }, {
        onSuccess: data => {
            if (data.success) {
                toast.success(data.success);
                queryClient.invalidateQueries(["adminAssignments"]);
                onHide();
                onSuccess();
            }
            else {
                toast.error(data.error || "Error desconocido.");
            }
        },
        onError: error => {
            toast.error(error.message || "Error al guardar la asignación.");
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
        formData.append("description", data.description);
        if (data.due_date)
            formData.append("due_date", data.due_date);
        mutation.mutate(formData);
    };
    return (_jsxs(Modal, { show: show, onHide: onHide, size: "lg", centered: true, children: [_jsx(Modal.Header, { closeButton: true, children: _jsx(Modal.Title, { children: editingAssignment ? "Editar Asignación" : "Crear Asignación" }) }), _jsx(Modal.Body, { children: loadingCourses ? (_jsx("div", { className: "text-center my-3", children: _jsx(Spinner, { animation: "border" }) })) : (_jsxs(Form, { onSubmit: handleSubmit(onSubmit), children: [_jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Curso" }), _jsx(Controller, { name: "course", control: control, rules: { required: "Curso obligatorio" }, render: ({ field }) => (_jsx(Select, { ...field, options: courseOptions, value: selectedCourse, onChange: (opt) => {
                                            field.onChange(opt);
                                            setSelectedCourse(opt);
                                        }, placeholder: "Selecciona un curso" })) }), errors.course && _jsx(Form.Text, { className: "text-danger", children: errors.course.message })] }), _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "T\u00EDtulo" }), _jsx(Form.Control, { type: "text", ...register("title", { required: "El título es obligatorio" }), isInvalid: !!errors.title }), _jsx(Form.Control.Feedback, { type: "invalid", children: errors.title?.message })] }), _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Descripci\u00F3n" }), _jsx(Form.Control, { as: "textarea", rows: 3, ...register("description", { required: "La descripción es obligatoria" }), isInvalid: !!errors.description }), _jsx(Form.Control.Feedback, { type: "invalid", children: errors.description?.message })] }), _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Fecha de entrega (opcional)" }), _jsx(Form.Control, { type: "date", ...register("due_date") })] }), _jsx("div", { className: "text-end", children: _jsx(Button, { variant: "primary", type: "submit", disabled: mutation.isLoading, children: mutation.isLoading
                                    ? "Guardando..."
                                    : editingAssignment
                                        ? "Actualizar Asignación"
                                        : "Crear Asignación" }) })] })) })] }));
};
export default AssignmentModal;
