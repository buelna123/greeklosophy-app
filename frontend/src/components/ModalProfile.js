import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Modal, Form, Button, Alert, Spinner } from "react-bootstrap";
import { LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "@/api";
import "../styles/modalprofile.css";
export function ModalProfile({ show, onHide }) {
    const [activeTab, setActiveTab] = useState("login");
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
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const response = await api.post("/login", { email, password });
            if (response.status === 200) {
                window.location.reload();
            }
            else {
                setError("Credenciales incorrectas.");
            }
        }
        catch (error) {
            setError("Correo o contraseña incorrectos.");
        }
        finally {
            setLoading(false);
        }
    };
    const handleRegister = async (e) => {
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
        }
        catch (err) {
            if (err.response?.status === 422) {
                const errors = err.response.data.errors;
                const firstError = Object.values(errors)[0];
                setError(firstError[0]);
            }
            else if (err.response?.status === 409) {
                setError("Este correo ya está registrado.");
            }
            else {
                setError("Ocurrió un error al registrarse.");
            }
        }
        finally {
            setLoading(false);
        }
    };
    const handleLogout = async () => {
        setLoading(true);
        try {
            await api.post("/logout");
            logout();
            window.location.reload();
        }
        catch (err) {
            console.error("Error al cerrar sesión", err);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(Modal, { show: show, onHide: onHide, centered: true, children: [_jsx(Modal.Header, { closeButton: true, children: _jsx(Modal.Title, { children: user ? "Perfil de Usuario" : "Iniciar Sesión / Registrarse" }) }), _jsx(Modal.Body, { children: user ? (_jsxs("div", { className: "text-center", children: [_jsxs("p", { children: ["Bienvenido, ", _jsx("strong", { children: user.name })] }), _jsx(Button, { variant: "danger", onClick: handleLogout, disabled: loading, children: loading ? _jsx(Spinner, { animation: "border", size: "sm" }) : "Cerrar sesión" })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "modal-tabs", children: [_jsxs("div", { className: `modal-tab ${activeTab === "login" ? "active" : ""}`, onClick: () => {
                                        setActiveTab("login");
                                        resetForm();
                                    }, children: [_jsx(LogIn, { size: 18, style: { marginRight: 6 } }), "Iniciar Sesi\u00F3n"] }), _jsxs("div", { className: `modal-tab ${activeTab === "register" ? "active" : ""}`, onClick: () => {
                                        setActiveTab("register");
                                        resetForm();
                                    }, children: [_jsx(UserPlus, { size: 18, style: { marginRight: 6 } }), "Registrarse"] })] }), activeTab === "login" && (_jsxs(Form, { onSubmit: handleLogin, children: [_jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Correo electr\u00F3nico" }), _jsx(Form.Control, { type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, disabled: loading })] }), _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Contrase\u00F1a" }), _jsx(Form.Control, { type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, disabled: loading })] }), error && activeTab === "login" && (_jsx(Alert, { variant: "danger", children: error })), _jsx(Button, { type: "submit", className: "w-100 btn-primary", disabled: loading, children: loading ? (_jsx(Spinner, { animation: "border", size: "sm", style: { color: "white" } })) : ("Ingresar") })] })), activeTab === "register" && (_jsxs(Form, { onSubmit: handleRegister, children: [_jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Nombre completo" }), _jsx(Form.Control, { type: "text", value: name, onChange: (e) => setName(e.target.value), required: true, disabled: loading })] }), _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Correo electr\u00F3nico" }), _jsx(Form.Control, { type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, disabled: loading })] }), _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Contrase\u00F1a" }), _jsx(Form.Control, { type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, disabled: loading })] }), _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Confirmar contrase\u00F1a" }), _jsx(Form.Control, { type: "password", value: passwordConfirmation, onChange: (e) => setPasswordConfirmation(e.target.value), required: true, disabled: loading })] }), error && activeTab === "register" && (_jsx(Alert, { variant: "danger", children: error })), success && _jsx(Alert, { variant: "success", children: success }), _jsx(Button, { type: "submit", className: "w-100 btn-primary", disabled: loading, children: loading ? (_jsx(Spinner, { animation: "border", size: "sm", style: { color: "white" } })) : ("Registrarse") })] }))] })) })] }));
}
