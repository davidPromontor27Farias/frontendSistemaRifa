import { createPortal } from 'react-dom';
import { CheckCircle2, XCircle, AlertTriangle, Loader2, X, Ticket } from 'lucide-react';

export interface AplicadoCuotaCanal {
    participanteId: string;
    numeroEmpleado: string;
    nombre: string;
    cuotaCumplida: boolean;
    detalleCuota: string;
}

export interface AplicadoVentaExtraBloque {
    participanteId: string;
    numeroEmpleado: string;
    nombre: string;
    bloque: string;
    baseMensual: number;
    ventaTotalMes: number;
    ventaExtra: number;
    boletos: number;
}

export interface ResultadoProcesarExcelVentas {
    cuotaCanal: { aplicados: AplicadoCuotaCanal[]; noEncontrados: string[] };
    ventaExtraBloque: { aplicados: AplicadoVentaExtraBloque[] };
}

interface ModalResultadoExcelVentasProps {
    resultado: ResultadoProcesarExcelVentas;
    procesando: boolean;
    onCancelar: () => void;
    onAutorizar: () => void;
}

function formatearMiles(valor: number): string {
    return new Intl.NumberFormat('es-MX').format(Math.round(valor));
}

export function ModalResultadoExcelVentas({ resultado, procesando, onCancelar, onAutorizar }: ModalResultadoExcelVentasProps) {
    const { cuotaCanal, ventaExtraBloque } = resultado;
    const ganadoresCuota = cuotaCanal.aplicados.filter((a) => a.cuotaCumplida);
    const noGanadoresCuota = cuotaCanal.aplicados.filter((a) => !a.cuotaCumplida);
    const conBoletosBloque = ventaExtraBloque.aplicados.filter((a) => a.boletos > 0);
    const sinBoletosBloque = ventaExtraBloque.aplicados.filter((a) => a.boletos === 0);

    const totalAplicados = cuotaCanal.aplicados.length + ventaExtraBloque.aplicados.length;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-slate-900 border border-white/10 rounded-3xl shadow-2xl">
                <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-black text-white">Resultado del Excel de ventas</h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Revisa quién obtuvo boleto antes de autorizar. Al autorizar, el mes queda aprobado y los boletos cuentan en
                            Acumulados.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onCancelar}
                        className="p-2 rounded-xl hover:bg-white/10 transition cursor-pointer shrink-0"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* REGLA 1 */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-black uppercase tracking-wider text-[#ee7624]">Regla 1 · Cuota por canal</h3>

                        <div className="space-y-2">
                            <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Obtuvieron boleto ({ganadoresCuota.length})
                            </h4>
                            {ganadoresCuota.length === 0 ? (
                                <p className="text-[11px] text-slate-500">Nadie cumplió la regla este mes.</p>
                            ) : (
                                <ul className="space-y-1.5">
                                    {ganadoresCuota.map((g) => (
                                        <li
                                            key={g.participanteId}
                                            className="flex items-center justify-between gap-3 bg-[#4A8B2C]/10 border border-[#4A8B2C]/30 rounded-xl px-3 py-2"
                                        >
                                            <span className="text-xs font-bold text-white">{g.nombre}</span>
                                            <span className="text-[10px] text-emerald-300 font-mono">{g.detalleCuota}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-[11px] font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                                <XCircle className="w-3.5 h-3.5" />
                                No obtuvieron boleto ({noGanadoresCuota.length})
                            </h4>
                            {noGanadoresCuota.length === 0 ? (
                                <p className="text-[11px] text-slate-500">Todos los evaluados cumplieron la regla.</p>
                            ) : (
                                <ul className="space-y-1.5">
                                    {noGanadoresCuota.map((n) => (
                                        <li
                                            key={n.participanteId}
                                            className="flex items-center justify-between gap-3 bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2"
                                        >
                                            <span className="text-xs font-bold text-white">{n.nombre}</span>
                                            <span className="text-[10px] text-rose-300 font-mono">{n.detalleCuota}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {cuotaCanal.noEncontrados.length > 0 && (
                            <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2.5">
                                <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                                <p className="text-[11px] text-amber-200">
                                    {cuotaCanal.noEncontrados.length} número(s) de empleado del Excel no están dados de alta como
                                    participante y se omitieron: {cuotaCanal.noEncontrados.join(', ')}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-white/10" />

                    {/* REGLA 2 */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-black uppercase tracking-wider text-[#ee7624]">Regla 2 · Venta extra por bloque</h3>

                        <div className="space-y-2">
                            <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                                <Ticket className="w-3.5 h-3.5" />
                                Obtuvieron boleto(s) extra ({conBoletosBloque.length})
                            </h4>
                            {conBoletosBloque.length === 0 ? (
                                <p className="text-[11px] text-slate-500">Nadie excedió su base este mes.</p>
                            ) : (
                                <ul className="space-y-1.5">
                                    {conBoletosBloque.map((a) => (
                                        <li
                                            key={a.participanteId}
                                            className="flex items-center justify-between gap-3 bg-[#4A8B2C]/10 border border-[#4A8B2C]/30 rounded-xl px-3 py-2"
                                        >
                                            <span className="text-xs font-bold text-white">
                                                {a.nombre} <span className="text-slate-400 font-normal">· {a.bloque}</span>
                                            </span>
                                            <span className="text-[10px] text-emerald-300 font-mono">
                                                +${formatearMiles(a.ventaExtra)} → {a.boletos} boleto{a.boletos === 1 ? '' : 's'}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-[11px] font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                                <XCircle className="w-3.5 h-3.5" />
                                Sin boleto extra este mes ({sinBoletosBloque.length})
                            </h4>
                            {sinBoletosBloque.length === 0 ? (
                                <p className="text-[11px] text-slate-500">Todos excedieron su base.</p>
                            ) : (
                                <ul className="space-y-1.5">
                                    {sinBoletosBloque.map((a) => (
                                        <li
                                            key={a.participanteId}
                                            className="flex items-center justify-between gap-3 bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2"
                                        >
                                            <span className="text-xs font-bold text-white">
                                                {a.nombre} <span className="text-slate-400 font-normal">· {a.bloque}</span>
                                            </span>
                                            <span className="text-[10px] text-rose-300 font-mono">
                                                venta ${formatearMiles(a.ventaTotalMes)} / base ${formatearMiles(a.baseMensual)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancelar}
                        disabled={procesando}
                        className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold uppercase tracking-wide transition active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onAutorizar}
                        disabled={procesando || totalAplicados === 0}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#4A8B2C] via-emerald-600 to-[#ee7624] hover:brightness-110 active:scale-95 text-white text-xs font-black uppercase tracking-wider transition shadow-lg shadow-[#4A8B2C]/20 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {procesando ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        <span>Autorizar y aprobar mes</span>
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
