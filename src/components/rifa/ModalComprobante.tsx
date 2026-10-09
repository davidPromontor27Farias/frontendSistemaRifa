import { AnimatePresence, motion } from 'framer-motion';
import { PartyPopper, CheckCircle2 } from 'lucide-react';
import type { ComprobanteVoto } from '../../types/rifa';
import { piezasConfeti } from '../../utils/confeti';

interface ModalComprobanteProps {
    abierto: boolean;
    comprobante: ComprobanteVoto | null;
    onCerrar: () => void;
}

export function ModalComprobante({ abierto, comprobante, onCerrar }: ModalComprobanteProps) {
    if (!comprobante) return null;

    return (
        <AnimatePresence>
            {abierto && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                >
                    {/* Confeti */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {piezasConfeti().map((p) => (
                            <motion.span
                                key={p.id}
                                initial={{ top: '-5%', left: `${p.x}%`, opacity: 1, rotate: 0 }}
                                animate={{ top: '105%', rotate: p.rotate }}
                                transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
                                className="absolute rounded-sm"
                                style={{ width: p.size, height: p.size * 1.6, backgroundColor: p.color }}
                            />
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                        className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
                    >
                        <div className="bg-linear-to-r from-[#4a8b2c] to-[#ee7624] px-6 py-6 text-white text-center">
                            <PartyPopper className="w-9 h-9 mx-auto mb-2" />
                            <h3 className="text-lg font-extrabold">¡Voto Emitido con Éxito!</h3>
                            <p className="text-sm text-white/85 mt-0.5">Comprobante digital · {comprobante.mes}</p>
                        </div>

                        <div className="p-6 space-y-4 max-h-[55vh] overflow-y-auto">
                            {comprobante.nominaciones.map((n, i) => (
                                <div key={i} className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5 space-y-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-bold text-gray-900">{n.colaborador.nombre}</p>
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#4a8b2c]/10 text-[#4a8b2c]">
                                            {n.boletos} boleto{n.boletos > 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">{[n.colaborador.departamento, n.colaborador.area].filter(Boolean).join(' · ')}</p>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 mb-1">Justificación</p>
                                        <p className="text-sm text-gray-700 bg-white rounded-lg border border-gray-100 p-2.5">{n.justificacion}</p>
                                    </div>
                                </div>
                            ))}


                        </div>

                        <div className="p-4  border-gray-100">
                            <button
                                type="button"
                                onClick={onCerrar}
                                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-gray-900 text-white hover:bg-gray-800 active:scale-95 transition-all"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Entendido
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
