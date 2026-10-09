import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Participante } from "../types/participante";
import { apiFetch } from "../lib/api";

interface ParticipantesContextValue {
    lista: Participante[];
    activos: Participante[];
    cargando: boolean;
    recargar: () => Promise<void>;
    agregarParticipante: (datos: Omit<Participante, "id" | "fechaAlta" | "estatus">) => Promise<void>;
    editarParticipante: (participante: Participante) => Promise<void>;
    desactivarParticipante: (id: string) => Promise<void>;
    reactivarParticipante: (id: string) => Promise<void>;
}

const ParticipantesContext = createContext<ParticipantesContextValue | null>(null);

export function ParticipantesProvider({ children }: { children: ReactNode }) {
    const [lista, setLista] = useState<Participante[]>([]);
    const [cargando, setCargando] = useState(true);

    const recargar = useCallback(async () => {
        setCargando(true);
        try {
            const datos = await apiFetch<Participante[]>("/api/participantes");
            setLista(datos);
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        recargar();
    }, [recargar]);

    const agregarParticipante = useCallback(
        async (datos: Omit<Participante, "id" | "fechaAlta" | "estatus">) => {
            await apiFetch<Participante>("/api/participantes", {
                method: "POST",
                body: JSON.stringify(datos),
            });
            await recargar();
        },
        [recargar]
    );

    const editarParticipante = useCallback(
        async (participante: Participante) => {
            await apiFetch<Participante>(`/api/participantes/${participante.id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    nombre: participante.nombre,
                    departamento: participante.departamento,
                    puesto: participante.puesto,
                    area: participante.area,
                }),
            });
            await recargar();
        },
        [recargar]
    );

    const desactivarParticipante = useCallback(
        async (id: string) => {
            await apiFetch<Participante>(`/api/participantes/${id}/desactivar`, { method: "POST" });
            await recargar();
        },
        [recargar]
    );

    const reactivarParticipante = useCallback(
        async (id: string) => {
            await apiFetch<Participante>(`/api/participantes/${id}/reactivar`, { method: "POST" });
            await recargar();
        },
        [recargar]
    );

    const activos = useMemo(() => lista.filter((p) => p.estatus === "activo"), [lista]);

    const valor = useMemo<ParticipantesContextValue>(
        () => ({ lista, activos, cargando, recargar, agregarParticipante, editarParticipante, desactivarParticipante, reactivarParticipante }),
        [lista, activos, cargando, recargar, agregarParticipante, editarParticipante, desactivarParticipante, reactivarParticipante]
    );

    return <ParticipantesContext.Provider value={valor}>{children}</ParticipantesContext.Provider>;
}

export function useParticipantes(): ParticipantesContextValue {
    const contexto = useContext(ParticipantesContext);
    if (!contexto) throw new Error("useParticipantes debe usarse dentro de ParticipantesProvider");
    return contexto;
}