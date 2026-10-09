import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { CierreMesVentas, FilaMatrizVentas } from '../types/matrizVentas';
import type { AcumuladoParticipante } from '../types/votacionMensual';
import { leerStorage, escribirStorage } from './storageHelpers';

export const BOLETOS_POR_CUOTA = 1;
export const BOLETOS_POR_ESPECIFICACION = 1;

export interface DefinicionBloque {
    nombre: string;
    rango: string;
    umbralExtra: number;
}

// Bloques y umbrales oficiales del concurso (ver "Bloques Octubre IMQ"): se recalculan
// cada mes con el cierre anterior, pero el umbral en pesos por boleto extra es fijo por bloque.
export const BLOQUES_VENTAS: DefinicionBloque[] = [
    { nombre: 'Bloque 1', rango: 'Menos de $750 mil', umbralExtra: 50_000 },
    { nombre: 'Bloque 2', rango: '$750 mil a menos de $2 M', umbralExtra: 100_000 },
    { nombre: 'Bloque 3', rango: '$2 M a menos de $5 M', umbralExtra: 250_000 },
    { nombre: 'Bloque 4', rango: '$5 M o más', umbralExtra: 500_000 },
];

// Ventas de alto volumen con utilidad castigada por descuentos cuentan al 50% para cumplimiento,
// excedentes, bolsas y boletos (ej. $10M vendidos cuentan como $5M).
export function aplicarUtilidadCastigada(valorTotal: number, valorCastigado: number): number {
    const castigadoAcotado = Math.min(Math.max(valorCastigado, 0), valorTotal);
    return valorTotal - castigadoAcotado * 0.5;
}

export function calcularVentaExtraEfectiva(fila: FilaMatrizVentas): number {
    return aplicarUtilidadCastigada(fila.ventaExtra, fila.ventaExtraCastigada);
}

export function calcularBoletosPorVentaExtra(fila: FilaMatrizVentas): number {
    const definicion = BLOQUES_VENTAS.find((b) => b.nombre === fila.bloque);
    if (!definicion) return 0;
    return Math.floor(calcularVentaExtraEfectiva(fila) / definicion.umbralExtra);
}

export function calcularBoletosFila(fila: FilaMatrizVentas): number {
    return (
        (fila.cuotaCumplida ? BOLETOS_POR_CUOTA : 0) +
        calcularBoletosPorVentaExtra(fila) +
        fila.especificaciones * BOLETOS_POR_ESPECIFICACION
    );
}

interface MatrizVentasContextValue {
    cierres: CierreMesVentas[];
    obtenerCierre: (mesClave: string) => CierreMesVentas | undefined;
    guardarCierre: (cierre: CierreMesVentas) => void;
    calcularAcumuladosPorMatriz: () => AcumuladoParticipante[];
}

const MatrizVentasContext = createContext<MatrizVentasContextValue | null>(null);

export function MatrizVentasProvider({ children }: { children: ReactNode }) {
    const [cierres, setCierres] = useState<CierreMesVentas[]>(() => leerStorage('matrizVentasCierres', []));

    const obtenerCierre = useCallback(
        (mesClave: string) => cierres.find((c) => c.mesClave === mesClave),
        [cierres]
    );

    const guardarCierre = useCallback((cierre: CierreMesVentas) => {
        setCierres((actual) => {
            const sinEseMes = actual.filter((c) => c.mesClave !== cierre.mesClave);
            const nuevaLista = [...sinEseMes, cierre];
            escribirStorage('matrizVentasCierres', nuevaLista);
            return nuevaLista;
        });
    }, []);

    const calcularAcumuladosPorMatriz = useCallback((): AcumuladoParticipante[] => {
        const mapa = new Map<string, AcumuladoParticipante>();
        for (const cierre of cierres) {
            if (!cierre.aprobado) continue;
            for (const fila of cierre.filas) {
                const boletos = calcularBoletosFila(fila);
                if (boletos <= 0) continue;
                const existente = mapa.get(fila.participanteId) ?? {
                    participanteId: fila.participanteId,
                    totalBoletos: 0,
                    boletosPorMes: {},
                };
                existente.totalBoletos += boletos;
                existente.boletosPorMes[cierre.mesClave] = (existente.boletosPorMes[cierre.mesClave] ?? 0) + boletos;
                mapa.set(fila.participanteId, existente);
            }
        }
        return [...mapa.values()];
    }, [cierres]);

    const valor = useMemo<MatrizVentasContextValue>(
        () => ({ cierres, obtenerCierre, guardarCierre, calcularAcumuladosPorMatriz }),
        [cierres, obtenerCierre, guardarCierre, calcularAcumuladosPorMatriz]
    );

    return <MatrizVentasContext.Provider value={valor}>{children}</MatrizVentasContext.Provider>;
}

export function useMatrizVentas(): MatrizVentasContextValue {
    const contexto = useContext(MatrizVentasContext);
    if (!contexto) throw new Error('useMatrizVentas debe usarse dentro de MatrizVentasProvider');
    return contexto;
}
