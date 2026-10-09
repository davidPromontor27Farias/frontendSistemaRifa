export type EstatusParticipante = "activo" | "inactivo";
export type TipoParticipante = "comercial" | "no_comercial";

export interface Participante {
    id: string;
    numeroEmpleado: string;
    nombre: string;
    departamento: string;
    puesto: string;
    area: string;
    tipo: TipoParticipante;
    fotoUrl?: string;
    estatus: EstatusParticipante;
    fechaAlta: string;
    fechaBaja?: string;
}