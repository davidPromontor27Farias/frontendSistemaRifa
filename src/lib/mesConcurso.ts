import { useState } from 'react';

export const MESES_CONCURSO = [
    { valor: '2026-10', etiqueta: 'Octubre 2026' },
    { valor: '2026-11', etiqueta: 'Noviembre 2026' },
    { valor: '2026-12', etiqueta: 'Diciembre 2026' },
];

const CLAVE_STORAGE = 'rifa:mesConcursoSeleccionado';

function mesActualOPorDefecto(): string {
    const ahora = new Date();
    const actual = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}`;
    return MESES_CONCURSO.some((m) => m.valor === actual) ? actual : MESES_CONCURSO[0].valor;
}

function mesGuardadoOPorDefecto(): string {
    const guardado = localStorage.getItem(CLAVE_STORAGE);
    if (guardado && MESES_CONCURSO.some((m) => m.valor === guardado)) return guardado;
    return mesActualOPorDefecto();
}

export function useMesConcursoSeleccionado() {
    const [mesInput, setMesInputState] = useState<string>(mesGuardadoOPorDefecto);

    function setMesInput(valor: string) {
        setMesInputState(valor);
        localStorage.setItem(CLAVE_STORAGE, valor);
    }

    return [mesInput, setMesInput] as const;
}
