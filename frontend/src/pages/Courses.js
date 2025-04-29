import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Container, Row, Spinner } from "react-bootstrap";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { CallToAction } from "../components/CallToAction";
import CourseCard from "../components/CourseCard";
import ProgressBar from "../components/ProgressBar";
import { useCoursesQuery } from "@/hooks/useCourses";
import "../styles/Courses.css";
const Courses = () => {
    // Obtenemos la data con React Query
    const { data: courses = [], isLoading, error } = useCoursesQuery();
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    // Cada vez que cambie la data (courses) se establece la lista filtrada igual a la completa
    useEffect(() => {
        setFilteredCourses(courses);
    }, [courses]);
    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
        setFilteredCourses(courses.filter((course) => {
            const title = course.title.toLowerCase();
            const category = course.category.toLowerCase();
            return title.includes(value) || category.includes(value);
        }));
    };
    return (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsx(ProgressBar, {}), _jsxs(Container, { className: "courses-page-container", children: [_jsx("h1", { className: "courses-page-title", children: "Explora Nuestros Cursos" }), _jsx("div", { className: "search-bar", children: _jsx("input", { type: "text", placeholder: "Buscar curso...", value: searchTerm, onChange: handleSearch, className: "search-input" }) }), isLoading ? (_jsx("div", { className: "text-center my-5", children: _jsx(Spinner, { animation: "border", role: "status", variant: "danger", children: _jsx("span", { className: "visually-hidden", children: "Cargando cursos..." }) }) })) : error ? (_jsxs("div", { className: "courses-error", children: [_jsx("h1", { children: "Error" }), _jsx("p", { children: typeof error === "string"
                                    ? error
                                    : "Error desconocido al cargar los cursos." })] })) : filteredCourses.length > 0 ? (_jsx(Row, { className: "courses-grid", children: filteredCourses.map((course) => (_jsx("div", { className: "course-column", children: _jsx(CourseCard, { course: course }) }, course.id))) })) : (_jsx("p", { className: "text-center", children: "No se encontraron cursos." }))] }), _jsx(CallToAction, {}), _jsx(Footer, {})] }));
};
export default Courses;
