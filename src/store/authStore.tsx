import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { UsuarioAutenticado } from "../types/auth";
import { leerStorage, escribirStorage } from "./storageHelpers";
import { apiFetch } from "../lib/api";

interface AuthContextValue {
    usuario: UsuarioAutenticado | null;
    login: (numeroEmpleado: string) => Promise<UsuarioAutenticado | null>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(() => leerStorage("auth_usuario", null));

    const login = useCallback(async (numeroEmpleado: string) => {
        try {
            const encontrado = await apiFetch<UsuarioAutenticado>("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ numeroEmpleado: numeroEmpleado.trim() }),
            });
            setUsuario(encontrado);
            escribirStorage("auth_usuario", encontrado);
            return encontrado;
        } catch {
            return null;
        }
    }, []);

    const logout = useCallback(() => {
        setUsuario(null);
        escribirStorage("auth_usuario", null);
    }, []);

    return <AuthContext.Provider value={{ usuario, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const contexto = useContext(AuthContext);
    if (!contexto) throw new Error("useAuth debe usarse dentro de AuthProvider");
    return contexto;
}