import { CheckCircle2, Ticket, ShieldCheck, User } from 'lucide-react';
import type { ComprobanteVoto } from '../../types/rifa';

interface EstadoVotacionCompletadaProps {
    comprobante: ComprobanteVoto;
}

export function EstadoVotacionCompletada({ comprobante }: EstadoVotacionCompletadaProps) {
    return (
        <section className="relative w-full bg-slate-900/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl overflow-hidden text-slate-100 text-center space-y-6">
            
            {/* Resplandores ambientales de fondo */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#4A8B2C]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#ee7624]/15 rounded-full blur-3xl pointer-events-none" />

            {/* ENCABEZADO Y BADGE DE ÉXITO */}
            <div className="relative z-10 space-y-3">
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 bg-[#4A8B2C]/30 rounded-2xl blur-md animate-pulse" />
                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4A8B2C]/30 to-[#4A8B2C]/10 border border-[#4A8B2C]/40 flex items-center justify-center text-[#4A8B2C] shadow-inner">
                        <CheckCircle2 className="w-9 h-9" />
                    </div>
                </div>

                <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4A8B2C]/20 border border-[#4A8B2C]/30 text-[#4A8B2C] text-[10px] font-black uppercase tracking-widest">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Registro Confirmado
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight pt-1">
                        ¡Votación del Mes Completada!
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                        Tus nominaciones para <span className="font-bold text-slate-200">{comprobante.mes}</span> han sido registradas exitosamente en el sistema. Podrás volver a nominar el próximo periodo.
                    </p>
                </div>
            </div>

            {/* TARJETAS RESUMEN DE NOMINACIONES */}
            <div className="relative z-10 space-y-2.5 text-left max-w-lg mx-auto">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                    Nominaciones Emitidas
                </p>

                <div className="space-y-2">
                    {comprobante.nominaciones.map((n, i) => (
                        <div 
                            key={i} 
                            className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 hover:border-white/20 transition shadow-sm"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-[#4A8B2C] flex items-center justify-center shrink-0">
                                    <User className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs sm:text-sm font-bold text-white truncate">
                                        {n.colaborador.nombre}
                                    </p>
                                    <p className="text-[11px] text-slate-400 truncate">
                                        {[n.colaborador.departamento, n.colaborador.area].filter(Boolean).join(' · ')}
                                    </p>
                                </div>
                            </div>

                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#ee7624]/20 border border-[#ee7624]/40 text-[#ee7624] text-xs font-black uppercase shrink-0">
                                <Ticket className="w-3.5 h-3.5" />
                                {n.boletos} {n.boletos > 1 ? 'Boletos' : 'Boleto'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>





        </section>
    );
}