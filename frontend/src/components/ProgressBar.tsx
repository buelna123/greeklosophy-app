import React, { useRef, useEffect, useCallback, useState } from "react";
import "@/styles/ProgressBar.css"; // Importamos el CSS

interface ProgressBarProps {
  color?: string; // Color personalizado (opcional)
  height?: number; // Altura personalizada (opcional)
}

const ProgressBar: React.FC<ProgressBarProps> = ({ color = "#d32f2f", height = 5 }) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(70); // Valor inicial: 80px

  // Actualizar la posición de la barra de progreso
  const updateProgressBarPosition = useCallback(() => {
    const header = document.querySelector("header");
    if (header) {
      const newHeaderHeight = header.offsetHeight;
      setHeaderHeight(newHeaderHeight);
    }
  }, []);

  // Actualizar el ancho de la barra de progreso al hacer scroll
  const updateProgressBarWidth = useCallback(() => {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${progress}%`;
    }
  }, []);

  useEffect(() => {
    const header = document.querySelector("header");

    // Configurar ResizeObserver para cambios dinámicos en el Header
    const resizeObserver = new ResizeObserver(updateProgressBarPosition);
    if (header) {
      resizeObserver.observe(header);
    }

    // Actualizar la posición inicial
    updateProgressBarPosition();

    // Escuchar el evento de scroll
    window.addEventListener("scroll", updateProgressBarWidth);

    return () => {
      if (header) {
        resizeObserver.unobserve(header);
      }
      window.removeEventListener("scroll", updateProgressBarWidth);
    };
  }, [updateProgressBarPosition, updateProgressBarWidth]);

  return (
    <div
      ref={progressBarRef}
      className="progress-bar"
      style={{
        '--progress-color': color,
        '--progress-height': `${height}px`,
        top: `${headerHeight}px`
      } as React.CSSProperties}
    ></div>
  );
};

export default ProgressBar;