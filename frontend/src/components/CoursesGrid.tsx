import React from "react";
import { Spinner } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import CourseCard from "./CourseCard";
import api from "@/api";
import "../styles/CoursesGrid.css";

// Definición actualizada de la interfaz Course (puedes importar esta interfaz desde tu archivo de tipos globales si lo deseas)
export interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  tags?: string;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
}

export function CoursesGrid() {
  // Utilizamos React Query para obtener los cursos
  const { data, isLoading, isError, error } = useQuery<Course[]>({
    queryKey: ["coursesGrid"],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Course>>("/courses");
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="spinner-wrapper text-center my-5">
        <Spinner animation="border" role="status" variant="danger">
          <span className="visually-hidden">Cargando cursos...</span>
        </Spinner>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="error text-center my-5">
        <h1>Error</h1>
        <p>{(error as Error)?.message || "Error al cargar cursos"}</p>
      </div>
    );
  }

  // Ordenamos los cursos por fecha de creación (de más reciente a más antiguo)
  const sortedCourses = data!.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="homepage-courses">
      <h2 className="homepage-courses-title">Últimos Cursos</h2>
      <div className="homepage-courses-container">
        {sortedCourses.slice(0, 3).map((course) => (
          <div key={course.id} className="homepage-course-card">
            <CourseCard course={course} />
          </div>
        ))}
      </div>
    </div>
  );
}
