import React from "react";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
import "@/styles/FeaturedArticles.css";

// Definición de la interfaz Article (ajústala o impórtala desde tu archivo de tipos globales)
export interface Article {
  id: number;
  title: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  tags?: string;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
}

const FeaturedArticles = () => {
  // Utilizamos React Query para obtener todos los artículos
  const { data: articlesData, isLoading, isError, error } = useQuery<Article[]>({
    queryKey: ["featuredArticles"],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Article>>("/articles");
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  // Extraemos los primeros 4 artículos (puedes ordenarlos aquí si lo necesitas)
  const articles = articlesData ? articlesData.slice(0, 4) : [];

  // Estado interno para el slide actual y la variable que controla el primer render para la animación
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [maxContentLength, setMaxContentLength] = React.useState(150);
  const [firstLoad, setFirstLoad] = React.useState(true);

  // Efecto para actualizar el límite de contenido en función del ancho de la ventana
  React.useEffect(() => {
    const handleResize = () => {
      setMaxContentLength(window.innerWidth < 768 ? 100 : 150);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Pequeño efecto para dejar de mostrar la animación de primer render después de 400ms
  React.useEffect(() => {
    const timer = setTimeout(() => setFirstLoad(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const goToSlide = (index: number) => {
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  return (
    <section className="featured-articles">
      <h2 className="section-title">Últimos Artículos</h2>
      {isLoading ? (
        <div className="spinner-wrapper text-center">
          <Spinner animation="border" role="status" variant="danger">
            <span className="visually-hidden">Cargando artículos...</span>
          </Spinner>
        </div>
      ) : isError ? (
        <div className="error text-center">
          <h1>Error</h1>
          <p>{(error as Error)?.message || "Error al cargar los artículos."}</p>
        </div>
      ) : (
        <>
          <div className="carousel-container">
            <AnimatePresence mode="wait">
              <motion.div
                key={articles[currentIndex]?.id}
                className="article-card"
                initial={firstLoad ? { opacity: 0, y: 30 } : { opacity: 0, scale: 0.95 }}
                animate={firstLoad ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="hover-wrapper">
                  <div className="image-container">
                    <img
                      src={`http://localhost:8001/storage/${articles[currentIndex].image}`}
                      alt={articles[currentIndex].title}
                      className="article-image"
                    />
                  </div>
                  <div className="article-content">
                    <h3>{articles[currentIndex].title}</h3>
                    <p>
                      {articles[currentIndex].content.substring(0, maxContentLength)}...
                    </p>
                    <div className="article-meta">
                      <span className="author">
                        Por {articles[currentIndex].author}
                      </span>
                      <span className="date">
                        {formatDate(
                          articles[currentIndex].updated_at ||
                            articles[currentIndex].created_at
                        )}
                      </span>
                    </div>
                    <div className="button-container">
                      <Link
                        to={`/articles/${articles[currentIndex].id}`}
                        className="read-more"
                      >
                        Leer más
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="hover-gradient"></div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="carousel-indicators">
            {articles.map((_, index) => (
              <span
                key={index}
                className={index === currentIndex ? "active-dot" : "dot"}
                onClick={() => goToSlide(index)}
              ></span>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default FeaturedArticles;
