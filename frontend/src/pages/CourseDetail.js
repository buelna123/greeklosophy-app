import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { CallToAction } from "../components/CallToAction";
import { useParams, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { ModalProfile } from "../components/ModalProfile";
import { Spinner } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
import "../styles/DetailPage.css";
// Función para obtener el curso vía API
const fetchCourse = async (courseId) => {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
};
const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [enrollLoading, setEnrollLoading] = useState(false);
    // Obtiene el curso con React Query
    const { data: course, error, isLoading } = useQuery({
        queryKey: ["course", id],
        queryFn: () => {
            if (!id)
                throw new Error("ID de curso faltante");
            return fetchCourse(id);
        },
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
    });
    // Referencia para animación de tipeo en la descripción
    const descriptionRef = useRef(null);
    const typingTimeout = useRef(null);
    useEffect(() => {
        if (!course || isLoading || !descriptionRef.current || !course.description)
            return;
        let index = 0;
        const text = course.description;
        const type = () => {
            if (descriptionRef.current) {
                descriptionRef.current.innerHTML = text.slice(0, index);
                index++;
                if (index <= text.length) {
                    typingTimeout.current = window.setTimeout(type, 15);
                }
            }
        };
        typingTimeout.current = window.setTimeout(type, 300);
        return () => {
            if (typingTimeout.current)
                clearTimeout(typingTimeout.current);
        };
    }, [course, isLoading]);
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    // Función para autoinscribir al curso. 
    // Se llama al endpoint progress/update; se debe configurar en el backend o en el middleware para permitir autoinscripción.
    const autoEnroll = async (courseId) => {
        try {
            await api.post(`/courses/${courseId}/progress/update`, { progress: 0 });
        }
        catch (error) {
            console.error("Error autoinscribiendo el curso:", error);
            throw error;
        }
    };
    // Manejar la acción del botón
    const handleClick = async () => {
        if (user) {
            setEnrollLoading(true);
            try {
                // Intentar autoinscribir. Se espera que este endpoint cree o actualice el registro.
                await autoEnroll(id);
                // Luego redirige a la experiencia extendida del curso
                navigate(`/course-experience/${id}`);
            }
            catch (err) {
                // Si recibimos 403, indica que aún no se creó el registro, entonces tratar de crear uno.
                if (err.response && err.response.status === 403) {
                    try {
                        await api.post(`/courses/${id}/progress/update`, { progress: 0 });
                        navigate(`/course-experience/${id}`);
                    }
                    catch (err2) {
                        console.error("Error autoinscribiendo tras 403:", err2);
                    }
                }
            }
            finally {
                setEnrollLoading(false);
            }
        }
        else {
            setShowProfileModal(true);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsxs("div", { className: "detail-page", children: [_jsxs("div", { className: "detail-layout", children: [_jsx(motion.div, { className: "detail-container", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: "easeOut" }, children: isLoading || authLoading ? (_jsx("div", { className: "spinner-wrapper", children: _jsx(Spinner, { animation: "border", role: "status", variant: "danger", style: { width: 70, height: 70 }, children: _jsx("span", { className: "visually-hidden", children: "Cargando curso..." }) }) })) : error || !course ? (_jsxs("div", { className: "detail-error", children: [_jsx("h1", { children: "Error" }), _jsx("p", { children: error?.message || "Curso no encontrado" })] })) : (_jsxs(_Fragment, { children: [_jsx("h1", { className: "detail-title", children: course.title }), _jsx(Tilt, { tiltMaxAngleX: 5, tiltMaxAngleY: 5, glareEnable: true, glareMaxOpacity: 0.3, glareColor: "transparent", glarePosition: "all", className: "detail-image-tilt", children: _jsx("img", { src: course.image ? course.image : "https://via.placeholder.com/300x200?text=Sin+Imagen", className: "detail-image", alt: course.title, loading: "lazy" }) }), _jsx("p", { className: "detail-content", ref: descriptionRef }), course.category && (_jsxs("p", { className: "cd-category", children: [_jsx("strong", { children: "Categor\u00EDa:" }), " ", course.category] })), _jsxs("p", { className: "ad-meta", children: ["Publicado: ", formatDate(course.created_at)] }), course.updated_at && (_jsxs("p", { className: "cd-updated", children: [_jsx("strong", { children: "\u00DAltima actualizaci\u00F3n:" }), " ", formatDate(course.updated_at)] })), _jsx("button", { className: "detail-button", onClick: handleClick, children: enrollLoading ? (_jsx(Spinner, { animation: "border", role: "status", size: "sm", variant: "light", children: _jsx("span", { className: "visually-hidden", children: "Cargando..." }) })) : user ? ("Iniciar curso") : ("Inscribirse") })] })) }), _jsx("div", { className: "sidebar-container", children: _jsx(Sidebar, { onDataLoaded: () => { } }) })] }), _jsx(CallToAction, {})] }), _jsx(Footer, {}), _jsx(ModalProfile, { show: showProfileModal, onHide: () => setShowProfileModal(false) })] }));
};
export default CourseDetail;
