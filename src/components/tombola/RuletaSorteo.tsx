import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Dices, Sparkles, User, Ticket } from 'lucide-react';

export interface SegmentoRuleta {
    participanteId: string;
    nombre: string;
    boletos: number;
}

interface RuletaSorteoProps {
    segmentos: SegmentoRuleta[];
    ganadorId: string | null;
    girando: boolean;
    onFinAnimacion: () => void;
}

const DURACION_SORTEO_SEGUNDOS = 10;

export function RuletaSorteo({
    segmentos,
    ganadorId,
    girando,
    onFinAnimacion,
}: RuletaSorteoProps) {
    const [nombreSorteoActual, setNombreSorteoActual] = useState('—');
    const [tiempoRestante, setTiempoRestante] = useState(DURACION_SORTEO_SEGUNDOS);
    const intervalRef = useRef<number | null>(null);

    // Bucle de animación de 10 segundos cambiando nombres acelerados y desacelerados
    useEffect(() => {
        if (!girando || segmentos.length === 0) {
            setTiempoRestante(DURACION_SORTEO_SEGUNDOS);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        const tiempoInicio = Date.now();
        const tiempoTotalMs = DURACION_SORTEO_SEGUNDOS * 1000;
        const ganadorObj = segmentos.find((s) => s.participanteId === ganadorId);

        let velocidadMs = 50; // Velocidad de cambio rápida al inicio

        const cambiarNombre = () => {
            const transcurrido = Date.now() - tiempoInicio;
            const progreso = Math.min(transcurrido / tiempoTotalMs, 1);

            // Actualizar cuenta regresiva visible
            setTiempoRestante(Math.max(0, Math.ceil(DURACION_SORTEO_SEGUNDOS - transcurrido / 1000)));

            if (progreso >= 1) {
                // Al llegar a los 10 segundos, fijar el ganador real
                setNombreSorteoActual(ganadorObj ? ganadorObj.nombre : 'Ganador Seleccionado');
                if (intervalRef.current) clearInterval(intervalRef.current);
                setTimeout(() => {
                    onFinAnimacion();
                }, 800); // Pausa dramática final
                return;
            }

            // Seleccionar participante aleatorio para la animación
            const indiceRam = Math.floor(Math.random() * segmentos.length);
            setNombreSorteoActual(segmentos[indiceRam].nombre);

            // Desacelerar gradualmente conforme se acerca a los 10 segundos
            velocidadMs = 50 + Math.pow(progreso, 3) * 450;
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = window.setTimeout(cambiarNombre, velocidadMs);
        };

        intervalRef.current = window.setTimeout(cambiarNombre, velocidadMs);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [girando, segmentos, ganadorId, onFinAnimacion]);

    return (
        /* Ancho y alto estrictamente fijos para evitar cualquier tipo de 'jump' */
        <div className="relative w-full max-w-md h-[340px] mx-auto my-4 select-none shrink-0">
            {/* TÓMBOLA DIGITAL DE TAMBOR CILÍNDRICO - Altura fija del contenedor */}
            <div className="relative w-full h-full rounded-3xl bg-slate-950 border border-white/15 p-6 shadow-2xl overflow-hidden text-slate-100 flex flex-col justify-between items-center">
                
                {/* Resplandores neón dinámicos */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#4A8B2C]/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#ee7624]/20 rounded-full blur-3xl pointer-events-none" />

                {/* Marca de agua / Fondo de Tómbola */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                    <Dices className="w-64 h-64 text-white" />
                </div>

                {/* Encabezado del Estado del Sorteo - Altura fija */}
                <div className="relative z-10 flex items-center justify-between w-full border-b border-white/10 pb-3 h-10 shrink-0">
                    <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#ee7624]">
                        <Sparkles className={`w-4 h-4 ${girando ? 'animate-spin text-yellow-300' : ''}`} />
                        <span>{girando ? 'Sorteo en Proceso' : 'Tómbola Lista'}</span>
                    </span>

                    {girando && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#ee7624]/20 border border-[#ee7624]/40 text-[#ee7624] text-[10px] font-extrabold tabular-nums animate-pulse">
                            00:0{tiempoRestante}s
                        </span>
                    )}
                </div>

                {/* TAMBOR CENTRAL DE EXHIBICIÓN EN VIVO - Altura estrictamente rígida (h-[160px]) */}
                <div className="relative z-10 w-full h-[160px] py-4 px-6 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-white/10 shadow-inner flex flex-col items-center justify-center overflow-hidden shrink-0">
                    
                    {/* Indicadores LED Neón Laterales */}
                    <div className="absolute left-2 inset-y-4 w-1 bg-gradient-to-b from-[#4A8B2C] via-[#ee7624] to-[#4A8B2C] rounded-full animate-pulse" />
                    <div className="absolute right-2 inset-y-4 w-1 bg-gradient-to-b from-[#ee7624] via-[#4A8B2C] to-[#ee7624] rounded-full animate-pulse" />

                    {/* Animación del Nombre Giratorio */}
                    <motion.div
                        key={nombreSorteoActual}
                        initial={{ opacity: 0.4, y: girando ? -8 : 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.05, ease: 'easeOut' }}
                        className="flex flex-col items-center justify-center space-y-2 text-center w-full px-2"
                    >
                        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#ee7624] shrink-0">
                            <User className="w-5 h-5" />
                        </div>
                        
                        {/* El contenedor del texto tiene 'h-14', 'truncate' y 'line-clamp-1' para garantizar que nunca cambie de tamaño */}
                        <div className="h-14 w-full flex items-center justify-center">
                            <p className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md truncate w-full px-2">
                                {girando ? nombreSorteoActual : 'Presiona Girar para Iniciar'}
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* FOOTER INFORMATIVO DE LA TÓMBOLA - Altura fija */}
                <div className="relative z-10 flex items-center justify-between w-full text-[10px] text-slate-400 font-bold uppercase tracking-wider h-6 shrink-0 border-t border-white/5 pt-2">
                    <span className="flex items-center gap-1">
                        <Ticket className="w-3.5 h-3.5 text-[#4A8B2C]" />
                        {segmentos.length} Participantes Ponderados
                    </span>
                    <span className="text-slate-500 font-mono">10 Seg. Sorteo Oficial</span>
                </div>
            </div>
        </div>
    );
}