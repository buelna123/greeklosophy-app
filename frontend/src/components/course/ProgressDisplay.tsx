import React from "react";
import {
  Container,
  Card,
  ProgressBar as RBProgressBar,
  ListGroup,
} from "react-bootstrap";
import { motion } from "framer-motion";
import { FaCheckCircle, FaHourglassHalf } from "react-icons/fa";
import "@/styles/CourseExperience.css";
import { useCourseContext } from "@/context/CourseContext";

const ProgressDisplay: React.FC = () => {
  const {
    quizSubmitted,
    assignmentSubmitted,
    examSubmitted,
    progressPercent,
  } = useCourseContext();

  const progressValue = Math.round(progressPercent);

  let progressVariant = "danger";
  if (progressValue === 100) progressVariant = "success";
  else if (progressValue >= 66) progressVariant = "info";
  else if (progressValue >= 33) progressVariant = "warning";

  const statusList = [
    { label: "Quizzes completados", done: quizSubmitted },
    { label: "Tarea entregada", done: assignmentSubmitted },
    { label: "Examen enviado", done: examSubmitted },
  ];

  return (
    <Container className="course-experience-container">
      <motion.h2
        className="mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Progreso del Curso
      </motion.h2>

      <Card className="content-area uniform-card mb-3">
        <Card.Body>
          <Card.Title>Avance del Curso</Card.Title>
          <RBProgressBar
            now={progressValue}
            label={`${progressValue}%`}
            animated
            variant={progressVariant}
            className="mb-3"
          />
        </Card.Body>

        <Card.Footer className="card-footer">
          <h5 className="mb-3">Elementos completados:</h5>
          <ListGroup>
            {statusList.map(({ label, done }) => (
              <ListGroup.Item
                key={label}
                className="d-flex align-items-center gap-2"
              >
                {done ? (
                  <FaCheckCircle color="green" />
                ) : (
                  <FaHourglassHalf color="gray" />
                )}
                {label}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default ProgressDisplay;
