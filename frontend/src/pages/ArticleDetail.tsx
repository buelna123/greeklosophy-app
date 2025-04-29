import { useParams } from "react-router-dom";
import { useRef, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { CallToAction } from "../components/CallToAction";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Sidebar from "../components/Sidebar";
import { Spinner } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
import "../styles/DetailPage.css";

interface ArticleData {
  id: number;
  title: string;
  content: string;
  author: string;
  image: string;
  category?: string;
  tags?: string;
  created_at: string;
  updated_at?: string;
}

// Función para obtener los datos del artículo vía API
const fetchArticle = async (articleId: string): Promise<ArticleData> => {
  const response = await api.get<ArticleData>(`/articles/${articleId}`);
  return response.data;
};

const ArticleDetail = () => {
  // Obtenemos el ID del artículo desde la URL
  const { articleId } = useParams();

  // Utilizamos useQuery para manejar la petición del artículo.
  const {
    data: article,
    error,
    isLoading,
  } = useQuery<ArticleData>({
    queryKey: ["article", articleId],
    queryFn: () => {
      if (!articleId) throw new Error("ID de artículo faltante");
      return fetchArticle(articleId);
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Referencia para la animación de tipeo
  const contentRef = useRef<HTMLParagraphElement>(null);
  const typingTimeout = useRef<number | null>(null);

  // Efecto para la animación tipo máquina de escribir
  useEffect(() => {
    if (!article || isLoading || !contentRef.current || !article.content) return;
    let index = 0;
    const text = article.content;
    const type = () => {
      if (contentRef.current) {
        contentRef.current.innerHTML = text.slice(0, index);
        index++;
        if (index <= text.length) {
          typingTimeout.current = window.setTimeout(type, 15);
        }
      }
    };
    typingTimeout.current = window.setTimeout(type, 300);
    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, [article, isLoading]);

  // Función para formatear fechas
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Header />
      <div className="detail-page">
        <div className="detail-layout">
          <motion.div
            className="detail-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {isLoading ? (
              <div className="spinner-wrapper">
                <Spinner
                  animation="border"
                  role="status"
                  variant="danger"
                  style={{ width: 70, height: 70 }}
                >
                  <span className="visually-hidden">Cargando artículo...</span>
                </Spinner>
              </div>
            ) : error || !article ? (
              <div className="detail-error">
                <h1>Error</h1>
                <p>{(error as Error)?.message || "Artículo no encontrado"}</p>
              </div>
            ) : (
              <>
                <h1 className="detail-title">{article.title}</h1>
                <Tilt
                  tiltMaxAngleX={5}
                  tiltMaxAngleY={5}
                  glareEnable
                  glareMaxOpacity={0.3}
                  glareColor="transparent"
                  glarePosition="all"
                  className="detail-image-tilt"
                >
                <img
                  src={article.image ? article.image : "https://via.placeholder.com/300x200?text=Sin+Imagen"}
                  className="detail-image"
                  alt={article.title}
                  loading="lazy"
                />
                </Tilt>
                <p className="detail-content" ref={contentRef}></p>
                {article.category && (
                  <p className="cd-category">
                    <strong>Categoría:</strong> {article.category}
                  </p>
                )}
                <p className="ad-meta">
                  Por {article.author} | Publicado:{" "}
                  {formatDate(article.created_at)}
                </p>
                {article.updated_at && (
                  <p className="ad-updated">
                    <strong>Última actualización:</strong> {formatDate(article.updated_at)}
                  </p>
                )}
              </>
            )}
          </motion.div>
          <div className="sidebar-container">
            <Sidebar />
          </div>
        </div>
        <CallToAction />
      </div>
      <Footer />
    </>
  );
};

export default ArticleDetail;
