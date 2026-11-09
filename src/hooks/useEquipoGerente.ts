import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { MESES_CONCURSO } from "../lib/mesConcurso";
import type { ReportePremioEfectivo } from "../types/premioEfectivo";


interface VentanaCanalFila {
    participanteId: string;
    cebe: string;
    canal: string;
    meta: number;
    venta: number;
}





export interface PremioIntegranteMes {
    participanteId: string;
    nombre: string;
    mesClave: string;
    mesEtiqueta: string;
    premioEjecutivo: number;
    premioSupervisor: number;
    premioTotal: number;
}

export function useEquipoGerente(miParticipanteId: string | undefined, habilitado: boolean){
    const [cebePorParticipanteId, setCebePorParticipanteId] = useState<Map<string, string>>(new Map());
    const [premioPorIntegrante, setPremioPorIntegrante] = useState<PremioIntegranteMes[]>([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if(!habilitado || !miParticipanteId){
            setCebePorParticipanteId(new Map());
            setPremioPorIntegrante([]);
            setCargando(false);
            return;
        }

        let cancelado = false;
        setCargando(true);

        Promise.all(
            MESES_CONCURSO.map(({valor, etiqueta}) => 
                Promise.all([
                    apiFetch<VentanaCanalFila[]>(`/api/cierre-mes/${valor}/ventas-canal`),
                    apiFetch<ReportePremioEfectivo>(`/api/premio-efectivo/${valor}`),

                ]).then(([ventasCanal, reportePremio]) => ({mesClave: valor, mesEtiqueta: etiqueta, ventasCanal, reportePremio}))
            )
        )
        .then((resultadosPorMes) => {
            if(cancelado) return;

            const cebeMap = new Map<string, string>();
            const premios: PremioIntegranteMes[] = [];

            for(const { mesClave, mesEtiqueta, ventasCanal, reportePremio} of resultadosPorMes){
                    for(const fila of ventasCanal){
                        if(fila.cebe) cebeMap.set(fila.participanteId, fila.cebe);
                    }

                    for(const v of reportePremio.porVendedor){
                        if(v.supervisorId !== miParticipanteId) continue;
                        if(v.premioTotal <=  0) continue;
                        premios.push({
                            participanteId: v.participanteId,
                            nombre: v.nombre,
                            mesClave,
                            mesEtiqueta,
                            premioEjecutivo: v.premioEjecutivo,
                            premioSupervisor: v.premioSupervisor,
                            premioTotal: v.premioTotal

                        })
                    }
                }

                setCebePorParticipanteId(cebeMap);
                setPremioPorIntegrante(premios);
            })
            .catch(() => {
                if(!cancelado) {
                    setCebePorParticipanteId(new Map());
                    setPremioPorIntegrante([])
                }
            })

            .finally(() => {
                if(!cancelado) setCargando(false)
            })
        
            return () => {
                cancelado = true;
            }

        }, [miParticipanteId, habilitado]);

    return {cebePorParticipanteId, premioPorIntegrante, cargando}
}