import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form, Spinner } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "react-toastify/dist/ReactToastify.css";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "../../styles/admin.css";
import api from "@/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
registerPlugin(FilePondPluginImagePreview);
const AdminArticles = () => {
    const queryClient = useQueryClient();
    // Estados para modal, artículo a editar, archivo y categoría seleccionada.
    const [showModal, setShowModal] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);
    const [file, setFile] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const { register, handleSubmit, reset, setValue, control, formState: { errors }, } = useForm({
        defaultValues: { title: "", content: "", author: "", tags: "", category: "" },
    });
    // Hook de React Query para obtener los artículos
    const { data: articlesData, isLoading, error: queryError } = useQuery({
        queryKey: ["adminArticles"],
        queryFn: async () => {
            const response = await api.get("/articles");
            return response.data.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutos
        cacheTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
    // Extraer categorías únicas a partir de los artículos
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        if (articlesData) {
            const uniqueCategories = Array.from(new Set(articlesData.map((article) => article.category)))
                .filter((cat) => !!cat)
                .map((cat) => ({ value: cat, label: cat }));
            setCategories(uniqueCategories);
        }
    }, [articlesData]);
    // Actualizar el formulario cuando cambia el artículo a editar
    useEffect(() => {
        if (editingArticle) {
            reset({
                title: editingArticle.title,
                content: editingArticle.content,
                author: editingArticle.author,
                tags: editingArticle.tags,
                category: editingArticle.category,
            });
            setSelectedCategory({ value: editingArticle.category, label: editingArticle.category });
        }
        else {
            reset({ title: "", content: "", author: "", tags: "", category: "" });
            setSelectedCategory(null);
        }
    }, [editingArticle, reset]);
    // Mutación para crear o actualizar artículos
    const mutation = useMutation(async (formData) => {
        if (formData.articleId) {
            const id = formData.articleId;
            delete formData.articleId;
            const response = await api.post(`/articles/${id}`, formData);
            return response.data;
        }
        else {
            const response = await api.post(`/articles`, formData);
            return response.data;
        }
    }, {
        onSuccess: (data) => {
            if (data.success) {
                toast.success(data.success);
                queryClient.invalidateQueries(["adminArticles"]);
                handleCloseModal();
            }
            else {
                toast.error(data.error || "Error desconocido.");
            }
        },
        onError: (err) => {
            toast.error(err.message || "Error al crear/actualizar el artículo.");
        },
    });
    const onSubmit = (data) => {
        if (!editingArticle && !file) {
            toast.error("La imagen es obligatoria.");
            return;
        }
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("content", data.content);
        formData.append("author", data.author);
        formData.append("tags", data.tags);
        formData.append("category", selectedCategory?.value || "Sin categoría");
        if (editingArticle && editingArticle.id) {
            formData.append("id", editingArticle.id.toString());
            formData.append("_method", "PUT");
            // Campo auxiliar para la mutación
            formData.articleId = editingArticle.id;
        }
        if (file) {
            formData.append("image", file);
        }
        mutation.mutate(formData);
    };
    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este artículo?"))
            return;
        try {
            const response = await api.delete(`/articles/${id}`);
            if (response.data.success) {
                toast.success(response.data.success);
                queryClient.invalidateQueries(["adminArticles"]);
            }
            else {
                toast.error("Error: " + (response.data.error || "Ocurrió un error."));
            }
        }
        catch (err) {
            toast.error("Error al eliminar el artículo.");
        }
    };
    const handleShowModal = (article) => {
        setEditingArticle(article || null);
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
    return (_jsxs(Container, { className: "admin-container", children: [_jsx("h1", { children: "Gesti\u00F3n de Art\u00EDculos" }), _jsx(Button, { variant: "primary", className: "admin-button-primary mb-3", onClick: () => handleShowModal(), children: "Crear Nuevo Art\u00EDculo" }), isLoading ? (_jsx("div", { className: "text-center my-4", children: _jsx(Spinner, { animation: "border", role: "status", children: _jsx("span", { className: "visually-hidden", children: "Cargando..." }) }) })) : (_jsxs(Table, { striped: true, bordered: true, hover: true, className: "admin-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "ID" }), _jsx("th", { children: "T\u00EDtulo" }), _jsx("th", { children: "Autor" }), _jsx("th", { children: "Categor\u00EDa" }), _jsx("th", { children: "Fecha de Creaci\u00F3n" }), _jsx("th", { children: "Fecha de Actualizaci\u00F3n" }), _jsx("th", { children: "Acciones" })] }) }), _jsx("tbody", { children: articlesData &&
                            articlesData.map((article) => (_jsxs("tr", { children: [_jsx("td", { children: article.id }), _jsx("td", { children: article.title }), _jsx("td", { children: article.author }), _jsx("td", { children: article.category || "Sin categoría" }), _jsx("td", { children: article.created_at ? formatDate(article.created_at) : "N/A" }), _jsx("td", { children: article.updated_at ? formatDate(article.updated_at) : "N/A" }), _jsxs("td", { children: [_jsx(Button, { className: "admin-button me-2", onClick: () => handleShowModal(article), children: "Editar" }), _jsx(Button, { variant: "danger", className: "admin-button", onClick: () => handleDelete(article.id), children: "Eliminar" })] })] }, article.id))) })] })), _jsxs(Modal, { show: showModal, onHide: handleCloseModal, className: "admin-modal", children: [_jsx(Modal.Header, { closeButton: true, children: _jsx(Modal.Title, { children: editingArticle ? "Editar Artículo" : "Crear Artículo" }) }), _jsx(Modal.Body, { children: _jsxs(Form, { onSubmit: handleSubmit(onSubmit), children: [_jsxs(Form.Group, { controlId: "formArticleTitle", className: "mb-3", children: [_jsx(Form.Label, { children: "T\u00EDtulo" }), _jsx(Form.Control, { type: "text", ...register("title", { required: "El título es obligatorio" }), isInvalid: !!errors.title }), errors.title && (_jsx(Form.Control.Feedback, { type: "invalid", children: errors.title.message }))] }), _jsxs(Form.Group, { controlId: "formArticleContent", className: "mb-3", children: [_jsx(Form.Label, { children: "Contenido" }), _jsx(Form.Control, { as: "textarea", rows: 4, ...register("content", { required: "El contenido es obligatorio" }), isInvalid: !!errors.content }), errors.content && (_jsx(Form.Control.Feedback, { type: "invalid", children: errors.content.message }))] }), _jsxs(Form.Group, { controlId: "formArticleAuthor", className: "mb-3", children: [_jsx(Form.Label, { children: "Autor" }), _jsx(Form.Control, { type: "text", ...register("author", { required: "El autor es obligatorio" }), isInvalid: !!errors.author }), errors.author && (_jsx(Form.Control.Feedback, { type: "invalid", children: errors.author.message }))] }), _jsxs(Form.Group, { controlId: "formArticleTags", className: "mb-3", children: [_jsx(Form.Label, { children: "Etiquetas" }), _jsx(Form.Control, { type: "text", ...register("tags"), placeholder: "Ej: Mito, Filosof\u00EDa" })] }), _jsxs(Form.Group, { controlId: "formArticleCategory", className: "mb-3", children: [_jsx(Form.Label, { children: "Categor\u00EDa" }), _jsx(Controller, { control: control, name: "category", rules: { required: "La categoría es obligatoria" }, render: ({ field }) => (_jsx(Select, { ...field, value: selectedCategory, onChange: (option) => {
                                                    setSelectedCategory(option);
                                                    field.onChange(option?.value);
                                                }, options: categories, placeholder: "Selecciona una categor\u00EDa", className: "basic-select", classNamePrefix: "select" })) })] }), _jsxs(Form.Group, { controlId: "formArticleImage", className: "mb-3", children: [_jsx(Form.Label, { children: "Imagen" }), _jsx(FilePond, { files: file ? [file] : [], onupdatefiles: handleFileChange, allowMultiple: false, acceptedFileTypes: ["image/*"], labelIdle: 'Arrastra & suelta una imagen o <span class="filepond--label-action">Buscar</span>' })] }), _jsx("div", { className: "d-grid gap-2", children: _jsx(Button, { variant: "primary", type: "submit", className: "admin-button", children: editingArticle ? "Actualizar" : "Crear" }) })] }) })] })] }));
};
export default AdminArticles;
