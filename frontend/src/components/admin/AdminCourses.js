import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/admin/AdminCourses.tsx
import { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form, Spinner } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import { useNavigate } from "react-router-dom"; // ✅ NUEVO
import "react-toastify/dist/ReactToastify.css";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "../../styles/admin.css";
import api from "@/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
registerPlugin(FilePondPluginImagePreview);
const AdminCourses = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate(); // ✅ NUEVO
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [file, setFile] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const { register, handleSubmit, reset, setValue, control, formState: { errors }, } = useForm({
        defaultValues: { title: "", description: "", category: "" },
    });
    useEffect(() => {
        if (editingCourse) {
            reset({
                title: editingCourse.title,
                description: editingCourse.description,
                category: editingCourse.category,
            });
            setSelectedCategory({ value: editingCourse.category, label: editingCourse.category });
        }
        else {
            reset({ title: "", description: "", category: "" });
            setSelectedCategory(null);
        }
    }, [editingCourse, reset]);
    const { data: coursesData, isLoading } = useQuery({
        queryKey: ["adminCourses"],
        queryFn: async () => {
            const response = await api.get("/courses");
            return response.data.data;
        },
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        if (coursesData) {
            const uniqueCategories = Array.from(new Set(coursesData.map(course => course.category)))
                .filter((cat) => !!cat)
                .map((cat) => ({ value: cat, label: cat }));
            setCategories(uniqueCategories);
        }
    }, [coursesData]);
    const mutation = useMutation(async (formData) => {
        if (formData.courseId) {
            const id = formData.courseId;
            delete formData.courseId;
            const response = await api.post(`/courses/${id}`, formData);
            return response.data;
        }
        else {
            const response = await api.post(`/courses`, formData);
            return response.data;
        }
    }, {
        onSuccess: (data) => {
            if (data.success) {
                toast.success(data.success);
                queryClient.invalidateQueries(["adminCourses"]);
                handleCloseModal();
            }
            else {
                toast.error(data.error || "Error desconocido.");
            }
        },
        onError: (err) => {
            toast.error(err.message || "Error al crear/actualizar el curso.");
        },
    });
    const onSubmit = (data) => {
        if (!editingCourse && !file) {
            toast.error("La imagen es obligatoria.");
            return;
        }
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("category", selectedCategory?.value || "Sin categoría");
        if (editingCourse?.id) {
            formData.append("id", editingCourse.id.toString());
            formData.append("_method", "PUT");
            formData.courseId = editingCourse.id;
        }
        if (file) {
            formData.append("image", file);
        }
        mutation.mutate(formData);
    };
    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este curso?"))
            return;
        try {
            const response = await api.delete(`/courses/${id}`);
            if (response.data.success) {
                toast.success(response.data.success);
                queryClient.invalidateQueries(["adminCourses"]);
            }
            else {
                toast.error("Error: " + (response.data.error || "Ocurrió un error."));
            }
        }
        catch (err) {
            toast.error("Error al eliminar el curso.");
            console.error(err);
        }
    };
    const handleShowModal = (course) => {
        setEditingCourse(course || null);
        setFile(null);
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
        setFile(null);
        setSelectedCategory(null);
    };
    const handleFileChange = (fileItems) => {
        setFile(fileItems.length > 0 ? fileItems[0].file : null);
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    return (_jsxs(Container, { className: "admin-container", children: [_jsx("h1", { children: "Gesti\u00F3n de Cursos" }), _jsx(Button, { variant: "primary", className: "admin-button-primary mb-3", onClick: () => handleShowModal(), children: "Crear Nuevo Curso" }), isLoading ? (_jsx("div", { className: "text-center my-4", children: _jsx(Spinner, { animation: "border", role: "status", children: _jsx("span", { className: "visually-hidden", children: "Cargando..." }) }) })) : (_jsxs(Table, { striped: true, bordered: true, hover: true, className: "admin-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "ID" }), _jsx("th", { children: "T\u00EDtulo" }), _jsx("th", { children: "Descripci\u00F3n" }), _jsx("th", { children: "Categor\u00EDa" }), _jsx("th", { children: "Fecha de Creaci\u00F3n" }), _jsx("th", { children: "Fecha de Actualizaci\u00F3n" }), _jsx("th", { children: "Acciones" })] }) }), _jsx("tbody", { children: coursesData &&
                            coursesData.map((course) => (_jsxs("tr", { children: [_jsx("td", { children: course.id }), _jsx("td", { children: course.title }), _jsx("td", { children: course.description }), _jsx("td", { children: course.category || "Sin categoría" }), _jsx("td", { children: course.created_at ? formatDate(course.created_at) : "N/A" }), _jsx("td", { children: course.updated_at ? formatDate(course.updated_at) : "N/A" }), _jsxs("td", { children: [_jsx(Button, { className: "admin-button me-2", onClick: () => handleShowModal(course), children: "Editar" }), _jsx(Button, { variant: "danger", className: "admin-button me-2", onClick: () => handleDelete(course.id), children: "Eliminar" }), _jsx(Button, { variant: "outline-secondary", className: "admin-button", onClick: () => navigate(`/admin/quizzes?course=${course.id}&title=${encodeURIComponent(course.title)}`), children: "Ver Quizzes" })] })] }, course.id))) })] })), _jsxs(Modal, { show: showModal, onHide: handleCloseModal, className: "admin-modal", children: [_jsx(Modal.Header, { closeButton: true, children: _jsx(Modal.Title, { children: editingCourse ? "Editar Curso" : "Crear Curso" }) }), _jsx(Modal.Body, { children: _jsxs(Form, { onSubmit: handleSubmit(onSubmit), children: [_jsxs(Form.Group, { controlId: "formCourseTitle", className: "mb-3", children: [_jsx(Form.Label, { children: "T\u00EDtulo" }), _jsx(Form.Control, { type: "text", ...register("title", { required: "El título es obligatorio" }), isInvalid: !!errors.title }), errors.title && (_jsx(Form.Control.Feedback, { type: "invalid", children: errors.title.message }))] }), _jsxs(Form.Group, { controlId: "formCourseDescription", className: "mb-3", children: [_jsx(Form.Label, { children: "Descripci\u00F3n" }), _jsx(Form.Control, { as: "textarea", rows: 3, ...register("description", { required: "La descripción es obligatoria" }), isInvalid: !!errors.description }), errors.description && (_jsx(Form.Control.Feedback, { type: "invalid", children: errors.description.message }))] }), _jsxs(Form.Group, { controlId: "formCourseCategory", className: "mb-3", children: [_jsx(Form.Label, { children: "Categor\u00EDa" }), _jsx(Controller, { control: control, name: "category", rules: { required: "La categoría es obligatoria" }, render: ({ field }) => (_jsx(Select, { ...field, value: selectedCategory, onChange: (option) => {
                                                    setSelectedCategory(option);
                                                    field.onChange(option?.value);
                                                }, options: categories, placeholder: "Selecciona una categor\u00EDa" })) })] }), _jsxs(Form.Group, { controlId: "formCourseImage", className: "mb-3", children: [_jsx(Form.Label, { children: "Imagen" }), _jsx(FilePond, { files: file ? [file] : [], onupdatefiles: handleFileChange, allowMultiple: false, acceptedFileTypes: ["image/*"], labelIdle: 'Arrastra & suelta una imagen o <span class="filepond--label-action">Buscar</span>' })] }), _jsx("div", { className: "d-grid gap-2", children: _jsx(Button, { variant: "primary", type: "submit", className: "admin-button", children: editingCourse ? "Actualizar Curso" : "Crear Curso" }) })] }) })] })] }));
};
export default AdminCourses;
