import { memo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, Badge, Spinner } from "react-bootstrap";
import { FaFire, FaCalendarAlt, FaUser } from "react-icons/fa";
import { useQueries } from "@tanstack/react-query";
import api from "@/api";
import "../styles/sidebar.css";

interface Article {
  id: number;
  title: string;
  author: string;
}

interface SidebarProps {
  onDataLoaded?: () => void;
}

const Sidebar = ({ onDataLoaded }: SidebarProps) => {
  // Ejecutar tres queries simultáneas para artículos, autores y categorías
  const results = useQueries({
    queries: [
      {
        queryKey: ["trendingArticles"],
        queryFn: async () => {
          const response = await api.get<{ data: Article[] }>("/articles");
          // Tomamos solo los primeros 3 artículos para la sección en tendencia
          return response.data.data.slice(0, 3);
        },
        staleTime: 1000 * 60 * 5, // 5 minutos
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["authors"],
        queryFn: async () => {
          const response = await api.get<string[]>("/authors");
          return response.data;
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["categories"],
        queryFn: async () => {
          const response = await api.get<string[]>("/categories");
          return response.data;
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
      }
    ]
  });

  // Extraer datos de cada query; si alguna no está disponible, se asigna un arreglo vacío
  const trending = results[0].data || [];
  const autores = results[1].data || [];
  const categorias = results[2].data || [];
  
  // Determinar el estado de carga general del sidebar
  const loadingSidebar = results.some((query) => query.isLoading);

  // Notificar cuando se han cargado todos los datos
  if (!loadingSidebar && onDataLoaded) {
    onDataLoaded();
  }
  
  // Obtener parámetros de filtrado desde la URL
  const [searchParams] = useSearchParams();
  const categoriaActiva = searchParams.get("categoria")?.toLowerCase();
  const autorActivo = searchParams.get("autor")?.toLowerCase();
  const fechaActiva = searchParams.get("fecha")?.toLowerCase();

  return (
    <div className="sidebar-articulos">
      <Card className="mb-4 shadow-sm sidebar-single-card">
        <Card.Body>
          {loadingSidebar ? (
            <div className="d-flex justify-content-center align-items-center sidebar-loading-height">
              <Spinner animation="border" variant="danger" />
            </div>
          ) : (
            <>
              {/* Sección de Categorías */}
              <div className="sidebar-section">
                <Card.Title className="text-danger mb-3">📂 Categorías</Card.Title>
                <div className="d-flex flex-wrap gap-2">
                  {categorias.map((cat, idx) => {
                    const isActive = categoriaActiva === cat.toLowerCase();
                    return (
                      <Badge
                        bg="light"
                        text="dark"
                        key={idx}
                        className={`sidebar-badge ${isActive ? "active-filter" : ""}`}
                      >
                        <Link to={`/articles?categoria=${encodeURIComponent(cat)}`}>
                          {cat}
                        </Link>
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* Sección de Autores Populares */}
              <div className="sidebar-section">
                <Card.Title className="text-danger mb-3">
                  <FaUser className="me-2" />
                  Autores Populares
                </Card.Title>
                <ul className="list-unstyled mb-0">
                  {autores.map((autor, idx) => {
                    const isActive = autorActivo === autor.toLowerCase();
                    return (
                      <li key={idx}>
                        <Link
                          to={`/articles?autor=${encodeURIComponent(autor)}`}
                          className={isActive ? "active-filter" : ""}
                        >
                          {autor}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Sección de Artículos en Tendencia */}
              <div className="sidebar-section">
                <Card.Title className="text-danger mb-3">
                  <FaFire className="me-2" />
                  En Tendencia
                </Card.Title>
                <ul className="list-unstyled mb-0">
                  {trending.map((art) => (
                    <li key={art.id}>
                      <Link to={`/articles/${art.id}`}>{art.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sección para Filtrar por Fecha */}
              <div className="sidebar-section">
                <Card.Title className="text-danger mb-3">
                  <FaCalendarAlt className="me-2" />
                  Filtrar por Fecha
                </Card.Title>
                <ul className="list-unstyled mb-0">
                  {["semana", "mes", "año"].map((fecha) => (
                    <li key={fecha}>
                      <Link
                        to={`/articles?fecha=${fecha}`}
                        className={fechaActiva === fecha ? "active-filter" : ""}
                      >
                        {fecha === "semana"
                          ? "Última semana"
                          : fecha === "mes"
                          ? "Último mes"
                          : "Último año"}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default memo(Sidebar);
