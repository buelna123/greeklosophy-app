// src/components/admin/AdminAssignments.tsx

import React, { useState } from "react";
import { Container, Table, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaHourglassHalf, FaCheckCircle, FaFileAlt } from "react-icons/fa";
import api from "@/api";
import AssignmentModal from "./modals/AssignmentModal";
import "@/styles/admin.css";

export interface Assignment {
  id: number;
  course_id: number;
  title: string;
  description: string;
  due_date?: string | null;
  created_at: string;
  updated_at: string;
  course_name?: string;
  status?: "pending" | "submitted" | "reviewed";
}

interface APIResponse {
  success?: string;
  error?: string;
  assignment?: Assignment;
}

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
}

const AdminAssignments: React.FC = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  const { data: assignmentsData, isLoading } = useQuery<Assignment[]>({
    queryKey: ["adminAssignments"],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Assignment>>("/admin/assignments");
      return response.data.data.sort((a, b) => b.id - a.id);
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Sin fecha";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStatusIcon = (status?: string) => {
    switch (status) {
      case "submitted":
        return <FaFileAlt color="orange" title="Entregado" />;
      case "reviewed":
        return <FaCheckCircle color="green" title="Revisado" />;
      case "pending":
      default:
        return <FaHourglassHalf color="gray" title="Pendiente" />;
    }
  };

  const handleShowModal = (assignment?: Assignment) => {
    setEditingAssignment(assignment || null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAssignment(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta asignación?")) return;
    try {
      const response = await api.delete<APIResponse>(`/admin/assignments/${id}`);
      if (response.data.success) {
        toast.success(response.data.success);
        queryClient.invalidateQueries(["adminAssignments"]);
      } else {
        toast.error(response.data.error || "Error desconocido.");
      }
    } catch (err: any) {
      toast.error("Error al eliminar la asignación.");
    }
  };

  return (
    <Container className="admin-container">
      <h1>Gestión de Asignaciones</h1>
      <Button variant="primary" className="admin-button-primary mb-3" onClick={() => handleShowModal()}>
        Crear Nueva Asignación
      </Button>

      {isLoading ? (
        <div className="text-center my-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      ) : (
        <Table striped bordered hover responsive className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Curso</th>
              <th>Título</th>
              <th>Fecha Límite</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {assignmentsData?.map((assignment) => (
              <tr key={assignment.id}>
                <td>{assignment.id}</td>
                <td>{assignment.course_name || assignment.course_id}</td>
                <td>{assignment.title}</td>
                <td>{formatDate(assignment.due_date)}</td>
                <td className="text-center">{renderStatusIcon(assignment.status)}</td>
                <td>
                  <Button className="admin-button me-2" onClick={() => handleShowModal(assignment)}>
                    Editar
                  </Button>
                  <Button variant="danger" className="admin-button" onClick={() => handleDelete(assignment.id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <AssignmentModal
        show={showModal}
        onHide={handleCloseModal}
        editingAssignment={editingAssignment}
        onSuccess={() => queryClient.invalidateQueries(["adminAssignments"])}
      />
    </Container>
  );
};

export default AdminAssignments;
