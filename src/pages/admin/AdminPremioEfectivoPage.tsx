import { useEffect, useState } from 'react';
import {
    CalendarDays,
    DollarSign,
    User,
    AlertTriangle,
    Save,
    CheckCircle2,
    XCircle,
    Users,
} from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { MESES_CONCURSO, useMesConcursoSeleccionado } from '../../lib/mesConcurso';
import type { ReportePremioEfectivo, TramoPremio } from '../../types/premioEfectivo';

function etiquetaDeMes(fecha: Date): string {
    const cruda = new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' }).format(fecha);
    return cruda.charAt(0).toUpperCase() + cruda.slice(1);
}

function formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(valor);
}

function formatearPorcentaje(valor: number): string {
    return `${(valor * 100).toFixed(2)}%`;
}

function obtenerIniciales(nombre?: string | null): string {
    if (!nombre) return '?';
    const partes = nombre.trim().split(/\s+/);
    return ((partes[0]?.[0] ?? '') + (partes[1]?.[0] ?? '')).toUpperCase();
}

export function AdminPremioEfectivoPage() {
    const [mesInput, setMesInput] = useMesConcursoSeleccionado();
    const [reporte, setReporte] = useState<ReportePremioEfectivo | null>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [formConfig, setFormConfig] = useState<{ presupuestoBase: string; umbralActivacion: string; topeMensual: string; tramos: TramoPremio[]; cebesScalingUp: string[] } | null>(null);
    const [guardandoConfig, setGuardandoConfig] = useState(false);

    const [anioTexto, mesTexto] = mesInput.split('-');
    const mesIndice = Number(mesTexto) - 1;
    const fechaReferencia = new Date(Number(anioTexto), mesIndice, 1);
    const mesClave = `${Number(anioTexto)}-${mesIndice + 1}`;
    const mesEtiqueta = etiquetaDeMes(fechaReferencia);

    async function cargarReporte() {
        setCargando(true);
        setError(null);
        try {
            const datos = await apiFetch<ReportePremioEfectivo>(`/api/premio-efectivo/${mesClave}`);
            setReporte(datos);
            setFormConfig({
                presupuestoBase: String(datos.config.presupuestoBase),
                umbralActivacion: String(datos.config.umbralActivacion),
                topeMensual: String(datos.config.topeMensual),
                tramos: datos.config.tramos,
                cebesScalingUp: datos.config.cebesScalingUp,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'No se pudo cargar el reporte.');
        } finally {
            setCargando(false);
        }
    }

    useEffect(() => {
        cargarReporte();
        // eslint-disabloks/exhaustive-deps
    }, [mesClave]);

    async function manejarGuardarConfig() {
        if (!formConfig) return;
        setGuardandoConfig(true);
        try {
            await apiFetch(`/api/premio-efectivo/${mesClave}/config`, {
                method: 'PUT',
                body: JSON.stringify({
                    presupuestoBase: Number(formConfig.presupuestoBase) || 0,
                    umbralActivacion: Number(formConfig.umbralActivacion) || 0,
                    topeMensual: Number(formConfig.topeMensual) || 0,
                    tramos: formConfig.tramos,
                    cebesScalingUp: formConfig.cebesScalingUp,
                }),
            });
            await cargarReporte();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'No se pudo guardar la configuración.');
        } finally {
            setGuardandoConfig(false);
        }
    }

    return (
        <div className="space-y-6 text-slate-100 pt-10">

            {/* AVISO: FÓRMULA SUJETA A CONFIRMAR */}


            {error && (
                <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-200 text-[11px] font-semibold rounded-2xl p-3.5">
                    <AlertTriangle className="w-4 h-4 text-rose-300 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* MES A CAPTURAR + PRESUPUESTO BASE */}
            <div className="bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-white/10 p-5 shadow-2xl">
                <div className="flex flex-wrap items-end gap-4">
                    <div className="max-w-xs space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5 text-[#ee7624]" />
                            <span>Mes a calcular</span>
                        </label>
                        <select
                            value={mesInput}
                            onChange={(e) => setMesInput(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-[#4A8B2C] focus:ring-1 focus:ring-[#4A8B2C] transition shadow-inner cursor-pointer"
                        >
                            {MESES_CONCURSO.map((m) => (
                                <option key={m.valor} value={m.valor} className="bg-slate-900 text-white">
                                    {m.etiqueta}
                                </option>
                            ))}
                        </select>
                    </div>

                    {formConfig && (
                        <>
                            <div className="max-w-xs space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                    <DollarSign className="w-3.5 h-3.5 text-[#ee7624]" />
                                    <span>Presupuesto base del mes</span>
                                </label>
                                <input
                                    type="number"
                                    value={formConfig.presupuestoBase}
                                    onChange={(e) => setFormConfig({ ...formConfig, presupuestoBase: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-[#4A8B2C] focus:ring-1 focus:ring-[#4A8B2C] transition shadow-inner"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={manejarGuardarConfig}
                                disabled={guardandoConfig}
                                className="flex items-center gap-2 bg-gradient-to-r from-[#4A8B2C] via-emerald-600 to-[#ee7624] hover:brightness-110 active:scale-95 text-white text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-2xl transition cursor-pointer disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {guardandoConfig ? 'Guardando...' : 'Guardar'}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {cargando || !reporte || !formConfig ? (
                <div className="bg-slate-900/60 border border-dashed border-white/15 rounded-3xl p-12 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cargando...</p>
                </div>
            ) : (
                <>


                    {!reporte.compania.activa ? (
                        <div className="bg-gradient-to-br from-[#ee7624]/10 via-slate-900/90 to-slate-900/90 backdrop-blur-xl border border-[#ee7624]/30 rounded-3xl p-10 shadow-2xl text-center space-y-5">
                            <div className="mx-auto w-16 h-16 rounded-2xl bg-[#ee7624]/15 border border-[#ee7624]/30 flex items-center justify-center">
                                <AlertTriangle className="w-8 h-8 text-[#ee7624]" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-black text-white">Aún no se activa el Premio Efectivo de {mesEtiqueta}</h3>
                                <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                                    Para repartir dinero, la venta real tiene que superar el presupuesto base por al menos{' '}
                                    <span className="font-bold text-white">{formatearMoneda(reporte.config.umbralActivacion)}</span>.
                                    {reporte.compania.excedente < reporte.config.umbralActivacion && (
                                        <>
                                            {' '}Todavía faltan{' '}
                                            <span className="font-bold text-[#ee7624]">
                                                {formatearMoneda(Math.max(0, reporte.config.umbralActivacion - reporte.compania.excedente))}
                                            </span>{' '}
                                            para llegar a ese umbral.
                                        </>
                                    )}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                                <div className="bg-slate-950/50 rounded-2xl border border-white/10 px-5 py-3 text-center min-w-[140px]">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Venta real</p>
                                    <p className="text-sm font-black text-white">{formatearMoneda(reporte.compania.ventaReal)}</p>
                                </div>
                                <div className="bg-slate-950/50 rounded-2xl border border-white/10 px-5 py-3 text-center min-w-[140px]">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Presupuesto base</p>
                                    <p className="text-sm font-black text-white">{formatearMoneda(reporte.compania.presupuestoBase)}</p>
                                </div>
                                <div className="bg-slate-950/50 rounded-2xl border border-white/10 px-5 py-3 text-center min-w-[140px]">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Excedente actual</p>
                                    <p className="text-sm font-black text-white">{formatearMoneda(reporte.compania.excedente)}</p>
                                </div>
                                <div className="bg-slate-950/50 rounded-2xl border border-white/10 px-5 py-3 text-center min-w-[140px]">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Umbral requerido</p>
                                    <p className="text-sm font-black text-white">{formatearMoneda(reporte.config.umbralActivacion)}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* RESUMEN COMPAÑÍA */}
                            <div className="bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-white/10 p-5 shadow-2xl space-y-4">
                                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                    <DollarSign className="w-3.5 h-3.5 text-[#ee7624]" />
                                    <span>Compañía · {mesEtiqueta}</span>
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div className="bg-slate-950/50 rounded-2xl border border-white/10 p-4 text-center space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Venta real</p>
                                        <p className="text-sm font-black text-white">{formatearMoneda(reporte.compania.ventaReal)}</p>
                                    </div>
                                    <div className="bg-slate-950/50 rounded-2xl border border-white/10 p-4 text-center space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Excedente</p>
                                        <p className="text-sm font-black text-white">{formatearMoneda(reporte.compania.excedente)}</p>
                                    </div>
                                    <div className="bg-slate-950/50 rounded-2xl border border-white/10 p-4 text-center space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tramo / Tasa</p>
                                        <p className="text-sm font-black text-white">
                                            {reporte.compania.tramo ? formatearPorcentaje(reporte.compania.tramo.tasa) : '—'}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border p-4 text-center space-y-1 bg-[#4A8B2C]/10 border-[#4A8B2C]/30">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                                            Bolsa total
                                        </p>
                                        <p className="text-sm font-black text-emerald-300">
                                            {formatearMoneda(reporte.compania.bolsaTotal)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* TABLA POR VENDEDOR */}
                            <div className="relative w-full bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden text-slate-100">
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
                                                <th className='px-5 py-4 text-center'>Premio total</th>
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
                                    </table>
                                </div>
                            </div>

                            {/* RESUMEN POR SUPERVISOR */}
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
                        </>
                    )}
                </>
            )}
        </div>
    );
}
