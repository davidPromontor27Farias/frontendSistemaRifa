export const COLORES_CONFETI = ['#4a8b2c', '#ee7624', '#ffffff', '#86c66a'];

export interface PiezaConfeti {
    id: number;
    x: number;
    delay: number;
    duration: number;
    color: string;
    rotate: number;
    size: number;
}

export function piezasConfeti(): PiezaConfeti[] {
    return Array.from({ length: 36 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.4,
        duration: 1.6 + Math.random() * 1.2,
        color: COLORES_CONFETI[i % COLORES_CONFETI.length],
        rotate: Math.random() * 360,
        size: 6 + Math.random() * 6,
    }));
}
