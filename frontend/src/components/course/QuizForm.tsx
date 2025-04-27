import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Alert,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useCourseContext } from "@/context/CourseContext";
import api from "@/api";
import "@/styles/CourseExperience.css";
import { FaCheckCircle } from "react-icons/fa";
import type { AxiosError } from "axios/index";

// Interfaces
interface QuizOption {
  id: number;
  option_text: string;
  is_correct: boolean;
}

interface QuizQuestion {
  id: number;
  topic_id: number;
  question_text: string;
  points: number;
  quizOptions: QuizOption[];
}

interface QuizSubmitResponse {
  total_score: number;
}

// Estado local persistente por sesión
const localCompletedTopics = new Set<number>();
const topicsSubmitting = new Set<number>();

const QuizForm: React.FC = () => {
  const { id: courseId, topicId } = useParams<{ id: string; topicId: string }>();
  const {
    topics,
    quizQuestions,
    quizProgressByTopic,
    quizScoresByTopic,
  } = useCourseContext();

  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement>(null);

  const [responses, setResponses] = useState<{ [key: number]: number }>({});
  const [submitError, setSubmitError] = useState<string>("");
  const [buttonPending, setButtonPending] = useState(false); // ← spinner embebido en botón

  const topic = topics.find((t) => t.id.toString() === topicId);
  const topicIdNumber = Number(topicId);

  const scoreFromBackend = quizScoresByTopic[topicIdNumber] ?? null;
  const isCompletedLocally = localCompletedTopics.has(topicIdNumber);
  const isSending = topicsSubmitting.has(topicIdNumber);

  const shouldShowFinalMessage = scoreFromBackend !== null || isCompletedLocally;
  const shouldShowSpinner = isSending || (scoreFromBackend === null && isCompletedLocally);

  const filteredQuestions = useMemo(() => {
    return quizQuestions.filter((q) => q.topic_id === topicIdNumber);
  }, [quizQuestions, topicIdNumber]);

  useEffect(() => {
    setResponses({});
    setSubmitError("");
    setButtonPending(false);
  }, [topicIdNumber]);

  const handleOptionChange = useCallback(
    (questionId: number, optionId: number) => {
      if (shouldShowFinalMessage || shouldShowSpinner) return;
      setResponses((prev) => ({ ...prev, [questionId]: optionId }));
    },
    [shouldShowFinalMessage, shouldShowSpinner]
  );

  const mutation = useMutation<QuizSubmitResponse, AxiosError, { responses: any }>(
    async (payload) => {
      topicsSubmitting.add(topicIdNumber);
      setButtonPending(true);
      const res = await api.post<QuizSubmitResponse>(
        `/courses/${courseId}/topics/${topicId}/quiz/submit`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      return res.data;
    },
    {
      onSuccess: (data) => {
        localCompletedTopics.add(topicIdNumber);
        topicsSubmitting.delete(topicIdNumber);
        queryClient.invalidateQueries(["courseExperienceData", courseId]);
        queryClient.refetchQueries(["courseExperienceData", courseId]);
        setSubmitError("");
        setResponses({});
        setButtonPending(false);
      },
      onError: (err) => {
        topicsSubmitting.delete(topicIdNumber);
        setButtonPending(false);
        const error = err as AxiosError<any>;
        if (error.response?.data?.error) {
          setSubmitError(error.response.data.error);
        } else if (error.message) {
          setSubmitError(error.message);
        } else {
          setSubmitError("Error desconocido al enviar el quiz");
        }
      },
    }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (shouldShowFinalMessage || shouldShowSpinner || buttonPending) {
      return;
    }
    if (filteredQuestions.length === 0) {
      setSubmitError("No hay preguntas en el quiz");
      return;
    }
    for (const question of filteredQuestions) {
      if (responses[question.id] === undefined) {
        setSubmitError(`Por favor, responde la pregunta ${question.id}`);
        return;
      }
    }
    setSubmitError("");
    const payload = {
      responses: Object.entries(responses).map(([questionId, selected_option_id]) => ({
        question_id: Number(questionId),
        selected_option_id,
      })),
    };
    mutation.mutate(payload);
  };

  if (!topic) {
    return (
      <Container className="course-experience-container">
        <Alert variant="danger">Tema no encontrado.</Alert>
      </Container>
    );
  }

  return (
    <Container className="course-experience-container" ref={containerRef} key={topicId}>
      <h2 className="mb-4">Quiz: {topic.title}</h2>

      {shouldShowSpinner ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : shouldShowFinalMessage ? (
        <Alert variant="success" className="d-flex align-items-center gap-2">
          <FaCheckCircle />
          Ha enviado el quiz. Gracias.
          {scoreFromBackend !== null && (
            <span className="ms-2">
              <strong>Puntuación:</strong> {scoreFromBackend} puntos
            </span>
          )}
        </Alert>
      ) : (
        <Form onSubmit={handleSubmit}>
          {filteredQuestions.map((question) => (
            <div key={question.id} className="mb-4">
              <h5>{question.question_text} (Puntos: {question.points})</h5>
              <Row>
                {question.quizOptions.map((option) => (
                  <Col md={6} key={option.id} className="mb-2">
                    <Form.Check
                      type="radio"
                      name={`question-${question.id}`}
                      id={`option-${option.id}`}
                      label={option.option_text}
                      value={option.id}
                      checked={responses[question.id] === option.id}
                      onChange={() => handleOptionChange(question.id, option.id)}
                      disabled={shouldShowFinalMessage || shouldShowSpinner}
                    />
                  </Col>
                ))}
              </Row>
            </div>
          ))}
          {submitError && <Alert variant="danger">{submitError}</Alert>}
          <Button
            variant="primary"
            type="submit"
            disabled={shouldShowFinalMessage || shouldShowSpinner || buttonPending}
            className="btn-primary"
          >
            {buttonPending ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Enviando...
              </>
            ) : (
              "Enviar Quiz"
            )}
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default QuizForm;
