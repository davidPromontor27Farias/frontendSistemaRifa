import type { Participante } from './participante';

export type ColaboradorNominable = Pick<Participante, 'id' | 'nombre' | 'departamento' | 'puesto' | 'area'>;

export interface SeleccionNominado {
    colaborador: ColaboradorNominable | null;
    boletos: number;
    justificacion: string;
}

export interface NominacionConfirmada {
    colaborador: ColaboradorNominable;
    boletos: number;
    justificacion: string;
}

export interface ComprobanteVoto {
    mes: string;
    nominaciones: NominacionConfirmada[];
    folios: string[];
    fechaEmision: string;
}
