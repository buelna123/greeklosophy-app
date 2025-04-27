// src/components/admin/modals/AssignmentModal.tsx

import React, { useEffect, useMemo, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api";
import { Assignment } from "../AdminAssignments";

interface Course {
  id: number;
  title: string;
}

interface AssignmentModalProps {
  show: boolean;
  onHide: () => void;
  editingAssignment?: Assignment | null;
  onSuccess: () => void;
}

interface FormValues {
  course: { value: number; label: string } | null;
  title: string;
  description: string;
  due_date: string;
}

interface APIResponse {
  success?: string;
  error?: string;
  assignment?: Assignment;
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({
  show,
  onHide,
  editingAssignment,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      course: null,
      title: "",
      description: "",
      due_date: "",
    },
  });

  const [selectedCourse, setSelectedCourse] = useState<{ value: number; label: string } | null>(null);

  const { data: coursesRaw = [], isLoading: loadingCourses } = useQuery<Course[]>({
    queryKey: ["adminCoursesList"],
    queryFn: async () => {
      const res = await api.get<{ data: Course[] }>("/courses");
      return res.data.data;
    },
  });

  const courseOptions = useMemo(() => {
    return coursesRaw.map(c => ({ value: c.id, label: c.title }));
  }, [coursesRaw]);

  useEffect(() => {
    if (!show) return;

    if (editingAssignment) {
      const selected = courseOptions.find(opt => opt.value === editingAssignment.course_id) || null;
      setSelectedCourse(selected);

      reset({
        course: selected,
        title: editingAssignment.title,
        description: editingAssignment.description,
        due_date: editingAssignment.due_date ?? "",
      });
    } else {
      setSelectedCourse(null);
      reset({
        course: null,
        title: "",
        description: "",
        due_date: "",
      });
    }
  }, [show, editingAssignment, reset, courseOptions]);

  const mutation = useMutation<APIResponse, Error, FormData>(async formData => {
    let response;
    if (editingAssignment?.id) {
      formData.append("_method", "PUT");
      response = await api.post<APIResponse>(`/admin/assignments/${editingAssignment.id}`, formData);
    } else {
      response = await api.post<APIResponse>(`/admin/assignments`, formData);
    }
    return response.data;
  }, {
    onSuccess: data => {
      if (data.success) {
        toast.success(data.success);
        queryClient.invalidateQueries(["adminAssignments"]);
        onHide();
        onSuccess();
      } else {
        toast.error(data.error || "Error desconocido.");
      }
    },
    onError: error => {
      toast.error(error.message || "Error al guardar la asignación.");
    },
  });

  const onSubmit = (data: FormValues) => {
    if (!data.course) {
      toast.error("Selecciona un curso.");
      return;
    }

    const formData = new FormData();
    formData.append("course_id", data.course.value.toString());
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (data.due_date) formData.append("due_date", data.due_date);

    mutation.mutate(formData);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{editingAssignment ? "Editar Asignación" : "Crear Asignación"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loadingCourses ? (
          <div className="text-center my-3">
            <Spinner animation="border" />
          </div>
        ) : (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Curso</Form.Label>
              <Controller
                name="course"
                control={control}
                rules={{ required: "Curso obligatorio" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={courseOptions}
                    value={selectedCourse}
                    onChange={(opt) => {
                      field.onChange(opt);
                      setSelectedCourse(opt);
                    }}
                    placeholder="Selecciona un curso"
                  />
                )}
              />
              {errors.course && <Form.Text className="text-danger">{errors.course.message}</Form.Text>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                {...register("title", { required: "El título es obligatorio" })}
                isInvalid={!!errors.title}
              />
              <Form.Control.Feedback type="invalid">
                {errors.title?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                {...register("description", { required: "La descripción es obligatoria" })}
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fecha de entrega (opcional)</Form.Label>
              <Form.Control
                type="date"
                {...register("due_date")}
              />
            </Form.Group>

            <div className="text-end">
              <Button variant="primary" type="submit" disabled={mutation.isLoading}>
                {mutation.isLoading
                  ? "Guardando..."
                  : editingAssignment
                  ? "Actualizar Asignación"
                  : "Crear Asignación"}
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default AssignmentModal;
