import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { apiFetch } from '../lib/api';
import type { AcumuladoParticipante } from '../types/votacionMensual';
import type { GanadorPremio, Premio } from '../types/tombola';

interface TombolaContextValue {
    premios: Premio[];
    ganadores: GanadorPremio[];
    cargando: boolean;
    recargar: () => Promise<void>;
    agregarPremio: (datos: Omit<Premio, 'id' | 'sorteado'>) => Promise<void>;
    ejecutarSorteo: (
        premioId: string,
        acumulados: AcumuladoParticipante[],
        idsParticipantesActivos: Set<string>
    ) => Promise<GanadorPremio | null>;
}

const TombolaContext = createContext<TombolaContextValue | null>(null);

export function TombolaProvider({ children }: { children: ReactNode }) {
    const [premios, setPremios] = useState<Premio[]>([]);
    const [ganadores, setGanadores] = useState<GanadorPremio[]>([]);
    const [cargando, setCargando] = useState(true);

    const recargar = useCallback(async () => {
        setCargando(true);
        try {
            const [premiosRes, ganadoresRes] = await Promise.all([
                apiFetch<Premio[]>('/api/tombola/premios'),
                apiFetch<GanadorPremio[]>('/api/tombola/ganadores'),
            ]);
            setPremios(premiosRes);
            setGanadores(ganadoresRes);
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        recargar();
    }, [recargar]);

    const agregarPremio = useCallback(
        async (datos: Omit<Premio, 'id' | 'sorteado'>) => {
            await apiFetch('/api/tombola/premios', { method: 'POST', body: JSON.stringify(datos) });
            await recargar();
        },
        [recargar]
    );

    const ejecutarSorteo = useCallback(
        async (
            premioId: string,
            acumulados: AcumuladoParticipante[],
            idsParticipantesActivos: Set<string>
        ): Promise<GanadorPremio | null> => {
            const elegibles = acumulados
                .filter((a) => idsParticipantesActivos.has(a.participanteId) && a.totalBoletos > 0)
                .map((a) => ({ participanteId: a.participanteId, boletos: a.totalBoletos }));

            if (elegibles.length === 0) return null;

            try {
                const ganador = await apiFetch<GanadorPremio>(`/api/tombola/premios/${premioId}/sortear`, {
                    method: 'POST',
                    body: JSON.stringify({ elegibles }),
                });
                await recargar();
                return ganador;
            } catch {
                return null;
            }
        },
        [recargar]
    );

    const valor = useMemo<TombolaContextValue>(
        () => ({ premios, ganadores, cargando, recargar, agregarPremio, ejecutarSorteo }),
        [premios, ganadores, cargando, recargar, agregarPremio, ejecutarSorteo]
    );

    return <TombolaContext.Provider value={valor}>{children}</TombolaContext.Provider>;
}

export function useTombola(): TombolaContextValue {
    const contexto = useContext(TombolaContext);
    if (!contexto) throw new Error('useTombola debe usarse dentro de TombolaProvider');
    return contexto;
}