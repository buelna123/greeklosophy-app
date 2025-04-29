import { jsx as _jsx } from "react/jsx-runtime";
// src/contexts/authContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api"; // Cliente Axios
// 4. Crea el contexto de autenticación con el tipo AuthContextType
const AuthContext = createContext(undefined);
// 5. El proveedor que contiene la lógica de autenticación
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    // Cargar usuario desde localStorage al iniciar
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    // Verificar sesión en el servidor
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await api.get("/session");
                if (response.data.user) {
                    setUser(response.data.user);
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                }
                else {
                    setUser(null);
                    localStorage.removeItem("user");
                }
            }
            catch (error) {
                console.error("Error al verificar la sesión:", error);
                setUser(null);
                localStorage.removeItem("user");
            }
            finally {
                setLoading(false);
            }
        };
        checkSession();
    }, []);
    // Función para login
    const login = async (email, password) => {
        try {
            const response = await api.post("/login", { email, password });
            // Si el login se realizó exitosamente (se supone que el backend ya rechazó a inactivos)
            setUser(response.data.user);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            navigate("/");
        }
        catch (error) {
            console.error("Error en el login:", error);
            throw error;
        }
    };
    // Función para logout
    const logout = async () => {
        try {
            await api.post("/logout");
            setUser(null);
            localStorage.removeItem("user");
            navigate("/");
        }
        catch (error) {
            console.error("Error en el logout:", error);
            throw error;
        }
    };
    // Funciones para verificar el rol
    const isAdmin = () => user?.role === "admin";
    const isStudent = () => user?.role === "student";
    return (_jsx(AuthContext.Provider, { value: { user, loading, login, logout, isAdmin, isStudent }, children: children }));
};
// 6. Custom hook para acceder al contexto de autenticación
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
