import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "@/styles/CourseCard.css";
const CourseCard = ({ course }) => {
    return (_jsxs(motion.div, { className: "course-card", initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, whileHover: { scale: 1.03 }, transition: { duration: 0.2 }, children: [_jsx("div", { className: "course-img-container", children: _jsx("img", { src: course.image ? course.image : "https://via.placeholder.com/300x200?text=Sin+Imagen", className: "course-img", alt: course.title }) }), _jsxs("div", { className: "course-body", children: [_jsx("h3", { className: "course-title", children: course.title }), _jsx("p", { className: "course-description", children: course.description }), _jsx(Link, { to: `/courses/${course.id}`, className: "course-button", children: "Ver m\u00E1s" })] })] }));
};
export default CourseCard;
