import React, { useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api";

interface QuizModalProps {
  topicId: number;
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  initialQuestions: {
    question_text: string;
    points: number;
    quizOptions: { option_text: string; is_correct: boolean }[];
  }[];
}

interface OptionInput {
  option_text: string;
  is_correct: boolean;
}

interface QuestionInput {
  question_text: string;
  points: number;
  options: OptionInput[];
}

interface FormValues {
  questions: QuestionInput[];
}

const QuizModal: React.FC<QuizModalProps> = ({
  topicId,
  show,
  onHide,
  onSuccess,
  initialQuestions,
}) => {
  const queryClient = useQueryClient();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { questions: [] },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "questions",
  });

  useEffect(() => {
    if (show) {
      const transformed = initialQuestions.map((q) => ({
        question_text: q.question_text,
        points: Number(q.points),
        options: q.quizOptions.map((o) => ({
          option_text: o.option_text,
          is_correct: !!o.is_correct,
        })),
      }));
      reset({ questions: transformed });
    }
  }, [initialQuestions, show, reset]);

  const mutation = useMutation({
    mutationFn: async (payload: FormValues) => {
      return api.put(`/topic-quizzes/${topicId}`, {
        questions: payload.questions.map((q) => ({
          question_text: q.question_text,
          points: Number(q.points),
          options: q.options.map((opt) => ({
            option_text: opt.option_text,
            is_correct: !!opt.is_correct,
          })),
        })),
      });
    },
    onSuccess: () => {
      toast.success("Quiz actualizado");
      queryClient.invalidateQueries({ queryKey: ["adminQuizzes"] });
      onHide();
      onSuccess();
    },
    onError: (err: any) => {
      console.error("Error al guardar:", err);
      toast.error(err.response?.data?.error || "Error al guardar");
    },
  });

  const onSubmit = (data: FormValues) => {
    if (data.questions.length === 0) {
      toast.error("Agrega al menos una pregunta");
      return;
    }
    mutation.mutate(data);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Quiz</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {questionFields.map((question, qIdx) => (
            <div key={question.id} className="mb-4 border p-3 rounded">
              <Row className="mb-2">
                <Col md={9}>
                  <Form.Label>Pregunta {qIdx + 1}</Form.Label>
                  <Form.Control
                    type="text"
                    {...register(`questions.${qIdx}.question_text`, {
                      required: "La pregunta es obligatoria",
                    })}
                    isInvalid={!!errors.questions?.[qIdx]?.question_text}
                  />
                  {errors.questions?.[qIdx]?.question_text && (
                    <Form.Text className="text-danger">
                      {errors.questions[qIdx].question_text?.message}
                    </Form.Text>
                  )}
                </Col>
                <Col md={2}>
                  <Form.Label>Puntos</Form.Label>
                  <Form.Control
                    type="number"
                    {...register(`questions.${qIdx}.points`, {
                      required: "Puntos requeridos",
                      min: { value: 1, message: "Mínimo 1 punto" },
                      valueAsNumber: true,
                    })}
                    isInvalid={!!errors.questions?.[qIdx]?.points}
                  />
                  {errors.questions?.[qIdx]?.points && (
                    <Form.Control.Feedback type="invalid">
                      {errors.questions[qIdx].points?.message}
                    </Form.Control.Feedback>
                  )}
                </Col>
                <Col md={1} className="d-flex align-items-end">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeQuestion(qIdx)}
                    title="Eliminar pregunta"
                  >
                    🗑
                  </Button>
                </Col>
              </Row>

              <Form.Label>Opciones</Form.Label>
              <OptionGroup
                control={control}
                register={register}
                errors={errors}
                questionIndex={qIdx}
              />
            </div>
          ))}

          <div className="d-grid gap-2">
            <Button
              variant="outline-secondary"
              onClick={() =>
                appendQuestion({
                  question_text: "",
                  points: 1,
                  options: [
                    { option_text: "", is_correct: false },
                    { option_text: "", is_correct: false },
                  ],
                })
              }
            >
              + Agregar pregunta
            </Button>
            <Button type="submit" variant="primary" disabled={mutation.isLoading}>
              {mutation.isLoading ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default QuizModal;

const OptionGroup = ({
  control,
  register,
  errors,
  questionIndex,
}: {
  control: any;
  register: any;
  errors: any;
  questionIndex: number;
}) => {
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  return (
    <>
      {optionFields.map((option, oIdx) => (
        <Row key={option.id} className="mb-2 align-items-center">
          <Col md={7}>
            <Form.Control
              type="text"
              placeholder={`Opción ${oIdx + 1}`}
              {...register(`questions.${questionIndex}.options.${oIdx}.option_text`, {
                required: "Texto requerido",
              })}
              isInvalid={
                !!errors.questions?.[questionIndex]?.options?.[oIdx]?.option_text
              }
            />
          </Col>
          <Col md={3}>
            <Form.Check
              type="checkbox"
              label="Correcta"
              {...register(`questions.${questionIndex}.options.${oIdx}.is_correct`)}
            />
          </Col>
          <Col md={2}>
            <Button
              size="sm"
              variant="outline-danger"
              onClick={() => {
                if (optionFields.length <= 2) {
                  toast.warning("Debe haber al menos dos opciones");
                  return;
                }
                removeOption(oIdx);
              }}
            >
              Eliminar
            </Button>
          </Col>
        </Row>
      ))}
      <Button
        variant="secondary"
        size="sm"
        className="mt-2"
        onClick={() => appendOption({ option_text: "", is_correct: false })}
      >
        + Agregar opción
      </Button>
    </>
  );
};
