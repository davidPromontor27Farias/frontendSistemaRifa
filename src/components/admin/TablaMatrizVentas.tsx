import { Check, User, Ticket } from 'lucide-react';
import type { FilaMatrizVentas } from '../../types/matrizVentas';
import type { Participante } from '../../types/participante';
import {
    BLOQUES_VENTAS,
    BOLETOS_POR_CUOTA,
    BOLETOS_POR_ESPECIFICACION,
    calcularBoletosFila,
    calcularBoletosPorVentaExtra,
    calcularVentaExtraEfectiva,
} from '../../store/matrizVentasStore';

interface FilaConParticipante {
    fila: FilaMatrizVentas;
    participante: Participante | undefined;
}

interface TablaMatrizVentasProps {
    filas: FilaConParticipante[];
    onCambiarCuota: (indice: number, valor: boolean) => void;
}

function obtenerIniciales(nombre?: string | null): string {
    if (!nombre) return '?';
    const partes = nombre.trim().split(/\s+/);
    return ((partes[0]?.[0] ?? '') + (partes[1]?.[0] ?? '')).toUpperCase();
}

function formatearMiles(valor: number): string {
    return new Intl.NumberFormat('es-MX').format(valor);
}

export function TablaMatrizVentas({
    filas,
    onCambiarCuota,
}: TablaMatrizVentasProps) {
    return (
        <div className="relative w-full bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden text-slate-100">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                    {/* ENCABEZADO DE LA TABLA */}
                    <thead>
                        <tr className="bg-slate-950/60 border-b border-white/10 text-[10px] font-black uppercase tracking-wider text-slate-400">
                            <th className="px-5 py-4">Vendedor</th>
                            <th className="px-5 py-4 text-center">Cuota 100/90</th>
                            <th className="px-5 py-4">Bloque</th>
                            <th className="px-5 py-4 text-center">Venta extra</th>
                            <th className="px-5 py-4 text-center">Boletos</th>
                        </tr>
                    </thead>

                    {/* CUERPO DE LA TABLA */}
                    <tbody className="divide-y divide-white/5">
                        {filas.map(({ fila, participante }, i) => {
                            const boletos = calcularBoletosFila(fila);
                            const boletosPorVenta = calcularBoletosPorVentaExtra(fila);
                            const definicionBloque = BLOQUES_VENTAS.find((b) => b.nombre === fila.bloque);
                            const boletosSinBloqueo =
                                BOLETOS_POR_CUOTA + boletosPorVenta + fila.especificaciones * BOLETOS_POR_ESPECIFICACION;
                            const bloqueadaPorCuota = !fila.cuotaCumplida && boletosSinBloqueo > BOLETOS_POR_CUOTA;
                            const cumpleVentaExtra = boletosPorVenta > 0;

                            return (
                                <tr key={fila.participanteId} className="hover:bg-white/5 transition-colors duration-150 group">
                                    {/* Vendedor */}
                                    <td className="px-5 py-4 font-bold text-white">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4A8B2C]/20 to-[#ee7624]/20 border border-white/15 text-white flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm">
                                                {obtenerIniciales(participante?.nombre)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                                                    {participante?.nombre ?? 'Participante no encontrado'}
                                                </p>
                                                {participante?.departamento && (
                                                    <p className="text-[10px] text-slate-400 font-normal truncate">
                                                        {participante.departamento}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Cuota (canal 100/90) */}
                                    <td className="px-5 py-4 text-center">
                                        <button
                                            type="button"
                                            onClick={() => onCambiarCuota(i, !fila.cuotaCumplida)}
                                            title={
                                                fila.detalleCuota
                                                    ? `Cumplimiento por canal: ${fila.detalleCuota}`
                                                    : 'Marcar: 100% en un canal y al menos 90% en el otro'
                                            }
                                            className={`inline-flex items-center justify-center w-7 h-7 rounded-lg border transition active:scale-90 cursor-pointer ${
                                                fila.cuotaCumplida
                                                    ? 'bg-[#4A8B2C]/30 border-[#4A8B2C]/50 text-emerald-300'
                                                    : 'bg-white/5 border-white/10 text-transparent hover:border-white/20'
                                            }`}
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                    </td>

                                    {/* Bloque asignado (automático desde el Excel, no editable) */}
                                    <td className="px-5 py-4">
                                        <select
                                            value={fila.bloque ?? ''}
                                            disabled
                                            title="El bloque se asigna automáticamente al procesar el Excel de vendedores"
                                            className="px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white opacity-60 cursor-not-allowed shadow-inner"
                                        >
                                            <option value="" className="bg-slate-900 text-slate-400">
                                                Sin asignar
                                            </option>
                                            {BLOQUES_VENTAS.map((b) => (
                                                <option key={b.nombre} value={b.nombre} className="bg-slate-900 text-white">
                                                    {b.nombre} · {b.rango}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    {/* Venta extra en pesos (solo se muestra a quien cumplió la regla) */}
                                    <td className="px-5 py-4 text-center">
                                        {!cumpleVentaExtra ? (
                                            <span className="text-[11px] text-slate-500">—</span>
                                        ) : (
                                            <div className="inline-flex flex-col items-center gap-1">
                                                <span className="text-xs font-bold text-white">${formatearMiles(fila.ventaExtra)}</span>
                                                {definicionBloque && (
                                                    <span className="text-[10px] text-slate-500 font-mono">
                                                        ${formatearMiles(calcularVentaExtraEfectiva(fila))} efectiva ÷ ${formatearMiles(definicionBloque.umbralExtra)} = {boletosPorVenta}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </td>

                                    {/* Boletos calculados */}
                                    <td className="px-5 py-4 text-center">
                                        <div className="inline-flex flex-col items-center gap-1">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-black ${
                                                    bloqueadaPorCuota
                                                        ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                                                        : 'bg-[#ee7624]/15 border-[#ee7624]/30 text-[#ee7624]'
                                                }`}
                                            >
                                                <Ticket className="w-3 h-3" />
                                                {boletos}
                                            </span>
                                            {bloqueadaPorCuota && (
                                                <span
                                                    className="text-[9px] font-bold uppercase tracking-wider text-rose-300"
                                                    title="No cumplió la cuota por canal (Regla 1), así que queda bloqueado y no suma boletos de las demás reglas"
                                                >
                                                    Bloqueado · Regla 1
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                        {/* ESTADO VACÍO */}
                        {filas.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <User className="w-8 h-8 text-slate-600 stroke-[1.5]" />
                                        <p className="text-xs font-bold text-slate-400">Todavía no hay vendedores cargados este mes</p>
                                        <p className="text-[11px] text-slate-500">
                                            Sube el Excel de vendedores para iniciar el cierre de este mes.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
