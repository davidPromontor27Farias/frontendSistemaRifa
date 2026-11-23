export interface SemanaConcursoSemanal {
    numero: number;
    etiqueta: string;
    metaSemanal: number;
    ventaReal: number;
    ratioIncremento: number;
    excesoPct: number;
    incrementoPct: number;
}

export interface ResultadoConcursoSemanal {
    metaMensual: number;
    ventaMensual: number;
    excedenteMensual: number;
    bolsasAbiertas: number;
    bolsaMensualTotal: number;
    semanas: SemanaConcursoSemanal[];
    incrementoAcumuladoPct: number;
    premioExtraSemanal: number;
    premioTotal: number;
}

export interface ConfigConcursoSemanal {
    metaMensual: number;
    montoPorTramo: number;
    tamanioTramo: number;
    cebesScalingUp: string[];
}

export interface VendedorConcursoSemanal {
    participanteId: string;
    nombre: string;
    ventaTotal: number;
    metaTotal: number;
    excedente: number;
    elegible: boolean;
    detalleCuota: string;
    supervisorId: string | null;
    premioEjecutivo: number;
    premioSupervisor: number;
    premioTotal: number;
}

export interface SupervisorConcursoSemanal {
    supervisorId: string;
    nombre: string;
    totalRecibido: number;
    vendedores: { nombre: string; aporte: number }[];
}

export interface ReporteConcursoSemanal {
    mesClave: string;
    config: ConfigConcursoSemanal;
    concurso: ResultadoConcursoSemanal;
    porVendedor: VendedorConcursoSemanal[];
    porSupervisor: SupervisorConcursoSemanal[];
    scalingUpExcluido: { cebe: string; venta: number }[];
    sinDatos: boolean;
}