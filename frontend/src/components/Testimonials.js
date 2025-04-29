import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/testimonials.css";
export function Testimonials() {
    const [testimonials, setTestimonials] = useState([]);
    useEffect(() => {
        // Simulación de datos (puedes sustituir esto con una llamada fetch en el futuro)
        setTestimonials([
            {
                id: 1,
                name: "María González",
                text: "Esta plataforma cambió mi forma de ver la historia.",
                image: "/src/assets/testimonial2.jpg",
            },
            {
                id: 2,
                name: "Carlos Pérez",
                text: "Cursos bien estructurados y muy interesantes.",
                image: "/src/assets/testimonial1.jpg",
            },
            {
                id: 3,
                name: "Ana López",
                text: "Recomiendo esta plataforma a todos los amantes de la historia.",
                image: "/src/assets/testimonial3.jpg",
            },
        ]);
    }, []);
    return (_jsx("section", { className: "testimonials", children: _jsxs("div", { className: "container", children: [_jsx("h2", { className: "testimonials-title", children: "Opiniones de nuestros estudiantes" }), _jsx("div", { className: "testimonials-grid", children: testimonials.map((testimonial, index) => (_jsxs(motion.div, { className: "testimonial", initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: index * 0.2 }, children: [_jsx("img", { src: testimonial.image, alt: testimonial.name, className: "testimonial-img" }), _jsxs("p", { className: "testimonial-text", children: ["\"", testimonial.text, "\""] }), _jsxs("p", { className: "testimonial-author", children: ["\u2014 ", testimonial.name] })] }, testimonial.id))) })] }) }));
}
