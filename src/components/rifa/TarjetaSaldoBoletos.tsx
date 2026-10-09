import { motion } from 'framer-motion';
import { Ticket } from 'lucide-react';

interface TarjetaSaldoBoletosProps {
    boletosMensuales: number;
    boletosAsignados: number;
    votoEmitido: boolean;
}

export function TarjetaSaldoBoletos({ boletosMensuales, boletosAsignados, votoEmitido }: TarjetaSaldoBoletosProps) {
    const disponibles = votoEmitido ? 0 : boletosMensuales - boletosAsignados;

    return (
        <div className="relative w-full filter drop-shadow-2xl">
            
            {/* CONTENEDOR PRINCIPAL CON FORMA DE TICKET DE RIFA */}
            <div 
                className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 p-5 sm:p-6 text-white border border-white/15"
                style={{
                    /* Máscara CSS para generar las hendiduras laterales (ticket stubs) y esquinas redondeadas */
                    clipPath: 'polygon(0% 12px, 12px 0%, calc(100% - 12px) 0%, 100% 12px, 100% calc(50% - 10px), calc(100% - 8px) calc(50% - 10px), calc(100% - 8px) calc(50% + 10px), 100% calc(50% + 10px), 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0% calc(100% - 12px), 0% calc(50% + 10px), 8px calc(50% + 10px), 8px calc(50% - 10px), 0% calc(50% - 10px))',
                    borderRadius: '1.5rem'
                }}
            >
                {/* Resplandores ambientales de fondo dentro del ticket */}
                <div className="absolute top-0 -left-10 w-40 h-40 bg-[#4A8B2C]/25 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 -right-10 w-40 h-40 bg-[#ee7624]/25 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    
                    {/* IZQUIERDA: INFORMACIÓN Y CONTADOR PRINCIPAL */}
                    <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-[#4A8B2C] animate-pulse" />
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
                                Boletos Disponibles
                            </p>
                        </div>

                        <div className="flex items-baseline gap-3 justify-center">
                            <span className="text-5xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#ee7624] tabular-nums">
                                {disponibles}
                            </span>

                        </div>

                        <div className="pt-1 flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                votoEmitido 
                                    ? 'bg-[#4A8B2C]/20 border-[#4A8B2C]/40 text-emerald-300' 
                                    : 'bg-[#ee7624]/20 border-[#ee7624]/40 text-[#ee7624]'
                            }`}>
                                {votoEmitido ? '✓ Votación Registrada' : `${boletosAsignados} de ${boletosMensuales} Asignados`}
                            </span>
                        </div>
                    </div>

                    {/* LÍNEA DIVISORIA PERFORADA DEL TICKET (STUB SEPARATOR) */}
                    <div className="hidden sm:block h-16 w-[1px] border-r-2 border-dashed border-white/20 my-auto" />

                    {/* DERECHA: ICONOS ILUMINADOS DE BOLETOS FISICOS */}
                    <div className="flex items-center justify-start sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                        {Array.from({ length: boletosMensuales }, (_, i) => {
                            const consumido = votoEmitido || i < boletosAsignados;
                            return (
                                <motion.div
                                    key={i}
                                    initial={false}
                                    animate={{ 
                                        scale: consumido ? 0.92 : 1, 
                                        opacity: consumido ? 0.4 : 1 
                                    }}
                                    transition={{ duration: 0.25, ease: 'easeOut' }}
                                    className={`relative group w-14 h-16 sm:w-16 sm:h-20 rounded-2xl flex flex-col items-center justify-between p-2 transition-all duration-300 ${
                                        consumido
                                            ? 'bg-slate-950/60 border border-white/10 shadow-inner'
                                            : 'bg-gradient-to-b from-[#ee7624]/20 via-[#4A8B2C]/15 to-slate-900 border border-[#ee7624]/50 shadow-lg shadow-[#ee7624]/20 ring-1 ring-white/20'
                                    }`}
                                >
                                    {/* Folio / Indicador superior */}
                                    <span className="text-[9px] font-black tracking-widest text-white/50 uppercase">
                                        #{i + 1}
                                    </span>

                                    {/* Ícono central de Ticket con Glow */}
                                    <div className="relative flex items-center justify-center">
                                        {!consumido && (
                                            <div className="absolute inset-0 bg-[#ee7624] blur-md opacity-60 group-hover:opacity-100 transition" />
                                        )}
                                        <Ticket 
                                            className={`relative w-6 h-6 sm:w-7 sm:h-7 transition-all ${
                                                consumido 
                                                    ? 'text-slate-600' 
                                                    : 'text-[#ee7624] drop-shadow-[0_0_8px_rgba(238,118,36,0.8)]'
                                            }`} 
                                        />
                                    </div>

                                    {/* Indicador inferior de estado */}
                                    <span className={`text-[8px] font-bold uppercase tracking-wider ${
                                        consumido ? 'text-slate-600' : 'text-emerald-400'
                                    }`}>
                                        {consumido ? 'Usado' : 'Listo'}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </div>
    );
}
