import { useState, useEffect } from "react";
import { Container, Row, Spinner } from "react-bootstrap";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { CallToAction } from "../components/CallToAction";
import CourseCard from "../components/CourseCard";
import ProgressBar from "../components/ProgressBar";
import { useCoursesQuery } from "@/hooks/useCourses";
import "../styles/Courses.css";

// Importamos la interfaz del tipo Course desde @/types
import { Course } from "@/types";

const Courses = () => {
  // Obtenemos la data con React Query
  const { data: courses = [], isLoading, error } = useCoursesQuery();
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Cada vez que cambie la data (courses) se establece la lista filtrada igual a la completa
  useEffect(() => {
    setFilteredCourses(courses);
  }, [courses]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredCourses(
      courses.filter((course) => {
        const title = course.title.toLowerCase();
        const category = course.category.toLowerCase();
        return title.includes(value) || category.includes(value);
      })
    );
  };

  return (
    <>
      <Header />
      <ProgressBar />
      <Container className="courses-page-container">
        <h1 className="courses-page-title">Explora Nuestros Cursos</h1>
        {/* Barra de búsqueda usando las clases definidas en el CSS */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar curso..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        {isLoading ? (
          <div className="text-center my-5">
            <Spinner animation="border" role="status" variant="danger">
              <span className="visually-hidden">Cargando cursos...</span>
            </Spinner>
          </div>
        ) : error ? (
          <div className="courses-error">
            <h1>Error</h1>
            <p>
              {typeof error === "string"
                ? error
                : "Error desconocido al cargar los cursos."}
            </p>
          </div>
        ) : filteredCourses.length > 0 ? (
          <Row className="courses-grid">
            {filteredCourses.map((course) => (
              <div key={course.id} className="course-column">
                <CourseCard course={course} />
              </div>
            ))}
          </Row>
        ) : (
          <p className="text-center">No se encontraron cursos.</p>
        )}
      </Container>
      <CallToAction />
      <Footer />
    </>
  );
};

export default Courses;
