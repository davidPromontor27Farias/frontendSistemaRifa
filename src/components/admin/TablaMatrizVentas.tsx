import { Check, User, Ticket } from 'lucide-react';
import type { FilaMatrizVentas } from '../../types/matrizVentas';
import type { Participante } from '../../types/participante';
import {
    BLOQUES_VENTAS,
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
    onCambiarBloque: (indice: number, valor: string) => void;
    onCambiarVentaExtra: (indice: number, valor: number) => void;
    onCambiarVentaExtraCastigada: (indice: number, valor: number) => void;
    onCambiarEspecificaciones: (indice: number, valor: number) => void;
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
    onCambiarBloque,
    onCambiarVentaExtra,
    onCambiarVentaExtraCastigada,
    onCambiarEspecificaciones,
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
                            <th className="px-5 py-4 text-center">Especif. &ge; 3M</th>
                            <th className="px-5 py-4 text-center">Boletos</th>
                        </tr>
                    </thead>

                    {/* CUERPO DE LA TABLA */}
                    <tbody className="divide-y divide-white/5">
                        {filas.map(({ fila, participante }, i) => {
                            const boletos = calcularBoletosFila(fila);
                            const boletosPorVenta = calcularBoletosPorVentaExtra(fila);
                            const definicionBloque = BLOQUES_VENTAS.find((b) => b.nombre === fila.bloque);

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
                                            title="Marcar: 100% en un canal y al menos 90% en el otro"
                                            className={`inline-flex items-center justify-center w-7 h-7 rounded-lg border transition active:scale-90 cursor-pointer ${
                                                fila.cuotaCumplida
                                                    ? 'bg-[#4A8B2C]/30 border-[#4A8B2C]/50 text-emerald-300'
                                                    : 'bg-white/5 border-white/10 text-transparent hover:border-white/20'
                                            }`}
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                    </td>

                                    {/* Bloque asignado */}
                                    <td className="px-5 py-4">
                                        <select
                                            value={fila.bloque ?? ''}
                                            onChange={(e) => onCambiarBloque(i, e.target.value)}
                                            className="px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-[#4A8B2C] focus:ring-1 focus:ring-[#4A8B2C] transition shadow-inner cursor-pointer"
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

                                    {/* Venta extra en pesos */}
                                    <td className="px-5 py-4 text-center">
                                        <div className="inline-flex flex-col items-center gap-1">
                                            <div className="relative">
                                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">$</span>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    value={fila.ventaExtra}
                                                    onChange={(e) => onCambiarVentaExtra(i, Math.max(0, Number(e.target.value) || 0))}
                                                    disabled={!fila.bloque}
                                                    placeholder="0"
                                                    title="Venta extra total"
                                                    className="w-28 pl-5 pr-2.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white text-right focus:outline-none focus:border-[#4A8B2C] focus:ring-1 focus:ring-[#4A8B2C] transition shadow-inner disabled:opacity-40 disabled:cursor-not-allowed"
                                                />
                                            </div>
                                            <div className="relative">
                                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-amber-500/70 text-[10px]">½</span>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    value={fila.ventaExtraCastigada}
                                                    onChange={(e) => onCambiarVentaExtraCastigada(i, Math.max(0, Number(e.target.value) || 0))}
                                                    disabled={!fila.bloque || fila.ventaExtra === 0}
                                                    placeholder="0"
                                                    title="De la venta extra, cuánto es de alto volumen con utilidad castigada (cuenta al 50%)"
                                                    className="w-28 pl-6 pr-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-amber-500/20 text-[11px] text-amber-200 text-right focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/40 transition disabled:opacity-30 disabled:cursor-not-allowed"
                                                />
                                            </div>
                                            {definicionBloque && (
                                                <span className="text-[10px] text-slate-500 font-mono">
                                                    ${formatearMiles(calcularVentaExtraEfectiva(fila))} efectiva ÷ ${formatearMiles(definicionBloque.umbralExtra)} = {boletosPorVenta}
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Especificaciones aceptadas */}
                                    <td className="px-5 py-4 text-center">
                                        <input
                                            type="number"
                                            min={0}
                                            value={fila.especificaciones}
                                            onChange={(e) => onCambiarEspecificaciones(i, Math.max(0, Number(e.target.value) || 0))}
                                            className="w-16 px-2.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white text-center focus:outline-none focus:border-[#4A8B2C] focus:ring-1 focus:ring-[#4A8B2C] transition shadow-inner"
                                        />
                                    </td>

                                    {/* Boletos calculados */}
                                    <td className="px-5 py-4 text-center">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ee7624]/15 border border-[#ee7624]/30 text-[#ee7624] text-xs font-black">
                                            <Ticket className="w-3 h-3" />
                                            {boletos}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}

                        {/* ESTADO VACÍO */}
                        {filas.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <User className="w-8 h-8 text-slate-600 stroke-[1.5]" />
                                        <p className="text-xs font-bold text-slate-400">No hay participantes activos registrados</p>
                                        <p className="text-[11px] text-slate-500">
                                            Da de alta o reactiva colaboradores en "Participantes" para que aparezcan aquí.
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
