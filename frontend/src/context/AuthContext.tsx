// src/contexts/authContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api"; // Cliente Axios

// 1. Define el tipo User (el usuario autenticado)
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "student";
  status?: string;
  // Puedes agregar otros campos según lo necesites
}

// 2. Define el tipo para el contexto (AuthContextType)
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  isStudent: () => boolean;
}

// 3. Define el tipo para las props del proveedor (AuthProviderProps)
interface AuthProviderProps {
  children: ReactNode;
}

// 4. Crea el contexto de autenticación con el tipo AuthContextType
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 5. El proveedor que contiene la lógica de autenticación
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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
        const response = await api.get<{ user: User | null }>("/session");
        if (response.data.user) {
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error);
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  // Función para login
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<{ user: User }>("/login", { email, password });
      // Si el login se realizó exitosamente (se supone que el backend ya rechazó a inactivos)
      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (error) {
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
    } catch (error) {
      console.error("Error en el logout:", error);
      throw error;
    }
  };

  // Funciones para verificar el rol
  const isAdmin = () => user?.role === "admin";
  const isStudent = () => user?.role === "student";

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, isAdmin, isStudent }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 6. Custom hook para acceder al contexto de autenticación
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
