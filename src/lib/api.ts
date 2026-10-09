export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export async function apiFetch<T>(ruta: string, opciones?: RequestInit): Promise<T> {
    const esFormData = opciones?.body instanceof FormData;
    const respuesta = await fetch(`${API_URL}${ruta}`, {
        ...opciones,
        headers: esFormData
            ? opciones?.headers
            : { "Content-Type": "application/json", ...opciones?.headers },
    });

    if (!respuesta.ok) {
        const cuerpo = await respuesta.json().catch(() => ({}));
        throw new Error(cuerpo.error ?? `Error ${respuesta.status}`);
    }

    if (respuesta.status === 204) return undefined as T;
    return respuesta.json() as Promise<T>;
}
