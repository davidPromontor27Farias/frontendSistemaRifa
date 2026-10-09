export type CategoriaPremio = 'mayor' | 'menor';

export interface Premio {
    id: string;
    nombre: string;
    categoria: CategoriaPremio;
    orden: number;
    imagenUrl?: string | null;
    sorteado: boolean;
}

export interface GanadorPremio {
    id: string;
    premioId: string;
    participanteId: string;
    folioGanador: string;
    fechaSorteo: string;
}