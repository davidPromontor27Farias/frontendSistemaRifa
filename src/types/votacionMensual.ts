import type { Participante } from './participante';

export type EstadoRevisionVoto = 'pendiente' | 'aprobado' | 'rechazado';
export type EstadoVentana = 'proxima' | 'abierta' | 'cerrada';

export interface VentanaVotacion {
    mesClave: string;
    mesEtiqueta: string;
    fechaInicio: string;
    fechaFin: string;
    estado: EstadoVentana;
}

export interface NominacionPersistida {
    id: string;
    participanteId: string;
    participante: Participante;
    boletos: number;
    justificacion: string;
    estado: EstadoRevisionVoto;
    fechaRevision?: string | null;
}

export interface VotoHistorico {
    id: string;
    mesClave: string;
    votanteNumeroEmpleado: string;
    folios: string[];
    fechaEmision: string;
    nominaciones: NominacionPersistida[];
}

export interface AcumuladoParticipante {
    participanteId: string;
    totalBoletos: number;
    boletosPorMes: Record<string, number>;
}