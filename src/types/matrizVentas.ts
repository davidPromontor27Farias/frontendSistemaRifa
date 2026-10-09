export interface FilaMatrizVentas {
    participanteId: string;
    cuotaCumplida: boolean;
    bloque: string | null;
    ventaExtra: number;
    ventaExtraCastigada: number;
    especificaciones: number;
}

export interface CierreMesVentas {
    mesClave: string;
    mesEtiqueta: string;
    filas: FilaMatrizVentas[];
    aprobado: boolean;
    fechaGuardado: string;
    fechaAprobacion: string | null;
}
