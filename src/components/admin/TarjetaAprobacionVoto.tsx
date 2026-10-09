import { CheckCircle2, XCircle, CalendarDays, Ticket, Clock3 } from 'lucide-react';
import type { Participante } from '../../types/participante';
import type { EstadoRevisionVoto, VotoHistorico } from '../../types/votacionMensual';

interface TarjetaAprobacionVotoProps {
    voto: VotoHistorico;
    votante: Participante | undefined;
    boletosActualesPorNominado: Map<string, number>;
    limite: number;
    onRevisarNominacion: (nominacionId: string, nuevoEstado: EstadoRevisionVoto) => void;
}

function formatearFecha(iso: string): string {
    return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
}

const BADGE_ESTADO: Record<EstadoRevisionVoto, { texto: string; clases: string }> = {
    pendiente: { texto: 'Pendiente', clases: 'bg-amber-500/10 border-amber-500/30 text-amber-400' },
    aprobado: { texto: 'Aprobado', clases: 'bg-[#4A8B2C]/20 border-[#4A8B2C]/40 text-emerald-300' },
    rechazado: { texto: 'Rechazado', clases: 'bg-rose-500/10 border-rose-500/30 text-rose-300' },
};

export function TarjetaAprobacionVoto({
    voto,
    votante,
    boletosActualesPorNominado,
    limite,
    onRevisarNominacion,
}: TarjetaAprobacionVotoProps) {
    const pendientes = voto.nominaciones.filter((n) => n.estado === 'pendiente').length;
    const aprobados = voto.nominaciones.filter((n) => n.estado === 'aprobado').length;
    const rechazados = voto.nominaciones.filter((n) => n.estado === 'rechazado').length;

    const resumen =
        pendientes > 0
            ? `${pendientes} boleto${pendientes === 1 ? '' : 's'} por revisar`
            : `${aprobados} aprobado${aprobados === 1 ? '' : 's'} · ${rechazados} rechazado${rechazados === 1 ? '' : 's'}`;

    return (
        <div className="relative w-full bg-slate-900/85 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-xl text-slate-100 space-y-4">

            <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-white/10">
                <div className="flex items-center gap-3 min-w-0">

                    <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">
                            {votante?.nombre ?? 'Votante desconocido'}
                        </p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1.5 flex-wrap">
                            {votante?.departamento ?? 'Sin departamento'}
                            <span className="text-slate-600">&bull;</span>
                            <CalendarDays className="w-3 h-3 shrink-0" />
                            {formatearFecha(voto.fechaEmision)}
                        </p>
                    </div>
                </div>

                <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
                        pendientes > 0
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                            : 'bg-white/5 border-white/10 text-slate-300'
                    }`}
                >
                    <Clock3 className="w-3 h-3" />
                    {resumen}
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {voto.nominaciones.map((nominacion) => {
                    const badge = BADGE_ESTADO[nominacion.estado];
                    const actuales = boletosActualesPorNominado.get(nominacion.participanteId) ?? 0;
                    const limiteAlcanzado = actuales >= limite;

                    return (
                        <div key={nominacion.id} className="bg-slate-950/50 rounded-2xl border border-white/10 p-4 space-y-2.5">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-xs font-bold text-white truncate">{nominacion.participante.nombre}</p>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#ee7624]/15 border border-[#ee7624]/30 text-[#ee7624] text-[10px] font-black shrink-0">
                                    <Ticket className="w-3 h-3" />
                                    +{nominacion.boletos}
                                </span>
                            </div>

                            <p className="text-[11px] text-slate-400">
                                {[nominacion.participante.departamento, nominacion.participante.area].filter(Boolean).join(' · ')}
                            </p>

                            <p className="text-[13px] font-bold text-slate-300 leading-relaxed ">
                                <span>Motivo: </span>&ldquo;{nominacion.justificacion}&rdquo;
                            </p>

                            <p className={`text-[10px] font-bold uppercase tracking-wide ${limiteAlcanzado ? 'text-rose-400' : 'text-slate-500'}`}>
                                {limiteAlcanzado
                                    ? `Límite alcanzado (${actuales}/${limite}) — no se sumará boleto`
                                    : `Boletos aprobados actuales: ${actuales}/${limite}`}
                            </p>

                            <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badge.clases}`}>
                                    {badge.texto}
                                </span>

                                {nominacion.estado === 'pendiente' ? (
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => onRevisarNominacion(nominacion.id, 'rechazado')}
                                            title="Rechazar este boleto"
                                            className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 hover:text-white active:scale-90 transition cursor-pointer"
                                        >
                                            <XCircle className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onRevisarNominacion(nominacion.id, 'aprobado')}
                                            title="Aprobar este boleto"
                                            className="p-1.5 rounded-lg bg-[#4A8B2C]/20 hover:bg-[#4A8B2C]/40 border border-[#4A8B2C]/40 text-emerald-300 hover:text-white active:scale-90 transition cursor-pointer"
                                        >
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => onRevisarNominacion(nominacion.id, 'pendiente')}
                                        className="text-[10px] font-bold uppercase text-slate-500 hover:text-slate-300 underline-offset-2 hover:underline cursor-pointer"
                                    >
                                        Deshacer
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
                {voto.folios.map((folio) => (
                    <span key={folio} className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400">
                        {folio}
                    </span>
                ))}
            </div>
        </div>
    );
}