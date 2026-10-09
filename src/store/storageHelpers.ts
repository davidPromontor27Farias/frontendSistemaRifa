const PREFIJO = 'rifa_mock_';

export function leerStorage<T>(clave: string, valorPorDefecto: T): T {
    try {
        const crudo = localStorage.getItem(PREFIJO + clave);
        if (!crudo) return valorPorDefecto;
        return JSON.parse(crudo) as T;
    } catch {
        return valorPorDefecto;
    }
}

export function escribirStorage<T>(clave: string, valor: T): void {
    try {
        localStorage.setItem(PREFIJO + clave, JSON.stringify(valor));
    } catch {
        // almacenamiento no disponible (modo privado, cuota llena, etc.) — se ignora, el estado sigue en memoria
    }
}
