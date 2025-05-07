import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { CallToAction } from "../components/CallToAction";
import { useParams, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { ModalProfile } from "../components/ModalProfile";
import { Spinner, Button } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
import "../styles/DetailPage.css";

interface CourseData {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  created_at: string;
  updated_at?: string;
}

// Función para obtener el curso vía API
const fetchCourse = async (courseId: string): Promise<CourseData> => {
  const response = await api.get<CourseData>(`/courses/${courseId}`);
  return response.data;
};

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);

  // Obtiene el curso con React Query
  const { data: course, error, isLoading } = useQuery<CourseData>({
    queryKey: ["course", id],
    queryFn: () => {
      if (!id) throw new Error("ID de curso faltante");
      return fetchCourse(id);
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  // Referencia para animación de tipeo en la descripción
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const typingTimeout = useRef<number | null>(null);

  useEffect(() => {
    if (!course || isLoading || !descriptionRef.current || !course.description) return;
    let index = 0;
    const text = course.description;
    const type = () => {
      if (descriptionRef.current) {
        descriptionRef.current.innerHTML = text.slice(0, index);
        index++;
        if (index <= text.length) {
          typingTimeout.current = window.setTimeout(type, 0.1);
        }
      }
    };
    typingTimeout.current = window.setTimeout(type, 300);
    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, [course, isLoading]);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Función para autoinscribir al curso. 
  // Se llama al endpoint progress/update; se debe configurar en el backend o en el middleware para permitir autoinscripción.
  const autoEnroll = async (courseId: string): Promise<void> => {
    try {
      await api.post(`/courses/${courseId}/progress/update`, { progress: 0 });
    } catch (error: any) {
      console.error("Error autoinscribiendo el curso:", error);
      throw error;
    }
  };

  // Manejar la acción del botón
  const handleClick = async () => {
    if (user) {
      setEnrollLoading(true);
      try {
        // Intentar autoinscribir. Se espera que este endpoint cree o actualice el registro.
        await autoEnroll(id as string);
        // Luego redirige a la experiencia extendida del curso
        navigate(`/course-experience/${id}`);
      } catch (err: any) {
        // Si recibimos 403, indica que aún no se creó el registro, entonces tratar de crear uno.
        if (err.response && err.response.status === 403) {
          try {
            await api.post(`/courses/${id}/progress/update`, { progress: 0 });
            navigate(`/course-experience/${id}`);
          } catch (err2) {
            console.error("Error autoinscribiendo tras 403:", err2);
          }
        }
      } finally {
        setEnrollLoading(false);
      }
    } else {
      setShowProfileModal(true);
    }
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
            {isLoading || authLoading ? (
              <div className="spinner-wrapper">
                <Spinner
                  animation="border"
                  role="status"
                  variant="danger"
                  style={{ width: 70, height: 70 }}
                >
                  <span className="visually-hidden">Cargando curso...</span>
                </Spinner>
              </div>
            ) : error || !course ? (
              <div className="detail-error">
                <h1>Error</h1>
                <p>{(error as Error)?.message || "Curso no encontrado"}</p>
              </div>
            ) : (
              <>
                <h1 className="detail-title">{course.title}</h1>
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
                  src={course.image ? course.image : "https://via.placeholder.com/300x200?text=Sin+Imagen"}
                  className="detail-image"
                  alt={course.title}
                  loading="lazy"
                />
                </Tilt>
                <p className="detail-content" ref={descriptionRef}></p>
                {course.category && (
                  <p className="cd-category">
                    <strong>Categoría:</strong> {course.category}
                  </p>
                )}
                <p className="ad-meta">
                  Publicado: {formatDate(course.created_at)}
                </p>
                {course.updated_at && (
                  <p className="cd-updated">
                    <strong>Última actualización:</strong> {formatDate(course.updated_at)}
                  </p>
                )}
                <button className="detail-button" onClick={handleClick}>
                  {enrollLoading ? (
                    <Spinner
                      animation="border"
                      role="status"
                      size="sm"
                      variant="light"
                    >
                      <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                  ) : user ? (
                    "Iniciar curso"
                  ) : (
                    "Inscribirse"
                  )}
                </button>
              </>
            )}
          </motion.div>
          <div className="sidebar-container">
            <Sidebar onDataLoaded={() => {}} />
          </div>
        </div>
        <CallToAction />
      </div>
      <Footer />
      <ModalProfile show={showProfileModal} onHide={() => setShowProfileModal(false)} />
    </>
  );
};

export default CourseDetail;
