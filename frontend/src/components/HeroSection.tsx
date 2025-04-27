import { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/HeroSection.css';

export function HeroSection() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect} className="hero-carousel" interval={5000} pause="hover" fade>
      <Carousel.Item>
        <div className="carousel-image courses">
          <div className="overlay"></div>
        </div>
        <Carousel.Caption className="caption-left">
          <div className="caption-content">
            <h2>Sumérgete en el aprendizaje</h2>
            <p>
              Explora una variedad de cursos diseñados por expertos para ayudarte a comprender la historia de una manera profunda y significativa.
            </p>
            <blockquote>"Nada es permanente, excepto el cambio." - Heráclito</blockquote>
            <Link to="/courses" className="hero-button">Ver Cursos</Link>
          </div>
        </Carousel.Caption>
      </Carousel.Item>
      
      <Carousel.Item>
        <div className="carousel-image articles">
          <div className="overlay"></div>
        </div>
        <Carousel.Caption className="caption-right">
          <div className="caption-content">
            <h2>Conoce nuevas perspectivas</h2>
            <p>
              Accede a artículos exclusivos que exploran diferentes épocas, culturas y personajes históricos con un enfoque analítico.
            </p>
            <blockquote>"El conocimiento es poder." - Sócrates</blockquote>
            <Link to="/blog" className="hero-button">Leer Artículos</Link>
          </div>
        </Carousel.Caption>
      </Carousel.Item>
      
      <Carousel.Item>
        <div className="carousel-image contact">
          <div className="overlay"></div>
        </div>
        <Carousel.Caption className="caption-center">
          <div className="caption-content">
            <h2>Únete a nuestra comunidad</h2>
            <p>
              ¿Tienes preguntas o sugerencias? Estamos aquí para escucharte y ayudarte en tu viaje de aprendizaje.
            </p>
            <blockquote>"La educación es el mejor provisionamiento para la vejez." - Aristóteles</blockquote>
            <Link to="/contacto" className="hero-button">Contáctanos</Link>
          </div>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}