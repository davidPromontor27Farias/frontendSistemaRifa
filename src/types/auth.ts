export type RolUsuario = "votante" | "admin_comercial" | "direccion_general" | "rh";

export interface UsuarioAutenticado {
    numeroEmpleado: string;
    nombre: string;
    rol: RolUsuario;
    participanteId?: string;
}