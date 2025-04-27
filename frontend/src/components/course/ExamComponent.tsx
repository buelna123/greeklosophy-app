// src/components/course/ExamComponent.tsx

import React, { useEffect, useState, useRef } from "react";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import api from "@/api";
import { useAuth } from "@/context/AuthContext";
import { useCourseContext } from "@/context/CourseContext";
import "@/styles/CourseExperience.css";
import { FaCheckCircle } from "react-icons/fa";

interface ExamSubmitResponse {
  message: string;
  score: number;
  max_score: number;
  passed: boolean;
}

interface SubmissionStatus {
  submitted: boolean;
  score?: number;
  passed?: boolean;
}

const localCompletedExam: Record<string, boolean> = {};
const examSubmitting: Record<string, boolean> = {};

const ExamComponent: React.FC = () => {
  const { id: courseId } = useParams<{ id: string }>();
  const { exam, quizSubmitted, assignmentSubmitted } = useCourseContext();
  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement>(null);

  const [responses, setResponses] = useState<{ [key: number]: number }>({});
  const [submitError, setSubmitError] = useState("");
  const [buttonPending, setButtonPending] = useState(false);

  const topicKey = `exam-${courseId}`;
  const isLocallyCompleted = localCompletedExam[topicKey] ?? false;
  const isBeingSent = examSubmitting[topicKey] ?? false;

  const {
    data: submissionStatus,
    isLoading: statusLoading,
    refetch: refetchSubmissionStatus,
  } = useQuery<SubmissionStatus>({
    queryKey: ["examSubmissionStatus", courseId],
    queryFn: async () => {
      const res = await api.get<SubmissionStatus>(`/courses/${courseId}/exam/submission-status`);
      return res.data;
    },
    enabled: !!courseId,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const finalScore = submissionStatus?.score ?? null;
  const passed = submissionStatus?.passed ?? false;
  const isSubmitted = submissionStatus?.submitted || isLocallyCompleted;

  const shouldShowFinalMessage = isSubmitted;
  const shouldShowSpinner = isBeingSent;

  useEffect(() => {
    setResponses({});
    setSubmitError("");
    setButtonPending(false);
  }, [courseId]);

  const handleOptionChange = (questionId: number, optionId: number) => {
    if (shouldShowFinalMessage || shouldShowSpinner) return;
    setResponses((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const mutation = useMutation<ExamSubmitResponse, any, { responses: { question_id: number; selected_option_id: number }[] }>({
    mutationFn: async (payload) => {
      examSubmitting[topicKey] = true;
      setButtonPending(true);
      const res = await api.post<ExamSubmitResponse>(
        `/courses/${courseId}/exam/submit`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      return res.data;
    },
    onSuccess: async () => {
      localCompletedExam[topicKey] = true;
      examSubmitting[topicKey] = false;
      setButtonPending(false);

      await Promise.all([
        queryClient.invalidateQueries(["examSubmissionStatus", courseId]),
        queryClient.invalidateQueries(["courseExperienceData", courseId]),
        queryClient.invalidateQueries(["allCourseExamResponses"]), // ✅ Muy importante para AdminExams
      ]);

      await refetchSubmissionStatus(); // 🔥 Para actualizar score y passed en tiempo real
    },
    onError: async (err: any) => {
      examSubmitting[topicKey] = false;
      setButtonPending(false);

      if (err.response?.status === 422) {
        localCompletedExam[topicKey] = true;
        await queryClient.invalidateQueries(["examSubmissionStatus", courseId]);
      }

      setSubmitError(err.response?.data?.error || "Error al enviar el examen.");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (shouldShowFinalMessage || shouldShowSpinner || buttonPending) return;
    if (!exam || !exam.examQuestions) return;

    for (const question of exam.examQuestions) {
      if (responses[question.id] === undefined) {
        setSubmitError(`Por favor, responde la pregunta "${question.question_text}".`);
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

  if (!quizSubmitted || !assignmentSubmitted) {
    return (
      <Container className="course-experience-container text-center my-5">
        <Alert variant="warning">
          Debes completar el <strong>Quiz</strong> y la <strong>Tarea</strong> antes de hacer el examen.
        </Alert>
      </Container>
    );
  }

  if (!exam || !exam.examQuestions) {
    return (
      <Container className="course-experience-container text-center my-5">
        <Alert variant="warning">No se encontró examen para este curso.</Alert>
      </Container>
    );
  }

  return (
    <Container className="course-experience-container" ref={containerRef}>
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="mb-4">
        {exam.title}
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
        {exam.description}
      </motion.p>

      {statusLoading || shouldShowSpinner ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : shouldShowFinalMessage ? (
        <Alert variant="success" className="d-flex align-items-center gap-2">
          <FaCheckCircle />
          Examen enviado. Puntos obtenidos: <strong>{finalScore}</strong> 
          {passed ? " ✔️ Aprobado" : " ❌ No aprobado"}
        </Alert>
      ) : (
        <Form onSubmit={handleSubmit}>
          {exam.examQuestions.map((question) => (
            <div key={question.id} className="mb-4">
              <motion.h5 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                {question.question_text} (Puntos: {question.points})
              </motion.h5>
              <Row>
                {question.examOptions.map((option) => (
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
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Enviando...
              </>
            ) : (
              "Enviar Examen"
            )}
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default ExamComponent;
