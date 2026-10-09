import { Users, AlertTriangle, Sparkles, FileText, User, UserPlus, X } from 'lucide-react';
import type { SeleccionNominado } from '../../types/rifa';

interface FormularioNominacionProps {
    seleccion: SeleccionNominado[];
    onAbrirSelector: (indice: number) => void;
    onQuitarColaborador: (indice: number) => void;
    onCambiarJustificacion: (indice: number, valor: string) => void;
    justificacionesValidas: boolean[];
    puedeConfirmar: boolean;
    onConfirmar: () => void;
}

export function FormularioNominacion({
    seleccion,
    onAbrirSelector,
    onQuitarColaborador,
    onCambiarJustificacion,
    justificacionesValidas,
    puedeConfirmar,
    onConfirmar,
}: FormularioNominacionProps) {
    return (
        /* Se usa w-full min-h-screen (o h-full) flex flex-col justify-between para cubrir toda la pantalla */
        <section className="relative w-full min-h-screen sm:min-h-0 sm:h-full flex flex-col justify-between overflow-hidden bg-slate-900/85 backdrop-blur-xl p-5 sm:p-8 rounded-none sm:rounded-[1.75rem] border-0 sm:border border-white/10 shadow-2xl space-y-6 text-slate-100">

            {/* Resplandor decorativo de fondo */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#4a8b2c]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ee7624]/10 rounded-full blur-3xl pointer-events-none" />

            {/* BLOQUE SUPERIOR / CONTENIDO PRINCIPAL */}
            <div className="relative z-10 space-y-6 flex-1">

                {/* ENCABEZADO DEL MÓDULO */}
                <div className="flex items-start gap-3.5 pb-4 border-b border-white/10">

                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                Registra tus votos
                            </h2>

                        </div>
                
                    </div>
                </div>

                {/* PASO 1: SELECCIÓN DE COLABORADORES Y JUSTIFICACIÓN INDIVIDUAL */}
                <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#ee7624]" />
                        <span>1. Reparte tus 2 boletos: uno para cada compañero</span>
                    </label>

                    <div className="space-y-3">
                        {seleccion.map((s, i) => {
                            const titulo = `Colaborador nominado ${i + 1} (recibe 1 boleto)`;
                            const justificacionValida = justificacionesValidas[i] ?? false;
                            const mostrarAlertaJustificacion = s.justificacion.trim().length > 0 && !justificacionValida;

                            return (
                                <div key={i} className="bg-slate-950/50 p-3.5 rounded-2xl border border-white/10 space-y-3">
                                    <label className="block text-xs font-semibold text-slate-400">{titulo}</label>

                                    {s.colaborador ? (
                                        <div className="flex items-center justify-between gap-2 px-3.5 py-3 rounded-xl border bg-[#4a8b2c]/10 border-[#4a8b2c]/30">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className="w-8 h-8 rounded-full bg-[#4a8b2c]/20 flex items-center justify-center shrink-0">
                                                    <User className="w-4 h-4 text-[#4a8b2c]" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-white truncate">{s.colaborador.nombre}</p>
                                                    <p className="text-xs text-slate-400 truncate">{[s.colaborador.departamento, s.colaborador.area].filter(Boolean).join(' · ')}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => onAbrirSelector(i)}
                                                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
                                                >
                                                    Cambiar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onQuitarColaborador(i)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 active:scale-90 transition-all"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => onAbrirSelector(i)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-dashed border-white/20 text-sm font-semibold text-slate-300 hover:border-[#4a8b2c]/50 hover:text-white hover:bg-[#4a8b2c]/5 transition-all cursor-pointer"
                                        >
                                            <UserPlus className="w-4 h-4" />
                                            Seleccionar colaborador
                                        </button>
                                    )}

                                    {/* Justificación individual de este colaborador */}
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                                                <FileText className="w-3 h-3 text-[#ee7624]" />
                                                Explicación del apoyo concreto
                                            </span>
                                            
                                        </div>

                                        <textarea
                                            value={s.justificacion}
                                            onChange={(e) => onCambiarJustificacion(i, e.target.value)}
                                            disabled={!s.colaborador}
                                            rows={3}
                                            placeholder="Describe por que estas dando tu voto a esta persona."
                                            className={`w-full px-3.5 py-3 rounded-xl bg-slate-950/70 text-sm text-white placeholder:text-slate-500 border focus:outline-none transition-all resize-none shadow-inner disabled:opacity-50 disabled:cursor-not-allowed ${
                                                mostrarAlertaJustificacion
                                                    ? 'border-[#ee7624] focus:ring-2 focus:ring-[#ee7624]/40 bg-[#ee7624]/5'
                                                    : 'border-white/15 focus:border-[#4a8b2c] focus:ring-2 focus:ring-[#4a8b2c]/30'
                                            }`}
                                        />

                                        {mostrarAlertaJustificacion && (
                                            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#ee7624]/15 border border-[#ee7624]/30 text-[11px] font-semibold text-[#ee7624] animate-shake">
                                                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                                <span>La explicación es obligatoria para evitar que esta nominación sea anulada por Capital Humano.</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>

            {/* PASO 2: BOTÓN DE CONFIRMACIÓN AL FINAL (SIEMPRE VISIBLE ABAJO) */}
            <div className="relative z-10 pt-4 mt-auto border-t border-white/10">
                <button
                    type="button"
                    disabled={!puedeConfirmar}
                    onClick={onConfirmar}
                    className={`w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl text-sm font-black tracking-wide uppercase transition-all duration-200 shadow-xl ${
                        puedeConfirmar
                            ? 'bg-gradient-to-r from-[#4a8b2c] via-emerald-600 to-[#ee7624] text-white hover:brightness-110 shadow-[#4a8b2c]/25 active:scale-[0.98] cursor-pointer'
                            : 'bg-slate-800/80 text-slate-500 border border-white/5 cursor-not-allowed'
                    }`}
                >
                    <Sparkles className={`w-5 h-5 ${puedeConfirmar ? 'animate-pulse text-yellow-300' : 'text-slate-500'}`} />
                    <span>Confirmar y Emitir Voto</span>
                </button>
            </div>

        </section>
    );
}
