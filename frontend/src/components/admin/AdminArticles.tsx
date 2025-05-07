import React, { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form, Spinner } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "react-toastify/dist/ReactToastify.css";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "../../styles/admin.css";
import api from "@/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

registerPlugin(FilePondPluginImagePreview);

// Interfaz para un artículo (según nuestro esquema)
interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  image: string;
  tags: string;
  category: string;
  created_at: string;
  updated_at: string;
}

// Interfaz para la respuesta genérica de la API
interface APIResponse {
  success?: string;
  error?: string;
  article?: Article;
}

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
}

interface FormValues {
  title: string;
  content: string;
  author: string;
  tags: string;
  category: string;
}

const AdminArticles: React.FC = () => {
  const queryClient = useQueryClient();

  // Estados para modal, artículo a editar, archivo y categoría seleccionada.
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
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
    defaultValues: { title: "", content: "", author: "", tags: "", category: "" },
  });

  // Hook de React Query para obtener los artículos
  const { data: articlesData, isLoading, error: queryError } = useQuery<Article[]>({
    queryKey: ["adminArticles"],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Article>>("/articles");
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Extraer categorías únicas a partir de los artículos
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  useEffect(() => {
    if (articlesData) {
      const uniqueCategories = Array.from(new Set(articlesData.map((article) => article.category)))
        .filter((cat) => !!cat)
        .map((cat) => ({ value: cat, label: cat }));
      setCategories(uniqueCategories);
    }
  }, [articlesData]);

  // Actualizar el formulario cuando cambia el artículo a editar
  useEffect(() => {
    if (editingArticle) {
      reset({
        title: editingArticle.title,
        content: editingArticle.content,
        author: editingArticle.author,
        tags: editingArticle.tags,
        category: editingArticle.category,
      });
      setSelectedCategory({ value: editingArticle.category, label: editingArticle.category });
    } else {
      reset({ title: "", content: "", author: "", tags: "", category: "" });
      setSelectedCategory(null);
    }
  }, [editingArticle, reset]);

  // Mutación para crear o actualizar artículos
  const mutation = useMutation<APIResponse, Error, FormData & { articleId?: number }>(
    async (formData) => {
      if (formData.articleId) {
        const id = formData.articleId;
        delete formData.articleId;
        const response = await api.post<APIResponse>(`/articles/${id}`, formData);
        return response.data;
      } else {
        const response = await api.post<APIResponse>(`/articles`, formData);
        return response.data;
      }
    },
    {
      onSuccess: (data) => {
        if (data.success) {
          toast.success(data.success);
          queryClient.invalidateQueries(["adminArticles"]);
          handleCloseModal();
        } else {
          toast.error(data.error || "Error desconocido.");
        }
      },
      onError: (err: Error) => {
        toast.error(err.message || "Error al crear/actualizar el artículo.");
      },
    }
  );

  const onSubmit = (data: FormValues) => {
    if (!editingArticle && !file) {
      toast.error("La imagen es obligatoria.");
      return;
    }
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("author", data.author);
    formData.append("tags", data.tags);
    formData.append("category", selectedCategory?.value || "Sin categoría");

    if (editingArticle && editingArticle.id) {
      formData.append("id", editingArticle.id.toString());
      formData.append("_method", "PUT");
      // Campo auxiliar para la mutación
      (formData as any).articleId = editingArticle.id;
    }
    if (file) {
      formData.append("image", file);
    }

    mutation.mutate(formData as FormData & { articleId?: number });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este artículo?")) return;
    try {
      const response = await api.delete<APIResponse>(`/articles/${id}`);
      if (response.data.success) {
        toast.success(response.data.success);
        queryClient.invalidateQueries(["adminArticles"]);
      } else {
        toast.error("Error: " + (response.data.error || "Ocurrió un error."));
      }
    } catch (err: any) {
      toast.error("Error al eliminar el artículo.");
    }
  };

  const handleShowModal = (article?: Article) => {
    setEditingArticle(article || null);
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
      <h1>Gestión de Artículos</h1>
      <Button variant="primary" className="admin-button-primary mb-3" onClick={() => handleShowModal()}>
        Crear Nuevo Artículo
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
              <th>Autor</th>
              <th>Categoría</th>
              <th>Fecha de Creación</th>
              <th>Fecha de Actualización</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {articlesData &&
              articlesData.map((article) => (
                <tr key={article.id}>
                  <td>{article.id}</td>
                  <td>{article.title}</td>
                  <td>{article.author}</td>
                  <td>{article.category || "Sin categoría"}</td>
                  <td>{article.created_at ? formatDate(article.created_at) : "N/A"}</td>
                  <td>{article.updated_at ? formatDate(article.updated_at) : "N/A"}</td>
                  <td>
                  <Button variant="danger" className="admin-button" onClick={() => handleShowModal(article)}>
                      Editar
                    </Button>
                    <Button variant="danger" className="admin-button" onClick={() => handleDelete(article.id)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={handleCloseModal} className="admin-modal">
        <Modal.Header closeButton>
          <Modal.Title>{editingArticle ? "Editar Artículo" : "Crear Artículo"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="formArticleTitle" className="mb-3">
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
            <Form.Group controlId="formArticleContent" className="mb-3">
              <Form.Label>Contenido</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                {...register("content", { required: "El contenido es obligatorio" })}
                isInvalid={!!errors.content}
              />
              {errors.content && (
                <Form.Control.Feedback type="invalid">
                  {errors.content.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group controlId="formArticleAuthor" className="mb-3">
              <Form.Label>Autor</Form.Label>
              <Form.Control
                type="text"
                {...register("author", { required: "El autor es obligatorio" })}
                isInvalid={!!errors.author}
              />
              {errors.author && (
                <Form.Control.Feedback type="invalid">
                  {errors.author.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group controlId="formArticleTags" className="mb-3">
              <Form.Label>Etiquetas</Form.Label>
              <Form.Control
                type="text"
                {...register("tags")}
                placeholder="Ej: Mito, Filosofía"
              />
            </Form.Group>
            <Form.Group controlId="formArticleCategory" className="mb-3">
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
                    className="basic-select"
                    classNamePrefix="select"
                  />
                )}
              />
            </Form.Group>
            <Form.Group controlId="formArticleImage" className="mb-3">
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
                {editingArticle ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminArticles;
