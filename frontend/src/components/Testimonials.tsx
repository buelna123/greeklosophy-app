import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/testimonials.css";

import img1 from "@/assets/testimonial1.jpg";
import img2 from "@/assets/testimonial2.jpg";
import img3 from "@/assets/testimonial3.jpg";

interface Testimonial {
  id: number;
  name: string;
  text: string;
  image: string;
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

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
