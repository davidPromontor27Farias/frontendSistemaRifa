import { useEffect, useMemo, useState } from 'react';
import {
    ClipboardCheck,
    Percent,
    Boxes,
    FileCheck2,
    CalendarDays,
    Save,
    Ticket,
    CheckCircle2,
    RotateCcw,
} from 'lucide-react';
import { useParticipantes } from '../../store/participantesStore';
import {
    useMatrizVentas,
    BLOQUES_VENTAS,
    calcularBoletosPorVentaExtra,
    BOLETOS_POR_CUOTA,
    BOLETOS_POR_ESPECIFICACION,
} from '../../store/matrizVentasStore';
import { TablaMatrizVentas } from '../../components/admin/TablaMatrizVentas';
import type { FilaMatrizVentas } from '../../types/matrizVentas';

function etiquetaDeMes(fecha: Date): string {
    const cruda = new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' }).format(fecha);
    return cruda.charAt(0).toUpperCase() + cruda.slice(1);
}

function valorInputMesActual(): string {
    const ahora = new Date();
    return `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}`;
}

function formatearFecha(iso: string): string {
    return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
}

function formatearMiles(valor: number): string {
    return new Intl.NumberFormat('es-MX').format(valor);
}

export function AdminCierreMesPage() {
    const { activos, lista } = useParticipantes();
    const { obtenerCierre, guardarCierre } = useMatrizVentas();

    const [mesInput, setMesInput] = useState(valorInputMesActual);
    const [filas, setFilas] = useState<FilaMatrizVentas[]>([]);
    const [aprobado, setAprobado] = useState(false);
    const [fechaAprobacion, setFechaAprobacion] = useState<string | null>(null);
    const [guardadoRecientemente, setGuardadoRecientemente] = useState(false);

    const [anioTexto, mesTexto] = mesInput.split('-');
    const mesIndice = Number(mesTexto) - 1;
    const fechaReferencia = new Date(Number(anioTexto), mesIndice, 1);
    const mesClave = `${Number(anioTexto)}-${mesIndice + 1}`;
    const mesEtiqueta = etiquetaDeMes(fechaReferencia);

    const activosOrdenados = useMemo(
        () => [...activos].sort((a, b) => a.nombre.localeCompare(b.nombre)),
        [activos]
    );

    useEffect(() => {
        const existente = obtenerCierre(mesClave);
        const filasGuardadasPorId = new Map((existente?.filas ?? []).map((f) => [f.participanteId, f]));
        const filasCompletas = activosOrdenados.map(
            (p): FilaMatrizVentas =>
                filasGuardadasPorId.get(p.id) ?? {
                    participanteId: p.id,
                    cuotaCumplida: false,
                    bloque: null,
                    ventaExtra: 0,
                    ventaExtraCastigada: 0,
                    especificaciones: 0,
                }
        );
        setFilas(filasCompletas);
        setAprobado(existente?.aprobado ?? false);
        setFechaAprobacion(existente?.fechaAprobacion ?? null);
        setGuardadoRecientemente(false);
        // Se recarga al cambiar de mes o al cambiar el padrón de activos; no reacciona a cada guardado para no pisar la edición en curso.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mesClave, activosOrdenados]);

    const participantePorId = useMemo(() => new Map(lista.map((p) => [p.id, p])), [lista]);

    const filasConParticipante = filas.map((fila) => ({
        fila,
        participante: participantePorId.get(fila.participanteId),
    }));

    const totales = filas.reduce(
        (acc, fila) => {
            acc.porCuota += fila.cuotaCumplida ? BOLETOS_POR_CUOTA : 0;
            acc.porBloques += calcularBoletosPorVentaExtra(fila);
            acc.porEspecificaciones += fila.especificaciones * BOLETOS_POR_ESPECIFICACION;
            return acc;
        },
        { porCuota: 0, porBloques: 0, porEspecificaciones: 0 }
    );
    const totalBoletos = totales.porCuota + totales.porBloques + totales.porEspecificaciones;

    function actualizarFila(indice: number, cambios: Partial<FilaMatrizVentas>) {
        setFilas((actual) => actual.map((f, i) => (i === indice ? { ...f, ...cambios } : f)));
        setGuardadoRecientemente(false);
    }

    function construirCierre(marcarAprobado: boolean) {
        return {
            mesClave,
            mesEtiqueta,
            filas,
            aprobado: marcarAprobado,
            fechaGuardado: new Date().toISOString(),
            fechaAprobacion: marcarAprobado ? new Date().toISOString() : null,
        };
    }

    function manejarGuardarBorrador() {
        const cierre = construirCierre(false);
        guardarCierre(cierre);
        setAprobado(false);
        setFechaAprobacion(null);
        setGuardadoRecientemente(true);
    }

    function manejarAprobar() {
        const cierre = construirCierre(true);
        guardarCierre(cierre);
        setAprobado(true);
        setFechaAprobacion(cierre.fechaAprobacion);
        setGuardadoRecientemente(true);
    }

    function manejarReabrir() {
        const cierre = construirCierre(false);
        guardarCierre(cierre);
        setAprobado(false);
        setFechaAprobacion(null);
        setGuardadoRecientemente(false);
    }

    return (
        <div className="space-y-6 text-slate-100 pt-10">

            {/* ENCABEZADO DE LA SECCIÓN */}
            <div className="bg-slate-900/85 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#4A8B2C]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex items-center gap-3.5">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-[#4A8B2C]/20 to-[#ee7624]/20 border border-white/15 text-[#ee7624] shadow-inner shrink-0">
                        <ClipboardCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                Cierre de Mes · Matriz de Ventas
                            </h1>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#4A8B2C]/20 border border-[#4A8B2C]/30 text-[#4A8B2C] text-[10px] font-black uppercase tracking-widest">
                                Paso 3A · 3B
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                            El administrador valida el cumplimiento de ventas y aprueba la generación de boletos del mes.
                        </p>
                    </div>
                </div>
            </div>

            {/* ESTATUS DE APROBACIÓN */}
            {aprobado && fechaAprobacion && (
                <div className="flex items-center gap-3 bg-[#4A8B2C]/10 border border-[#4A8B2C]/30 text-emerald-300 text-xs sm:text-sm font-semibold rounded-2xl p-4 backdrop-blur-md shadow-lg">
                    <div className="p-2 rounded-xl bg-[#4A8B2C]/20 border border-[#4A8B2C]/30 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <p className="leading-relaxed flex-1">
                        <strong className="font-bold">Cierre aprobado</strong> el {formatearFecha(fechaAprobacion)} — estos boletos ya cuentan para los acumulados y la tómbola.
                    </p>
                    <button
                        type="button"
                        onClick={manejarReabrir}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-[11px] font-bold uppercase tracking-wide transition active:scale-95 cursor-pointer shrink-0"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reabrir para editar
                    </button>
                </div>
            )}

            {/* MATRIZ DE CUMPLIMIENTO POR VENTAS (REGLAS) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900/85 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-xl space-y-2.5">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-[#4A8B2C]/20 border border-[#4A8B2C]/30 text-emerald-300 shrink-0">
                            <Percent className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs font-black text-white uppercase tracking-wide">1 · Canal y cuota</h3>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                        <strong className="text-slate-300">Regla:</strong> 100% en un canal y al menos 90% en el otro.
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                        <strong className="text-slate-300">Captura:</strong> el administrador marca la casilla.
                    </p>
                    <p className="text-[11px] text-[#ee7624] font-semibold leading-relaxed">
                        Sistema: asigna {BOLETOS_POR_CUOTA} boleto de cuota.
                    </p>
                </div>

                <div className="bg-slate-900/85 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-xl space-y-2.5">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-[#4A8B2C]/20 border border-[#4A8B2C]/30 text-emerald-300 shrink-0">
                            <Boxes className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs font-black text-white uppercase tracking-wide">2 · Venta extra por bloque</h3>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                        <strong className="text-slate-300">Regla:</strong> excedente sobre el mayor entre presupuesto y promedio mensual 2026.
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                        <strong className="text-slate-300">Captura:</strong> bloque del vendedor y venta extra en pesos.
                    </p>
                    <p className="text-[11px] text-[#ee7624] font-semibold leading-relaxed">
                        Sistema: 1 boleto por cada umbral de su bloque, sin límite.
                    </p>
                </div>

                <div className="bg-slate-900/85 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-xl space-y-2.5">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-[#4A8B2C]/20 border border-[#4A8B2C]/30 text-emerald-300 shrink-0">
                            <FileCheck2 className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs font-black text-white uppercase tracking-wide">3 · Especificaciones</h3>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                        <strong className="text-slate-300">Regla:</strong> aceptadas con venta estimada &ge; 3M.
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                        <strong className="text-slate-300">Captura:</strong> número logrado en el mes.
                    </p>
                    <p className="text-[11px] text-[#ee7624] font-semibold leading-relaxed">
                        Sistema: suma {BOLETOS_POR_ESPECIFICACION} boleto por cada una.
                    </p>
                </div>
            </div>

            {/* MES A CAPTURAR + BLOQUES VIGENTES */}
            <div className="bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-white/10 p-5 shadow-2xl space-y-4">
                <div className="max-w-xs space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-[#ee7624]" />
                        <span>Mes a capturar</span>
                    </label>
                    <input
                        type="month"
                        value={mesInput}
                        onChange={(e) => setMesInput(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-[#4A8B2C] focus:ring-1 focus:ring-[#4A8B2C] transition shadow-inner cursor-pointer"
                    />
                </div>

                {/* BLOQUES VIGENTES (fijos, referencia) */}
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bloques vigentes este mes</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {BLOQUES_VENTAS.map((b) => (
                            <div key={b.nombre} className="px-3 py-2.5 rounded-xl bg-slate-950/60 border border-white/10">
                                <p className="text-[11px] font-bold text-white">{b.nombre}</p>
                                <p className="text-[10px] text-slate-400">{b.rango}</p>
                                <p className="text-[10px] text-[#ee7624] font-semibold mt-0.5">+${formatearMiles(b.umbralExtra)} / boleto</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* TABLA DE MATRIZ */}
            <TablaMatrizVentas
                filas={filasConParticipante}
                onCambiarCuota={(i, valor) => actualizarFila(i, { cuotaCumplida: valor })}
                onCambiarBloque={(i, valor) => actualizarFila(i, { bloque: valor || null })}
                onCambiarVentaExtra={(i, valor) => actualizarFila(i, { ventaExtra: valor })}
                onCambiarVentaExtraCastigada={(i, valor) => actualizarFila(i, { ventaExtraCastigada: valor })}
                onCambiarEspecificaciones={(i, valor) => actualizarFila(i, { especificaciones: valor })}
            />

            {/* RESUMEN DEL MES */}
            <div className="bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-white/10 p-5 shadow-2xl space-y-4">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-[#ee7624]" />
                    <span>Resumen · {mesEtiqueta}</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-950/50 rounded-2xl border border-white/10 p-4 text-center space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Por cuota</p>
                        <p className="text-xl font-black text-white">{totales.porCuota}</p>
                    </div>
                    <div className="bg-slate-950/50 rounded-2xl border border-white/10 p-4 text-center space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Por venta extra</p>
                        <p className="text-xl font-black text-white">{totales.porBloques}</p>
                    </div>
                    <div className="bg-slate-950/50 rounded-2xl border border-white/10 p-4 text-center space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Por especificaciones</p>
                        <p className="text-xl font-black text-white">{totales.porEspecificaciones}</p>
                    </div>
                    <div className="bg-[#ee7624]/10 rounded-2xl border border-[#ee7624]/30 p-4 text-center space-y-1">
                        <p className="text-[10px] font-bold text-[#ee7624] uppercase tracking-wider">Total del mes</p>
                        <p className="text-xl font-black text-[#ee7624]">{totalBoletos}</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-3 pt-2 border-t border-white/10">
                    {guardadoRecientemente && (
                        <span className="text-[11px] font-semibold text-emerald-300">Cambios guardados ✓</span>
                    )}
                    <button
                        type="button"
                        onClick={manejarGuardarBorrador}
                        disabled={filas.length === 0}
                        className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 active:scale-95 text-slate-200 text-xs font-black uppercase tracking-wider px-5 py-3 rounded-2xl transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Save className="w-4 h-4" />
                        <span>Guardar Borrador</span>
                    </button>
                    <button
                        type="button"
                        onClick={manejarAprobar}
                        disabled={filas.length === 0}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#4A8B2C] via-emerald-600 to-[#ee7624] hover:brightness-110 active:scale-95 text-white text-xs font-black uppercase tracking-wider px-6 py-3 rounded-2xl transition cursor-pointer shadow-lg shadow-[#4A8B2C]/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:brightness-100"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Aprobar y Generar Boletos</span>
                    </button>
                </div>
            </div>

        </div>
    );
}
