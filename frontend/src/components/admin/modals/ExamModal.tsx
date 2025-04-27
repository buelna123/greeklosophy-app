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
import { useMutation } from "@tanstack/react-query";
import api from "@/api";

interface ExamModalProps {
  initialData: {
    course_id: number;
    title: string;
    description: string;
    examQuestions?: {
      question_text: string;
      points: number;
      examOptions?: { option_text: string; is_correct: boolean }[];
    }[];
  };
  show: boolean;
  onHide: () => void;
  onSuccess: (updatedExam: any) => void;
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
  title: string;
  description: string;
  questions: QuestionInput[];
}

const ExamModal: React.FC<ExamModalProps> = ({
  initialData,
  show,
  onHide,
  onSuccess,
}) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      questions: [],
    },
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
    if (show && initialData) {
      const transformedQuestions = (initialData.examQuestions || []).map((q: any) => ({
        question_text: q.question_text,
        points: Number(q.points),
        options: (q.examOptions || q.exam_options || []).map((o: any) => ({
          option_text: o.option_text,
          is_correct: !!o.is_correct,
        })),
      }));

      reset({
        title: initialData.title,
        description: initialData.description,
        questions: transformedQuestions,
      });
    }
  }, [initialData, show, reset]);

  const mutation = useMutation({
    mutationFn: async (payload: FormValues) => {
      const res = await api.put<{ exam: any }>(`/course-exams/${initialData.course_id}`, {
        title: payload.title,
        description: payload.description,
        questions: payload.questions.map((q) => ({
          question_text: q.question_text,
          points: Number(q.points),
          options: q.options.map((opt) => ({
            option_text: opt.option_text,
            is_correct: !!opt.is_correct,
          })),
        })),
      });

      const updated = res.data.exam;

      // normalizar snake_case a camelCase si es necesario
      const transformed = {
        ...updated,
        examQuestions: (updated.exam_questions || []).map((q: any) => ({
          question_text: q.question_text,
          points: q.points,
          examOptions: (q.exam_options || []).map((o: any) => ({
            option_text: o.option_text,
            is_correct: !!o.is_correct,
          })),
        })),
      };

      return transformed;
    },
    onSuccess: (updatedExam) => {
      toast.success("Examen actualizado correctamente");
      onSuccess(updatedExam);
      onHide();
    },
    onError: (err: any) => {
      console.error("Error al guardar examen:", err);
      toast.error(err.response?.data?.error || "Error al guardar examen");
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
        <Modal.Title>Editar Examen</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              {...register("title", {
                required: "Título requerido",
                maxLength: { value: 255, message: "Máximo 255 caracteres" },
              })}
              isInvalid={!!errors.title}
            />
            {errors.title && (
              <Form.Control.Feedback type="invalid">
                {errors.title.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              {...register("description", {
                required: "Descripción requerida",
              })}
              isInvalid={!!errors.description}
            />
            {errors.description && (
              <Form.Control.Feedback type="invalid">
                {errors.description.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          {questionFields.map((question, qIdx) => (
            <div key={question.id} className="mb-4 border p-3 rounded">
              <Row className="mb-2">
                <Col md={9}>
                  <Form.Label>Pregunta {qIdx + 1}</Form.Label>
                  <Form.Control
                    type="text"
                    {...register(`questions.${qIdx}.question_text`, {
                      required: "Pregunta obligatoria",
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

export default ExamModal;

// Mueve OptionGroup después para que esté definido antes de ser usado
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
