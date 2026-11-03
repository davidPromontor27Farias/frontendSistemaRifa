export interface TramoPremio {
    desde: number;
    hasta: number | null;
    tasa: number;
}

export interface ConfigPremioEfectivo {
    presupuestoBase: number;
    umbralActivacion: number;
    topeMensual: number;
    tramos: TramoPremio[];
    cebesScalingUp: string[];
}

export interface CompaniaPremioEfectivo {
    ventaReal: number;
    presupuestoBase: number;
    excedente: number;
    activa: boolean;
    tramo: TramoPremio | null;
    bolsaBruta: number;
    bolsaTotal: number;
}

export interface VendedorPremioEfectivo {
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

export interface SupervisorPremioEfectivo {
    supervisorId: string;
    nombre: string;
    totalRecibido: number;
    vendedores: { nombre: string; aporte: number }[];
}

export interface ReportePremioEfectivo {
    mesClave: string;
    config: ConfigPremioEfectivo;
    compania: CompaniaPremioEfectivo;
    porVendedor: VendedorPremioEfectivo[];
    porSupervisor: SupervisorPremioEfectivo[];
    scalingUpExcluido: {cebe: string; venta: number}[];
    sinDatos: boolean;
}
