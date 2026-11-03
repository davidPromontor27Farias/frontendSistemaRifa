import { useEffect, useMemo, useRef, useState } from 'react';
import {
    CalendarDays,
    Save,
    Ticket,
    CheckCircle2,
    RotateCcw,
    UploadCloud,
    AlertTriangle,
} from 'lucide-react';
import { useParticipantes } from '../../store/participantesStore';
import {
    useMatrizVentas,
    calcularBoletosPorVentaExtra,
    BOLETOS_POR_CUOTA,
    BOLETOS_POR_ESPECIFICACION,
} from '../../store/matrizVentasStore';
import { TablaMatrizVentas } from '../../components/admin/TablaMatrizVentas';
import { ModalResultadoExcelVentas, type ResultadoProcesarExcelVentas } from '../../components/admin/ModalResultadoExcelVentas';
import type { FilaMatrizVentas } from '../../types/matrizVentas';
import { apiFetch } from '../../lib/api';
import { MESES_CONCURSO, useMesConcursoSeleccionado } from '../../lib/mesConcurso';

function etiquetaDeMes(fecha: Date): string {
    const cruda = new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' }).format(fecha);
    return cruda.charAt(0).toUpperCase() + cruda.slice(1);
}

function formatearFecha(iso: string): string {
    return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
}

export function AdminCierreMesPage() {
    const { lista } = useParticipantes();
    const { obtenerCierre, guardarCierre } = useMatrizVentas();

    const [mesInput, setMesInput] = useMesConcursoSeleccionado();
    const [filas, setFilas] = useState<FilaMatrizVentas[]>([]);
    const [aprobado, setAprobado] = useState(false);
    const [fechaAprobacion, setFechaAprobacion] = useState<string | null>(null);
    const [guardadoRecientemente, setGuardadoRecientemente] = useState(false);

    const inputExcelRef = useRef<HTMLInputElement>(null);
    const [cargandoExcel, setCargandoExcel] = useState(false);
    const [errorExcel, setErrorExcel] = useState<string | null>(null);
    const [modalResultado, setModalResultado] = useState<ResultadoProcesarExcelVentas | null>(null);
    const [autorizando, setAutorizando] = useState(false);

    const [anioTexto, mesTexto] = mesInput.split('-');
    const mesIndice = Number(mesTexto) - 1;
    const fechaReferencia = new Date(Number(anioTexto), mesIndice, 1);
    const mesClave = `${Number(anioTexto)}-${mesIndice + 1}`;
    const mesEtiqueta = etiquetaDeMes(fechaReferencia);

    useEffect(() => {
        const existente = obtenerCierre(mesClave);
        setFilas(existente?.filas ?? []);
        setAprobado(existente?.aprobado ?? false);
        setFechaAprobacion(existente?.fechaAprobacion ?? null);
        setGuardadoRecientemente(false);
        // Se recarga al cambiar de mes; no reacciona a cada guardado para no pisar la edición en curso.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mesClave]);

    const participantePorId = useMemo(() => new Map(lista.map((p) => [p.id, p])), [lista]);

    const filasConParticipante = filas.map((fila) => ({
        fila,
        participante: participantePorId.get(fila.participanteId),
    }));

    const totales = filas.reduce(
        (acc, fila) => {
            if (!fila.cuotaCumplida) return acc;
            acc.porCuota += BOLETOS_POR_CUOTA;
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

    function construirCierre(filasFinales: FilaMatrizVentas[], marcarAprobado: boolean) {
        return {
            mesClave,
            mesEtiqueta,
            filas: filasFinales,
            aprobado: marcarAprobado,
            fechaGuardado: new Date().toISOString(),
            fechaAprobacion: marcarAprobado ? new Date().toISOString() : null,
        };
    }

    async function manejarGuardarBorrador() {
        const cierre = construirCierre(filas, false);
        await guardarCierre(cierre);
        setAprobado(false);
        setFechaAprobacion(null);
        setGuardadoRecientemente(true);
    }

    async function manejarAprobar() {
        const cierre = construirCierre(filas, true);
        await guardarCierre(cierre);
        setAprobado(true);
        setFechaAprobacion(cierre.fechaAprobacion);
        setGuardadoRecientemente(true);
    }

    async function manejarReabrir() {
        const cierre = construirCierre(filas, false);
        await guardarCierre(cierre);
        setAprobado(false);
        setFechaAprobacion(null);
        setGuardadoRecientemente(false);
    }

    function abrirSelectorExcel() {
        inputExcelRef.current?.click();
    }

    async function manejarArchivoExcelSeleccionado(evento: React.ChangeEvent<HTMLInputElement>) {
        const archivo = evento.target.files?.[0];
        evento.target.value = '';
        if (!archivo) return;

        setCargandoExcel(true);
        setErrorExcel(null);
        try {
            const formData = new FormData();
            formData.append('archivo', archivo);
            const resultado = await apiFetch<ResultadoProcesarExcelVentas>(
                `/api/cierre-mes/${mesClave}/procesar-excel-ventas`,
                { method: 'POST', body: formData }
            );
            setModalResultado(resultado);
        } catch (error) {
            setErrorExcel(error instanceof Error ? error.message : 'No se pudo procesar el archivo.');
        } finally {
            setCargandoExcel(false);
        }
    }

    async function manejarAutorizarModal() {
        if (!modalResultado) return;
        setAutorizando(true);
        try {
            const filasPorParticipanteId = new Map(filas.map((f) => [f.participanteId, f]));
            const cuotaPorParticipanteId = new Map(modalResultado.cuotaCanal.aplicados.map((a) => [a.participanteId, a]));
            const bloquePorParticipanteId = new Map(modalResultado.ventaExtraBloque.aplicados.map((a) => [a.participanteId, a]));

            const idsParticipantes = new Set([...cuotaPorParticipanteId.keys(), ...bloquePorParticipanteId.keys()]);

            const filasFinales: FilaMatrizVentas[] = [...idsParticipantes].map((participanteId) => {
                const existente = filasPorParticipanteId.get(participanteId);
                const cuota = cuotaPorParticipanteId.get(participanteId);
                const bloqueInfo = bloquePorParticipanteId.get(participanteId);

                return {
                    participanteId,
                    cuotaCumplida: cuota?.cuotaCumplida ?? existente?.cuotaCumplida ?? false,
                    detalleCuota: cuota?.detalleCuota ?? existente?.detalleCuota ?? null,
                    bloque: bloqueInfo?.bloque ?? existente?.bloque ?? null,
                    ventaExtra: bloqueInfo?.ventaExtra ?? existente?.ventaExtra ?? 0,
                    ventaExtraCastigada: existente?.ventaExtraCastigada ?? 0,
                    especificaciones: existente?.especificaciones ?? 0,
                };
            });

            const cierre = construirCierre(filasFinales, true);
            await guardarCierre(cierre);
            setFilas(filasFinales);
            setAprobado(true);
            setFechaAprobacion(cierre.fechaAprobacion);
            setGuardadoRecientemente(true);
            setModalResultado(null);
        } finally {
            setAutorizando(false);
        }
    }

    return (
        <div className="space-y-6 text-slate-100 pt-10">

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

            {/* MES A CAPTURAR + CARGA DE EXCEL + BLOQUES VIGENTES */}
            <div className="bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-white/10 p-5 shadow-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                    <div className="max-w-xs space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5 text-[#ee7624]" />
                            <span>Mes a capturar</span>
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

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <UploadCloud className="w-3.5 h-3.5 text-[#ee7624]" />
                            <span>Regla 1 · Cuota por canal</span>
                        </label>
                        <input
                            ref={inputExcelRef}
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={manejarArchivoExcelSeleccionado}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={abrirSelectorExcel}
                            disabled={cargandoExcel}
                            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold px-4 py-2.5 rounded-2xl active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <UploadCloud className="w-3.5 h-3.5 text-[#ee7624]" />
                            {cargandoExcel ? 'Procesando...' : 'Cargar Excel de vendedores'}
                        </button>
                    </div>
                </div>

                {errorExcel && (
                    <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-200 text-[11px] font-semibold rounded-2xl p-3.5">
                        <AlertTriangle className="w-4 h-4 text-rose-300 shrink-0" />
                        <span>{errorExcel}</span>
                    </div>
                )}

            </div>

            {/* TABLA DE MATRIZ */}
            <TablaMatrizVentas
                filas={filasConParticipante}
                onCambiarCuota={(i, valor) => actualizarFila(i, { cuotaCumplida: valor })}
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

            {modalResultado && (
                <ModalResultadoExcelVentas
                    resultado={modalResultado}
                    procesando={autorizando}
                    onCancelar={() => setModalResultado(null)}
                    onAutorizar={manejarAutorizarModal}
                />
            )}

        </div>
    );
}
