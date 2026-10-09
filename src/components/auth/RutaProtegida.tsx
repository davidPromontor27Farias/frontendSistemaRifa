import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../store/authStore';
import type { RolUsuario } from '../../types/auth';

interface RutaProtegidaProps {
    rolesPermitidos: RolUsuario[];
    children: ReactNode;
}

export function RutaProtegida({ rolesPermitidos, children }: RutaProtegidaProps) {
    const { usuario } = useAuth();

    if (!usuario) return <Navigate to="/login" replace />;
    if (!rolesPermitidos.includes(usuario.rol)) return <Navigate to="/" replace />;

    return <>{children}</>;
}
