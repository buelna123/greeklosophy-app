import React from "react";
import {
  Container,
  Row,
  Col,
  Nav,
  Spinner,
  Alert,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CallToAction } from "@/components/CallToAction";
import { Outlet, useParams, useLocation, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import "@/styles/CourseExperience.css";
import { useCourseExperienceData } from "@/hooks/useCourseExperienceData";
import { CourseContext } from "@/context/CourseContext";
import {
  FaCheckCircle,
  FaBookOpen,
  FaPen,
  FaCircle,
} from "react-icons/fa";

const CourseExperience: React.FC = () => {
  const { id } = useParams();
  const courseId = id as string;
  const basePath = `/course-experience/${courseId}`;
  const location = useLocation();

  const { data, isLoading, error } = useCourseExperienceData(courseId);

  if (isLoading) {
    return (
      <>
        <Header />
        <Container className="course-experience-container text-center my-5">
          <Spinner animation="border" variant="primary" />
        </Container>
        <Footer />
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <Header />
        <Container className="course-experience-container">
          <Alert variant="danger">
            {(error as Error)?.message || "Error al cargar los datos del curso."}
          </Alert>
        </Container>
        <Footer />
      </>
    );
  }

  const {
    course,
    topics,
    assignments,
    quizProgressByTopic,
    examUnlocked,
    progressPercent,
    totalQuizzes,
    completedQuizzes,
  } = data;

  const assignmentId = assignments.length > 0 ? assignments[0].id : null;
  const assignmentsLink = assignmentId
    ? `${basePath}/assignments/${assignmentId}`
    : `${basePath}/assignments`;

  const isActivePath = (targetPath: string | RegExp) =>
    typeof targetPath === "string"
      ? location.pathname === targetPath
      : targetPath.test(location.pathname);

  const isQuizRoute = location.pathname.includes("/quiz");

  return (
    <>
      <Header />
      <CourseContext.Provider value={data}>
        <Container className="course-experience-container">
          <h1>{course.title}</h1>
          <p className="text-muted mb-3">
            Avance actual: <strong>{Math.round(progressPercent)}%</strong>{" "}
            {totalQuizzes !== undefined && completedQuizzes !== undefined && (
              <span className="text-muted small">
                ({completedQuizzes}/{totalQuizzes} quizzes completados)
              </span>
            )}
          </p>
          <Row className="mt-4">
            <Col md={3}>
              <Nav variant="pills" className="flex-column sidebar-nav">
                {/* Temas */}
                <Nav.Item>
                  <Nav.Link
                    as={NavLink}
                    to={`${basePath}/topics`}
                    className={
                      !isQuizRoute &&
                      isActivePath(new RegExp(`^${basePath}/topics(?:/\\d+)?$`))
                        ? "custom-nav-link active"
                        : "custom-nav-link"
                    }
                  >
                    <FaBookOpen className="me-2" />
                    Temas
                  </Nav.Link>
                </Nav.Item>

                {/* Quizzes encabezado */}
                <Nav.Item className="mt-3 mb-1 text-muted" style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                  <FaPen className="me-2" />
                  Quizzes
                </Nav.Item>

                {/* Quizzes individuales */}
                {topics.map((topic) => (
                  <Nav.Item key={topic.id}>
                    <OverlayTrigger
                      placement="right"
                      overlay={<Tooltip id={`tooltip-quiz-${topic.id}`}>{topic.title}</Tooltip>}
                    >
                      <Nav.Link
                        as={NavLink}
                        to={`${basePath}/topics/${topic.id}/quiz`}
                        className={
                          location.pathname === `${basePath}/topics/${topic.id}/quiz`
                            ? "quiz-subitem active d-flex justify-content-between align-items-center"
                            : "quiz-subitem d-flex justify-content-between align-items-center"
                        }
                      >
                        <span className="text-truncate" style={{ maxWidth: "75%" }}>
                          {topic.title}
                        </span>
                        {quizProgressByTopic[topic.id] ? (
                          <FaCheckCircle size={16} color="green" />
                        ) : (
                          <FaCircle size={10} color="#ccc" />
                        )}
                      </Nav.Link>
                    </OverlayTrigger>
                  </Nav.Item>
                ))}

                {/* Tareas */}
                {assignmentId && (
                  <Nav.Item className="mt-3">
                    <Nav.Link
                      as={NavLink}
                      to={assignmentsLink}
                      className={
                        !isQuizRoute &&
                        isActivePath(new RegExp(`^${basePath}/assignments(?:/\\d+)?$`))
                          ? "custom-nav-link active"
                          : "custom-nav-link"
                      }
                    >
                      Tareas
                    </Nav.Link>
                  </Nav.Item>
                )}

                {/* Examen */}
                <Nav.Item>
                  <OverlayTrigger
                    placement="right"
                    overlay={
                      !examUnlocked ? (
                        <Tooltip id="tooltip-exam-disabled">
                          Debes completar Quiz y Tarea
                        </Tooltip>
                      ) : <></>
                    }
                  >
                    <div>
                      <Nav.Link
                        as={NavLink}
                        to={`${basePath}/exam`}
                        disabled={!examUnlocked}
                        className={
                          examUnlocked && isActivePath(`${basePath}/exam`)
                            ? "custom-nav-link active"
                            : "custom-nav-link"
                        }
                        style={!examUnlocked ? { pointerEvents: "none", opacity: 0.5 } : {}}
                      >
                        Examen
                      </Nav.Link>
                    </div>
                  </OverlayTrigger>
                </Nav.Item>

                {/* Progreso */}
                <Nav.Item>
                  <Nav.Link
                    as={NavLink}
                    to={`${basePath}/progress`}
                    className={
                      isActivePath(`${basePath}/progress`)
                        ? "custom-nav-link active"
                        : "custom-nav-link"
                    }
                  >
                    Progreso
                  </Nav.Link>
                </Nav.Item>

                {/* Medallas */}
                <Nav.Item>
                  <Nav.Link
                    as={NavLink}
                    to={`${basePath}/badges`}
                    className={
                      isActivePath(`${basePath}/badges`)
                        ? "custom-nav-link active"
                        : "custom-nav-link"
                    }
                  >
                    Medallas
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>

            {/* Contenido dinámico */}
            <Col md={9}>
              <div className="content-area uniform-card">
                <Outlet />
              </div>
            </Col>
          </Row>
        </Container>
      </CourseContext.Provider>
      <CallToAction />
      <Footer />
    </>
  );
};

export default CourseExperience;
