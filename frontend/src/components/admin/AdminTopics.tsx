// src/components/admin/AdminTopics.tsx

import React, { useState } from "react";
import { Container, Table, Button, Spinner } from "react-bootstrap";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "@/api";
import TopicModal from "./modals/TopicModal";
import "@/styles/admin.css";

interface Topic {
  id: number;
  course_id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface APIResponse {
  success?: string;
  error?: string;
  topic?: Topic;
}

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
}

const AdminTopics: React.FC = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  const { data: topicsData, isLoading } = useQuery<Topic[]>({
    queryKey: ["adminTopics"],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<Topic>>("/admin/topics");
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const handleShowModal = (topic?: Topic) => {
    setEditingTopic(topic || null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTopic(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Eliminar este tema?")) return;
    try {
      const res = await api.delete<APIResponse>(`/admin/topics/${id}`);
      if (res.data.success) {
        toast.success(res.data.success);
        queryClient.invalidateQueries(["adminTopics"]);
      } else {
        toast.error(res.data.error || "Error desconocido.");
      }
    } catch (err: any) {
      toast.error("Error al eliminar el tema.");
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Container className="admin-container">
      <h1>Gestión de Temas</h1>

      <Button
        variant="primary"
        className="admin-button-primary mb-3"
        onClick={() => handleShowModal()}
      >
        Crear Nuevo Tema
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
              <th>Curso</th>
              <th>Título</th>
              <th>Creación</th>
              <th>Actualización</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {topicsData &&
              topicsData.map((topic) => (
                <tr key={topic.id}>
                  <td>{topic.id}</td>
                  <td>{topic.course_id}</td>
                  <td>{topic.title}</td>
                  <td>{formatDate(topic.created_at)}</td>
                  <td>{formatDate(topic.updated_at)}</td>
                  <td>
                    <Button
                      className="admin-button me-2"
                      onClick={() => handleShowModal(topic)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      className="admin-button"
                      onClick={() => handleDelete(topic.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}

      <TopicModal
        show={showModal}
        onHide={handleCloseModal}
        editingTopic={editingTopic}
        onSuccess={() => queryClient.invalidateQueries(["adminTopics"])}
      />
    </Container>
  );
};

export default AdminTopics;
