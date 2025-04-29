import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Spinner } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import CourseCard from "./CourseCard";
import api from "@/api";
import "../styles/CoursesGrid.css";
export function CoursesGrid() {
    // Utilizamos React Query para obtener los cursos
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["coursesGrid"],
        queryFn: async () => {
            const response = await api.get("/courses");
            return response.data.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutos
        cacheTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
    });
    if (isLoading) {
        return (_jsx("div", { className: "spinner-wrapper text-center my-5", children: _jsx(Spinner, { animation: "border", role: "status", variant: "danger", children: _jsx("span", { className: "visually-hidden", children: "Cargando cursos..." }) }) }));
    }
    if (isError) {
        return (_jsxs("div", { className: "error text-center my-5", children: [_jsx("h1", { children: "Error" }), _jsx("p", { children: error?.message || "Error al cargar cursos" })] }));
    }
    // Ordenamos los cursos por fecha de creación (de más reciente a más antiguo)
    const sortedCourses = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return (_jsxs("div", { className: "homepage-courses", children: [_jsx("h2", { className: "homepage-courses-title", children: "\u00DAltimos Cursos" }), _jsx("div", { className: "homepage-courses-container", children: sortedCourses.slice(0, 3).map((course) => (_jsx("div", { className: "homepage-course-card", children: _jsx(CourseCard, { course: course }) }, course.id))) })] }));
}
