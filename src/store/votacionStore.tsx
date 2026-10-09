import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { apiFetch } from '../lib/api';
import type { AcumuladoParticipante, EstadoRevisionVoto, VentanaVotacion, VotoHistorico } from '../types/votacionMensual';
import { useMatrizVentas } from './matrizVentasStore';

export const LIMITE_BOLETOS_POR_NOMINADO = 2;

interface RegistrarVotoInput {
    mesClave: string;
    votanteNumeroEmpleado: string;
    folios: string[];
    nominaciones: { participanteId: string; boletos: number; justificacion: string }[];
}

interface VotacionContextValue {
    ventanas: VentanaVotacion[];
    votos: VotoHistorico[];
    cargando: boolean;
    recargar: () => Promise<void>;
    ventanaDe: (mesClave: string) => VentanaVotacion | undefined;
    ventanaActiva: () => VentanaVotacion | undefined;
    ventanaEstaAbierta: (mesClave: string) => boolean;
    yaVotoEnMes: (numeroEmpleado: string, mesClave: string) => boolean;
    registrarVoto: (voto: RegistrarVotoInput) => Promise<boolean>;
    revisarNominacion: (nominacionId: string, nuevoEstado: EstadoRevisionVoto) => Promise<void>;
    calcularAcumulados: () => AcumuladoParticipante[];
}

const VotacionContext = createContext<VotacionContextValue | null>(null);

export function VotacionProvider({ children }: { children: ReactNode }) {
    const { calcularAcumuladosPorMatriz } = useMatrizVentas();
    const [ventanas, setVentanas] = useState<VentanaVotacion[]>([]);
    const [votos, setVotos] = useState<VotoHistorico[]>([]);
    const [cargando, setCargando] = useState(true);

    const recargar = useCallback(async () => {
        setCargando(true);
        try {
            const [ventanasRes, votosRes] = await Promise.all([
                apiFetch<VentanaVotacion[]>('/api/votacion/ventanas'),
                apiFetch<VotoHistorico[]>('/api/votacion/votos'),
            ]);
            setVentanas(ventanasRes);
            setVotos(votosRes);
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        recargar();
    }, [recargar]);

    const ventanaDe = useCallback((mesClave: string) => ventanas.find((v) => v.mesClave === mesClave), [ventanas]);

    const ventanaActiva = useCallback(() => ventanas.find((v) => v.estado === 'abierta'), [ventanas]);

    const ventanaEstaAbierta = useCallback(
        (mesClave: string) => ventanaDe(mesClave)?.estado === 'abierta',
        [ventanaDe]
    );

    const yaVotoEnMes = useCallback(
        (numeroEmpleado: string, mesClave: string) =>
            votos.some((v) => v.votanteNumeroEmpleado === numeroEmpleado && v.mesClave === mesClave),
        [votos]
    );

    const registrarVoto = useCallback(
        async (voto: RegistrarVotoInput) => {
            if (!ventanaEstaAbierta(voto.mesClave)) return false;
            if (yaVotoEnMes(voto.votanteNumeroEmpleado, voto.mesClave)) return false;
            try {
                await apiFetch('/api/votacion/votos', { method: 'POST', body: JSON.stringify(voto) });
                await recargar();
                return true;
            } catch {
                return false;
            }
        },
        [ventanaEstaAbierta, yaVotoEnMes, recargar]
    );

    const revisarNominacion = useCallback(
        async (nominacionId: string, nuevoEstado: EstadoRevisionVoto) => {
            await apiFetch(`/api/votacion/nominaciones/${nominacionId}`, {
                method: 'PATCH',
                body: JSON.stringify({ estado: nuevoEstado }),
            });
            await recargar();
        },
        [recargar]
    );

    const calcularAcumulados = useCallback((): AcumuladoParticipante[] => {
        const mapa = new Map<string, AcumuladoParticipante>();

        for (const voto of votos) {
            for (const nominacion of voto.nominaciones) {
                if (nominacion.estado !== 'aprobado') continue;

                const existente = mapa.get(nominacion.participanteId) ?? {
                    participanteId: nominacion.participanteId,
                    totalBoletos: 0,
                    boletosPorMes: {},
                };

                const disponibles = LIMITE_BOLETOS_POR_NOMINADO - existente.totalBoletos;
                if (disponibles <= 0) {
                    mapa.set(nominacion.participanteId, existente);
                    continue;
                }

                const boletosAAgregar = Math.min(nominacion.boletos, disponibles);
                existente.totalBoletos += boletosAAgregar;
                existente.boletosPorMes[voto.mesClave] = (existente.boletosPorMes[voto.mesClave] ?? 0) + boletosAAgregar;
                mapa.set(nominacion.participanteId, existente);
            }
        }

        for (const acumuladoMatriz of calcularAcumuladosPorMatriz()) {
            const existente = mapa.get(acumuladoMatriz.participanteId) ?? {
                participanteId: acumuladoMatriz.participanteId,
                totalBoletos: 0,
                boletosPorMes: {},
            };
            existente.totalBoletos += acumuladoMatriz.totalBoletos;
            for (const [mesClave, boletos] of Object.entries(acumuladoMatriz.boletosPorMes)) {
                existente.boletosPorMes[mesClave] = (existente.boletosPorMes[mesClave] ?? 0) + boletos;
            }
            mapa.set(acumuladoMatriz.participanteId, existente);
        }

        return [...mapa.values()];
    }, [votos, calcularAcumuladosPorMatriz]);

    const valor = useMemo<VotacionContextValue>(
        () => ({
            ventanas,
            votos,
            cargando,
            recargar,
            ventanaDe,
            ventanaActiva,
            ventanaEstaAbierta,
            yaVotoEnMes,
            registrarVoto,
            revisarNominacion,
            calcularAcumulados,
        }),
        [
            ventanas,
            votos,
            cargando,
            recargar,
            ventanaDe,
            ventanaActiva,
            ventanaEstaAbierta,
            yaVotoEnMes,
            registrarVoto,
            revisarNominacion,
            calcularAcumulados,
        ]
    );

    return <VotacionContext.Provider value={valor}>{children}</VotacionContext.Provider>;
}

export function useVotacionMensual(): VotacionContextValue {
    const contexto = useContext(VotacionContext);
    if (!contexto) throw new Error('useVotacionMensual debe usarse dentro de VotacionProvider');
    return contexto;
}