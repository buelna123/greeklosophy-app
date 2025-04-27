// src/components/admin/modals/TopicModal.tsx

import React, { useEffect, useMemo, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";
import api from "@/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Topic {
  id: number;
  course_id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface Course {
  id: number;
  title: string;
}

interface TopicModalProps {
  show: boolean;
  onHide: () => void;
  editingTopic?: Topic | null;
  onSuccess: () => void;
}

interface FormValues {
  course: { value: number; label: string } | null;
  title: string;
  content: string;
}

interface APIResponse {
  success?: string;
  error?: string;
  topic?: Topic;
}

const TopicModal: React.FC<TopicModalProps> = ({
  show,
  onHide,
  editingTopic,
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
      content: "",
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

    if (editingTopic) {
      const selected = courseOptions.find(o => o.value === editingTopic.course_id) || null;
      setSelectedCourse(selected);
      reset({
        course: selected,
        title: editingTopic.title,
        content: editingTopic.content,
      });
    } else {
      setSelectedCourse(null);
      reset({
        course: null,
        title: "",
        content: "",
      });
    }
  }, [show, editingTopic, reset, courseOptions]);

  const mutation = useMutation<APIResponse, Error, FormData>(
    async formData => {
      let res;
      if (editingTopic?.id) {
        formData.append("_method", "PUT");
        res = await api.post<APIResponse>(`/admin/topics/${editingTopic.id}`, formData);
      } else {
        res = await api.post<APIResponse>("/admin/topics", formData);
      }
      return res.data;
    },
    {
      onSuccess: data => {
        if (data.success) {
          toast.success(data.success);
          queryClient.invalidateQueries(["adminTopics"]);
          onHide();
          onSuccess();
        } else {
          toast.error(data.error || "Error desconocido.");
        }
      },
      onError: err => {
        toast.error(err.message || "Error al guardar el tema.");
      },
    }
  );

  const onSubmit = (data: FormValues) => {
    if (!data.course) {
      toast.error("Selecciona un curso.");
      return;
    }

    const formData = new FormData();
    formData.append("course_id", data.course.value.toString());
    formData.append("title", data.title);
    formData.append("content", data.content);

    mutation.mutate(formData);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{editingTopic ? "Editar Tema" : "Crear Tema"}</Modal.Title>
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
              {errors.course && (
                <Form.Text className="text-danger">
                  {errors.course.message}
                </Form.Text>
              )}
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
              <Form.Label>Contenido</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                {...register("content", { required: "El contenido es obligatorio" })}
                isInvalid={!!errors.content}
              />
              <Form.Control.Feedback type="invalid">
                {errors.content?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="text-end">
              <Button variant="primary" type="submit" disabled={mutation.isLoading}>
                {mutation.isLoading
                  ? "Guardando..."
                  : editingTopic
                  ? "Actualizar Tema"
                  : "Crear Tema"}
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default TopicModal;
