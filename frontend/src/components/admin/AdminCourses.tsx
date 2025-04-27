// src/components/admin/AdminCourses.tsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Spinner
} from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import { useNavigate } from "react-router-dom"; // ✅ NUEVO
import "react-toastify/dist/ReactToastify.css";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "../../styles/admin.css";
import api from "@/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

registerPlugin(FilePondPluginImagePreview);

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

interface FormValues {
  title: string;
  description: string;
  category: string;
}

interface APIResponse {
  success?: string;
  error?: string;
  course?: Course;
}

const AdminCourses = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // ✅ NUEVO

  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<{ value: string; label: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { title: "", description: "", category: "" },
  });

  useEffect(() => {
    if (editingCourse) {
      reset({
        title: editingCourse.title,
        description: editingCourse.description,
        category: editingCourse.category,
      });
      setSelectedCategory({ value: editingCourse.category, label: editingCourse.category });
    } else {
      reset({ title: "", description: "", category: "" });
      setSelectedCategory(null);
    }
  }, [editingCourse, reset]);

  const { data: coursesData, isLoading } = useQuery<Course[]>({
    queryKey: ["adminCourses"],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Course>>("/courses");
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  useEffect(() => {
    if (coursesData) {
      const uniqueCategories = Array.from(new Set(coursesData.map(course => course.category)))
        .filter((cat) => !!cat)
        .map((cat) => ({ value: cat, label: cat }));
      setCategories(uniqueCategories);
    }
  }, [coursesData]);

  const mutation = useMutation<APIResponse, Error, FormData & { courseId?: number }>(
    async (formData) => {
      if (formData.courseId) {
        const id = formData.courseId;
        delete formData.courseId;
        const response = await api.post<APIResponse>(`/courses/${id}`, formData);
        return response.data;
      } else {
        const response = await api.post<APIResponse>(`/courses`, formData);
        return response.data;
      }
    },
    {
      onSuccess: (data) => {
        if (data.success) {
          toast.success(data.success);
          queryClient.invalidateQueries(["adminCourses"]);
          handleCloseModal();
        } else {
          toast.error(data.error || "Error desconocido.");
        }
      },
      onError: (err: Error) => {
        toast.error(err.message || "Error al crear/actualizar el curso.");
      },
    }
  );

  const onSubmit = (data: FormValues) => {
    if (!editingCourse && !file) {
      toast.error("La imagen es obligatoria.");
      return;
    }
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", selectedCategory?.value || "Sin categoría");

    if (editingCourse?.id) {
      formData.append("id", editingCourse.id.toString());
      formData.append("_method", "PUT");
      (formData as any).courseId = editingCourse.id;
    }
    if (file) {
      formData.append("image", file);
    }

    mutation.mutate(formData as FormData & { courseId?: number });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este curso?")) return;
    try {
      const response = await api.delete<APIResponse>(`/courses/${id}`);
      if (response.data.success) {
        toast.success(response.data.success);
        queryClient.invalidateQueries(["adminCourses"]);
      } else {
        toast.error("Error: " + (response.data.error || "Ocurrió un error."));
      }
    } catch (err: any) {
      toast.error("Error al eliminar el curso.");
      console.error(err);
    }
  };

  const handleShowModal = (course?: Course) => {
    setEditingCourse(course || null);
    setFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFile(null);
    setSelectedCategory(null);
  };

  const handleFileChange = (fileItems: any[]) => {
    setFile(fileItems.length > 0 ? fileItems[0].file : null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Container className="admin-container">
      <h1>Gestión de Cursos</h1>
      <Button variant="primary" className="admin-button-primary mb-3" onClick={() => handleShowModal()}>
        Crear Nuevo Curso
      </Button>
      {isLoading ? (
        <div className="text-center my-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      ) : (
        <Table striped bordered hover className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Fecha de Creación</th>
              <th>Fecha de Actualización</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {coursesData &&
              coursesData.map((course) => (
                <tr key={course.id}>
                  <td>{course.id}</td>
                  <td>{course.title}</td>
                  <td>{course.description}</td>
                  <td>{course.category || "Sin categoría"}</td>
                  <td>{course.created_at ? formatDate(course.created_at) : "N/A"}</td>
                  <td>{course.updated_at ? formatDate(course.updated_at) : "N/A"}</td>
                  <td>
                    <Button className="admin-button me-2" onClick={() => handleShowModal(course)}>
                      Editar
                    </Button>
                    <Button variant="danger" className="admin-button me-2" onClick={() => handleDelete(course.id)}>
                      Eliminar
                    </Button>
                    <Button
                      variant="outline-secondary"
                      className="admin-button"
                      onClick={() =>
                        navigate(
                          `/admin/quizzes?course=${course.id}&title=${encodeURIComponent(course.title)}`
                        )
                      }
                    >
                      Ver Quizzes
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={handleCloseModal} className="admin-modal">
        <Modal.Header closeButton>
          <Modal.Title>{editingCourse ? "Editar Curso" : "Crear Curso"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="formCourseTitle" className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                {...register("title", { required: "El título es obligatorio" })}
                isInvalid={!!errors.title}
              />
              {errors.title && (
                <Form.Control.Feedback type="invalid">
                  {errors.title.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group controlId="formCourseDescription" className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                {...register("description", { required: "La descripción es obligatoria" })}
                isInvalid={!!errors.description}
              />
              {errors.description && (
                <Form.Control.Feedback type="invalid">
                  {errors.description.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group controlId="formCourseCategory" className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Controller
                control={control}
                name="category"
                rules={{ required: "La categoría es obligatoria" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={selectedCategory}
                    onChange={(option) => {
                      setSelectedCategory(option);
                      field.onChange(option?.value);
                    }}
                    options={categories}
                    placeholder="Selecciona una categoría"
                  />
                )}
              />
            </Form.Group>

            <Form.Group controlId="formCourseImage" className="mb-3">
              <Form.Label>Imagen</Form.Label>
              <FilePond
                files={file ? [file] : []}
                onupdatefiles={handleFileChange}
                allowMultiple={false}
                acceptedFileTypes={["image/*"]}
                labelIdle='Arrastra & suelta una imagen o <span class="filepond--label-action">Buscar</span>'
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="primary" type="submit" className="admin-button">
                {editingCourse ? "Actualizar Curso" : "Crear Curso"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminCourses;
