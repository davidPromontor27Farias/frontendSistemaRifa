import { AnimatePresence, motion } from 'framer-motion';
import { Trophy, CheckCircle2, Ticket, Award, Sparkles } from 'lucide-react';
import { piezasConfeti } from '../../utils/confeti';
import type { Premio } from '../../types/tombola';

interface ModalGanadorPremioProps {
    abierto: boolean;
    premio: Premio | null;
    nombreGanador: string;
    folioGanador: string;
    onCerrar: () => void;
}

export function ModalGanadorPremio({
    abierto,
    premio,
    nombreGanador,
    folioGanador,
    onCerrar,
}: ModalGanadorPremioProps) {
    if (!premio) return null;

    const esPremioMayor = premio.categoria === 'mayor';

    return (
        <AnimatePresence>
            {abierto && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
                >
                    {/* CONFETI CELEBRATORIO */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                        {piezasConfeti().map((p) => (
                            <motion.span
                                key={p.id}
                                initial={{ top: '-5%', left: `${p.x}%`, opacity: 1, rotate: 0 }}
                                animate={{ top: '105%', rotate: p.rotate }}
                                transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
                                className="absolute rounded-sm"
                                style={{
                                    width: p.size,
                                    height: p.size * 1.6,
                                    backgroundColor: p.color,
                                }}
                            />
                        ))}
                    </div>

                    {/* TARJETA PRINCIPAL DEL GANADOR */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                        className="relative z-10 w-full max-w-md bg-slate-900 border border-white/20 rounded-3xl shadow-2xl overflow-hidden text-slate-100"
                    >
                        {/* Resplandor Trasero Neón */}
                        <div
                            className={`absolute -inset-1 rounded-3xl opacity-30 blur-2xl pointer-events-none ${
                                esPremioMayor
                                    ? 'bg-gradient-to-r from-amber-500 via-[#ee7624] to-yellow-300'
                                    : 'bg-gradient-to-r from-[#4A8B2C] via-emerald-500 to-[#ee7624]'
                            }`}
                        />

                        {/* CABECERA DE LA VICTORIA */}
                        <div
                            className={`relative p-8 text-center overflow-hidden border-b border-white/10 ${
                                esPremioMayor
                                    ? 'bg-gradient-to-br from-amber-600 via-[#ee7624] to-amber-700'
                                    : 'bg-gradient-to-br from-[#4A8B2C] via-emerald-600 to-[#ee7624]'
                            }`}
                        >
                            <div className="absolute -right-6 -bottom-6 w-36 h-36 opacity-10 pointer-events-none">
                                <img src="/icon.png" alt="Imperquimia" className="w-full h-full object-contain" />
                            </div>

                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', delay: 0.2, stiffness: 300 }}
                                className="relative w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-inner"
                            >
                                <Trophy className="w-9 h-9 text-yellow-300 drop-shadow-[0_0_12px_rgba(253,224,71,0.8)]" />
                                <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-yellow-200 animate-pulse" />
                            </motion.div>

                            <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-black/20 text-white/90 text-[10px] font-black uppercase tracking-widest backdrop-blur-xs mb-1">
                                <Award className="w-3 h-3" />
                                {esPremioMayor ? 'Premio Mayor Convención' : 'Premio Estándar'}
                            </span>

                            <h3 className="text-2xl font-black text-white tracking-tight drop-shadow-md">
                                ¡Tenemos Ganador!
                            </h3>
                            <p className="text-xs text-white/90 font-medium mt-0.5 max-w-xs mx-auto truncate">
                                {premio.nombre}
                            </p>
                        </div>

                        {/* DATOS DEL COLABORADOR Y FOLIO */}
                        <div className="p-6 space-y-4 text-center bg-slate-950/60 relative z-10">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    Colaborador Afortunado
                                </p>
                                <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                    {nombreGanador}
                                </p>
                            </div>

                            {/* Ticket del Folio Ganador */}
                            <div className="pt-1">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#ee7624]/20 to-[#ee7624]/10 border border-[#ee7624]/40 text-[#ee7624] shadow-lg shadow-[#ee7624]/10">
                                    <Ticket className="w-4 h-4 animate-bounce" />
                                    <span className="text-xs font-mono font-black tracking-wider uppercase">
                                        Folio: {folioGanador || 'FOLIO-OFICIAL'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* BOTÓN DE CONTINUAR */}
                        <div className="p-4 border-t border-white/10 bg-slate-900">
                            <button
                                type="button"
                                onClick={onCerrar}
                                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-xs font-black tracking-wider uppercase bg-gradient-to-r from-[#4A8B2C] via-emerald-600 to-[#ee7624] text-white hover:brightness-110 active:scale-[0.98] transition cursor-pointer shadow-xl shadow-[#4A8B2C]/20"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Confirmar y Guardar Registro</span>
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}