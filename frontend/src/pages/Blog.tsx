import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Image,
  Button,
  Spinner,
} from "react-bootstrap";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { CallToAction } from "../components/CallToAction";
import { useSearchParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/Blog.css";
import "../styles/sidebar.css";
import { Article } from "@/types";
import { useArticlesQuery } from "@/hooks/useArticles";

const Blog = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  // Usamos React Query para obtener los artículos
  const { data: articles = [], isLoading, error } = useArticlesQuery();

  // Efecto para actualizar el filtrado cada vez que cambien los datos o los parámetros de búsqueda
  useEffect(() => {
    if (articles.length === 0) return;
    
    // Filtrado basado en parámetros de la URL
    const categoria = searchParams.get("categoria")?.toLowerCase() || "";
    const autor = searchParams.get("autor")?.toLowerCase() || "";
    const fecha = searchParams.get("fecha")?.toLowerCase() || "";
    const now = new Date();

    const filtrados = articles.filter((article) => {
      const matchesCategoria =
        !categoria ||
        article.title.toLowerCase().includes(categoria) ||
        article.content.toLowerCase().includes(categoria);
      const matchesAutor =
        !autor || article.author.toLowerCase() === autor;
      // Se usa updated_at si existe; de lo contrario, se usa created_at o date
      const articleDate = new Date(article.updated_at ?? article.created_at ?? article.date);
      let matchesFecha = true;
      if (fecha === "semana") {
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);
        matchesFecha = articleDate >= oneWeekAgo;
      } else if (fecha === "mes") {
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(now.getMonth() - 1);
        matchesFecha = articleDate >= oneMonthAgo;
      } else if (fecha === "año") {
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        matchesFecha = articleDate >= oneYearAgo;
      }
      return matchesCategoria && matchesAutor && matchesFecha;
    });
    setFilteredArticles(filtrados);
  }, [articles, searchParams]);

  // Manejar búsqueda en tiempo real basada en el input
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setFilteredArticles(articles);
      return;
    }
    const query = value.toLowerCase();
    const resultados = articles.filter((article) => {
      return (
        article.title.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query) ||
        article.author.toLowerCase().includes(query)
      );
    });
    setFilteredArticles(resultados);
  };

  // Función para formatear las fechas usando updated_at si existe o fallback a created_at o date
  const formatDate = (dateStr: string | undefined, fallback: string) => {
    const date = new Date(dateStr ?? fallback);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Header />

      <Container fluid className="blog-page-container">
        <div className="blog-header-wrapper">
          <h1 className="blog-page-title">Nuestro Blog</h1>
        </div>

        <div className="blog-search-wrapper mb-4">
          <input
            type="text"
            placeholder="Buscar artículo..."
            value={searchTerm}
            onChange={handleSearch}
            className="form-control blog-search-input"
          />
        </div>

        {isLoading ? (
          <div className="spinner-wrapper text-center my-5">
            <Spinner animation="border" role="status" variant="danger">
              <span className="visually-hidden">Cargando artículos...</span>
            </Spinner>
          </div>
        ) : error ? (
          <div className="text-center text-danger">
            <h1>Error</h1>
            <p>{typeof error === 'string' ? error : "No se pudo cargar el contenido del blog."}</p>
          </div>
        ) : filteredArticles.length > 0 ? (
          <Row>
            <Col md={9}>
              <ListGroup className="blog-article-list">
                {filteredArticles.map((article) => (
                  <ListGroup.Item key={article.id} className="blog-article-item">
                      <img
                        src={article.image ? article.image : "https://via.placeholder.com/300x200?text=Sin+Imagen"}
                        className="blog-article-image"
                        alt={article.title}
                      />
                    <div className="blog-article-content">
                      <h3 className="blog-article-title">{article.title}</h3>
                      <p className="blog-article-meta">
                        Por <strong>{article.author}</strong> |{" "}
                        {formatDate(article.updated_at, article.created_at ?? article.date)}
                      </p>
                      <p className="blog-article-excerpt">
                        {article.content.substring(0, 150)}...
                      </p>
                    </div>
                    <Button
                      variant="outline-danger"
                      className="blog-article-button"
                      onClick={() => navigate(`/articles/${article.id}`)}
                    >
                      Leer más
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
            <Col md={3}>
              <Sidebar />
            </Col>
          </Row>
        ) : (
          <p className="text-center">No se encontraron artículos.</p>
        )}
      </Container>

      <CallToAction />
      <Footer />
    </>
  );
};

export default Blog;
