import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/testimonials.css";
import img1 from "@/assets/testimonial1.jpg";
import img2 from "@/assets/testimonial2.jpg";
import img3 from "@/assets/testimonial3.jpg";
export function Testimonials() {
    const [testimonials, setTestimonials] = useState([]);
    useEffect(() => {
        setTestimonials([
            {
                id: 1,
                name: "María González",
                text: "Esta plataforma cambió mi forma de ver la historia.",
                image: img2,
            },
            {
                id: 2,
                name: "Carlos Pérez",
                text: "Cursos bien estructurados y muy interesantes.",
                image: img1,
            },
            {
                id: 3,
                name: "Ana López",
                text: "Recomiendo esta plataforma a todos los amantes de la historia.",
                image: img3,
            },
        ]);
    }, []);
    return (_jsx("section", { className: "testimonials", children: _jsxs("div", { className: "container", children: [_jsx("h2", { className: "testimonials-title", children: "Opiniones de nuestros estudiantes" }), _jsx("div", { className: "testimonials-grid", children: testimonials.map((testimonial, index) => (_jsxs(motion.div, { className: "testimonial", initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: index * 0.2 }, children: [_jsx("img", { src: testimonial.image, alt: testimonial.name, className: "testimonial-img" }), _jsxs("p", { className: "testimonial-text", children: ["\"", testimonial.text, "\""] }), _jsxs("p", { className: "testimonial-author", children: ["\u2014 ", testimonial.name] })] }, testimonial.id))) })] }) }));
}
