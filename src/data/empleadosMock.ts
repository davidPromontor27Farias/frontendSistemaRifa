import type { UsuarioAutenticado } from '../types/auth';

// Padrón de credenciales (login = número de empleado) mientras no hay backend/auth real.
export const EMPLEADOS_MOCK: UsuarioAutenticado[] = [
    { numeroEmpleado: '1001', nombre: 'Diego Promontor', rol: 'votante' },
    // Laura también es participante nominable (c01): demuestra la regla de autoexclusión.
    { numeroEmpleado: '1002', nombre: 'Laura Martínez Soto', rol: 'votante', participanteId: 'c01' },
    { numeroEmpleado: '9001', nombre: 'Admin Comercial', rol: 'admin_comercial' },
    { numeroEmpleado: '9002', nombre: 'Dirección General', rol: 'direccion_general' },
];
