import { useState } from "react";
import { Modal, Form, Button, Alert, Spinner } from "react-bootstrap";
import { LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "@/api";
import "../styles/modalprofile.css";

interface ModalProfileProps {
  show: boolean;
  onHide: () => void;
}

export function ModalProfile({ show, onHide }: ModalProfileProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setPasswordConfirmation("");
    setName("");
    setError("");
    setSuccess("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/login", { email, password });
      if (response.status === 200) {
        window.location.reload();
      } else {
        setError("Credenciales incorrectas.");
      }
    } catch (error) {
      setError("Correo o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== passwordConfirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      if (response.status === 201 || response.status === 200) {
        setSuccess("¡Registro exitoso! Redirigiendo...");
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err: any) {
      if (err.response?.status === 422) {
        const errors = err.response.data.errors;
        const firstError = Object.values(errors)[0] as string[];
        setError(firstError[0]);
      } else if (err.response?.status === 409) {
        setError("Este correo ya está registrado.");
      } else {
        setError("Ocurrió un error al registrarse.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await api.post("/logout");
      logout();
      window.location.reload();
    } catch (err) {
      console.error("Error al cerrar sesión", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {user ? "Perfil de Usuario" : "Iniciar Sesión / Registrarse"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {user ? (
          <div className="text-center">
            <p>
              Bienvenido, <strong>{user.name}</strong>
            </p>
            <Button variant="danger" onClick={handleLogout} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Cerrar sesión"}
            </Button>
          </div>
        ) : (
          <>
            <div className="modal-tabs">
              <div
                className={`modal-tab ${activeTab === "login" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("login");
                  resetForm();
                }}
              >
                <LogIn size={18} style={{ marginRight: 6 }} />
                Iniciar Sesión
              </div>
              <div
                className={`modal-tab ${activeTab === "register" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("register");
                  resetForm();
                }}
              >
                <UserPlus size={18} style={{ marginRight: 6 }} />
                Registrarse
              </div>
            </div>

            {activeTab === "login" && (
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>

                {error && activeTab === "login" && (
                  <Alert variant="danger">{error}</Alert>
                )}

                <Button type="submit" className="w-100 btn-primary" disabled={loading}>
                  {loading ? (
                    <Spinner animation="border" size="sm" style={{ color: "white" }} />
                  ) : (
                    "Ingresar"
                  )}
                </Button>
              </Form>
            )}

            {activeTab === "register" && (
              <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre completo</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirmar contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>

                {error && activeTab === "register" && (
                  <Alert variant="danger">{error}</Alert>
                )}
                {success && <Alert variant="success">{success}</Alert>}

                <Button type="submit" className="w-100 btn-primary" disabled={loading}>
                  {loading ? (
                    <Spinner animation="border" size="sm" style={{ color: "white" }} />
                  ) : (
                    "Registrarse"
                  )}
                </Button>
              </Form>
            )}
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}
