import { useEffect, useState } from 'react';
import { DollarSign, AlertTriangle, Save, CheckCircle2, XCircle, User, Users, Download } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import type { ReporteConcursoSemanal, SemanaConcursoSemanal } from '../../types/concursoSemanal';
import { exportarExcel } from '../../utils/exportarExcel';

function formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(valor);
}

function formatearPct(valor: number): string {
    return `${valor.toFixed(2)}%`;
}

function obtenerIniciales(nombre?: string | null): string {
    if (!nombre) return '?';
    const partes = nombre.trim().split(/\s+/);
    return ((partes[0]?.[0] ?? '') + (partes[1]?.[0] ?? '')).toUpperCase();
}

interface Props {
    mesClave: string;
    mesEtiqueta: string;
    refreshKey?: number;
}

type SemanaForm = Pick<SemanaConcursoSemanal, 'numero' | 'etiqueta' | 'metaSemanal' | 'ventaReal' | 'ratioIncremento'>;

export function ReporteConcursoSemanalNoviembre({ mesClave, mesEtiqueta, refreshKey }: Props) {
    const [reporte, setReporte] = useState<ReporteConcursoSemanal | null>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [formSemanas, setFormSemanas] = useState<SemanaForm[] | null>(null);
    const [guardando, setGuardando] = useState(false);

    async function cargarReporte() {
        setCargando(true);
        setError(null);
        try {
            const datos = await apiFetch<ReporteConcursoSemanal>(`/api/concurso-semanal/${mesClave}`);
            setReporte(datos);
            setFormSemanas(
                datos.concurso.semanas.map((s) => ({
                    numero: s.numero,
                    etiqueta: s.etiqueta,
                    metaSemanal: s.metaSemanal,
                    ventaReal: s.ventaReal,
                    ratioIncremento: s.ratioIncremento,
                }))
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'No se pudo cargar el reporte.');
        } finally {
            setCargando(false);
        }
    }

    useEffect(() => {
        cargarReporte();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mesClave, refreshKey]);

    async function manejarGuardarSemanas() {
        if (!formSemanas) return;
        setGuardando(true);
        try {
            await apiFetch(`/api/concurso-semanal/${mesClave}/semanas`, {
                method: 'PUT',
                body: JSON.stringify({ semanas: formSemanas }),
            });
            await cargarReporte();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'No se pudieron guardar las semanas.');
        } finally {
            setGuardando(false);
        }
    }

    function actualizarSemana(numero: number, campo: 'metaSemanal' | 'ventaReal', valor: string) {
        if (!formSemanas) return;
        setFormSemanas(
            formSemanas.map((s) => (s.numero === numero ? { ...s, [campo]: Number(valor) || 0 } : s))
        );
    }

    function exportarVendedores() {
        if (!reporte) return;
        const datos = reporte.porVendedor.map((v) => ({
            Vendedor: v.nombre,
            Venta: v.ventaTotal,
            Meta: v.metaTotal,
            Excedente: v.excedente,
            Elegible: v.elegible ? 'Sí' : 'No',
            'Detalle cuota': v.detalleCuota,
            'Premio ejecutivo': v.premioEjecutivo,
            'Premio supervisor': v.premioSupervisor,
            'Premio total': v.premioTotal,
        }));
        exportarExcel(datos, `premio_efectivo_${mesClave}.xlsx`, 'Premio Efectivo');
    }

    if (cargando || !reporte || !formSemanas) {
        return (
            <div className="bg-slate-900/60 border border-dashed border-white/15 rounded-3xl p-12 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cargando...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {error && (
                <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-200 text-[11px] font-semibold rounded-2xl p-3.5">
                    <AlertTriangle className="w-4 h-4 text-rose-300 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* TABLA DE SEMANAS */}
            <div className="bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-white/10 p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#ee7624]" />
                        <span>Metas y ventas por semana · {mesEtiqueta}</span>
                    </label>
                    <button
                        type="button"
                        onClick={manejarGuardarSemanas}
                        disabled={guardando}
                        className="flex items-center gap-2 bg-gradient-to-r from-[#4A8B2C] via-emerald-600 to-[#ee7624] hover:brightness-110 active:scale-95 text-white text-xs font-black uppercase tracking-wider px-4 py-2 rounded-2xl transition cursor-pointer disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {guardando ? 'Guardando...' : 'Guardar semanas'}
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="bg-slate-950/60 border-b border-white/10 text-[10px] font-black uppercase tracking-wider text-slate-400">
                                <th className="px-4 py-3">Semana</th>
                                <th className="px-4 py-3">Ratio incremento</th>
                                <th className="px-4 py-3">Meta semanal</th>
                                <th className="px-4 py-3">Venta real</th>
                                <th className="px-4 py-3 text-center">% Exceso</th>
                                <th className="px-4 py-3 text-center">% Incremento</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-white/5">
                            {formSemanas.map((s) => {
                                const calculada = reporte.concurso.semanas.find((c) => c.numero === s.numero);
                                return (
                                    <tr key={s.numero}>
                                        <td className="px-4 py-3 font-bold text-white">{s.etiqueta}</td>
                                        <td className="px-4 py-3 text-slate-400">{(s.ratioIncremento * 100).toFixed(2)}%</td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="number"
                                                value={s.metaSemanal}
                                                onChange={(e) => actualizarSemana(s.numero, 'metaSemanal', e.target.value)}
                                                className="w-32 px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-[#4A8B2C]"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="number"
                                                value={s.ventaReal}
                                                onChange={(e) => actualizarSemana(s.numero, 'ventaReal', e.target.value)}
                                                className="w-32 px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-[#4A8B2C]"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-center text-slate-300">
                                            {formatearPct(calculada?.excesoPct ?? 0)}
                                        </td>
                                        <td className="px-4 py-3 text-center font-bold text-emerald-300">
                                            {formatearPct(calculada?.incrementoPct ?? 0)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* RESUMEN DEL CONCURSO */}
            <div className="bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-white/10 p-5 shadow-2xl space-y-4">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#ee7624]" />
                    <span>Concurso comercial · {mesEtiqueta}</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    <div className="bg-slate-950/50 rounded-2xl border border-white/10 p-4 text-center space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Meta mensual</p>
                        <p className="text-sm font-black text-white">{formatearMoneda(reporte.concurso.metaMensual)}</p>
                    </div>
                    <div className="bg-slate-950/50 rounded-2xl border border-white/10 p-4 text-center space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Venta real</p>
                        <p className="text-sm font-black text-white">{formatearMoneda(reporte.concurso.ventaMensual)}</p>
                    </div>
                    <div className="bg-slate-950/50 rounded-2xl border border-white/10 p-4 text-center space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">% Avance</p>
                        <p className="text-sm font-black text-white">
                            {formatearPct(reporte.concurso.metaMensual > 0 ? (reporte.concurso.ventaMensual / reporte.concurso.metaMensual) * 100 : 0)}
                        </p>
                    </div>
                    <div className="bg-slate-950/50 rounded-2xl border border-white/10 p-4 text-center space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Incremento acumulado</p>
                        <p className="text-sm font-black text-emerald-300">{formatearPct(reporte.concurso.incrementoAcumuladoPct)}</p>
                    </div>
                    <div className="rounded-2xl border p-4 text-center space-y-1 bg-[#4A8B2C]/10 border-[#4A8B2C]/30">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Premio total</p>
                        <p className="text-sm font-black text-emerald-300">{formatearMoneda(reporte.concurso.premioTotal)}</p>
                    </div>
                </div>
            </div>

            {/* TABLA POR VENDEDOR */}
            <div className="relative w-full bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden text-slate-100">
                <div className="flex items-center justify-end px-5 py-3 border-b border-white/10">
                    <button
                        type="button"
                        onClick={exportarVendedores}
                        className="flex items-center gap-2 bg-gradient-to-r from-[#4A8B2C] via-emerald-600 to-[#ee7624] hover:brightness-110 active:scale-95 text-white text-xs font-black uppercase tracking-wider px-4 py-2 rounded-2xl transition cursor-pointer"
                    >
                        <Download className="w-4 h-4" />
                        Exportar a Excel
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="bg-slate-950/60 border-b border-white/10 text-[10px] font-black uppercase tracking-wider text-slate-400">
                                <th className="px-5 py-4">Vendedor</th>
                                <th className="px-5 py-4 text-center">Venta</th>
                                <th className="px-5 py-4 text-center">Meta</th>
                                <th className="px-5 py-4 text-center">Excedente</th>
                                <th className="px-5 py-4 text-center">Elegible</th>
                                <th className="px-5 py-4 text-center">Premio ejecutivo</th>
                                <th className="px-5 py-4 text-center">Premio supervisor</th>
                                <th className="px-5 py-4 text-center">Premio total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {reporte.porVendedor.map((v) => (
                                <tr key={v.participanteId} className="hover:bg-white/5 transition-colors duration-150 group">
                                    <td className="px-5 py-4 font-bold text-white">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4A8B2C]/20 to-[#ee7624]/20 border border-white/15 text-white flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm">
                                                {obtenerIniciales(v.nombre)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-white truncate">{v.nombre}</p>
                                                <p className="text-[10px] text-slate-400 font-mono truncate">{v.detalleCuota}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-center text-slate-300">{formatearMoneda(v.ventaTotal)}</td>
                                    <td className="px-5 py-4 text-center text-slate-400">{formatearMoneda(v.metaTotal)}</td>
                                    <td className="px-5 py-4 text-center text-slate-300">{formatearMoneda(v.excedente)}</td>
                                    <td className="px-5 py-4 text-center">
                                        {v.elegible ? (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-rose-400 inline" />
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-center font-black text-[#ee7624]">{formatearMoneda(v.premioEjecutivo)}</td>
                                    <td className="px-5 py-4 text-center font-black text-emerald-300">{formatearMoneda(v.premioSupervisor)}</td>
                                    <td className="px-5 py-4 text-center font-black text-white">{formatearMoneda(v.premioTotal)}</td>
                                </tr>
                            ))}
                            {reporte.porVendedor.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-5 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <User className="w-8 h-8 text-slate-600 stroke-[1.5]" />
                                            <p className="text-xs font-bold text-slate-400">No hay vendedores para este mes</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        {reporte.porVendedor.length > 0 && (
                            <tfoot>
                                <tr className="bg-slate-950/80 border-t-2 border-white/15 text-[11px] font-black uppercase tracking-wider">
                                    <td className="px-5 py-4 text-white">Totales</td>
                                    <td className="px-5 py-4 text-center text-slate-200">
                                        {formatearMoneda(reporte.porVendedor.reduce((acc, v) => acc + v.ventaTotal, 0))}
                                    </td>
                                    <td className="px-5 py-4 text-center text-slate-300">
                                        {formatearMoneda(reporte.porVendedor.reduce((acc, v) => acc + v.metaTotal, 0))}
                                    </td>
                                    <td className="px-5 py-4 text-center text-slate-200">
                                        {formatearMoneda(reporte.porVendedor.reduce((acc, v) => acc + v.excedente, 0))}
                                    </td>
                                    <td className="px-5 py-4"></td>
                                    <td className="px-5 py-4 text-center text-[#ee7624]">
                                        {formatearMoneda(reporte.porVendedor.reduce((acc, v) => acc + v.premioEjecutivo, 0))}
                                    </td>
                                    <td className="px-5 py-4 text-center text-emerald-300">
                                        {formatearMoneda(reporte.porVendedor.reduce((acc, v) => acc + v.premioSupervisor, 0))}
                                    </td>
                                    <td className="px-5 py-4 text-center text-white">
                                        {formatearMoneda(reporte.porVendedor.reduce((acc, v) => acc + v.premioTotal, 0))}
                                    </td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>

            <div className="bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-white/10 p-5 shadow-2xl space-y-4">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#ee7624]" />
                    <span>Resumen por supervisor</span>
                </label>
                {reporte.porSupervisor.length === 0 ? (
                    <p className="text-[11px] text-slate-500">Aún no hay premios de supervisor que consolidar este mes.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {reporte.porSupervisor.map((s) => (
                            <div key={s.supervisorId} className="bg-slate-950/50 rounded-2xl border border-white/10 p-4 space-y-2">
                                <p className="text-xs font-bold text-white">{s.nombre}</p>
                                <p className="text-lg font-black text-emerald-300">{formatearMoneda(s.totalRecibido)}</p>
                                <div className="space-y-1">
                                    {s.vendedores.map((v) => (
                                        <p key={v.nombre} className="text-[10px] text-slate-400 flex justify-between">
                                            <span className="truncate">{v.nombre}</span>
                                            <span>{formatearMoneda(v.aporte)}</span>
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
