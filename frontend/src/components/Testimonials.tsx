import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/testimonials.css";

interface Testimonial {
  id: number;
  name: string;
  text: string;
  image: string;
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

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

  return (
    <section className="testimonials">
      <div className="container">
        <h2 className="testimonials-title">Opiniones de nuestros estudiantes</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="testimonial"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <img src={testimonial.image} alt={testimonial.name} className="testimonial-img" />
              <p className="testimonial-text">"{testimonial.text}"</p>
              <p className="testimonial-author">— {testimonial.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
