import { Lock, Unlock, Hourglass } from 'lucide-react';
import type { VentanaVotacion } from '../../types/votacionMensual';

interface TarjetaVentanaVotacionProps {
    ventana: VentanaVotacion;
}

function formatearFecha(iso: string): string {
    return new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short' }).format(new Date(iso));
}

const CONFIG_ESTADO = {
    abierta: {
        texto: 'Abierta ahora',
        clasesBadge: 'bg-[#4A8B2C]/20 border-[#4A8B2C]/40 text-emerald-300',
        clasesIcono: 'bg-[#4A8B2C]/20 border-[#4A8B2C]/40 text-emerald-400',
        icono: Unlock,
        punto: 'bg-emerald-400 animate-pulse',
    },
    proxima: {
        texto: 'Próxima',
        clasesBadge: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        clasesIcono: 'bg-white/5 border-white/10 text-slate-400',
        icono: Hourglass,
        punto: 'bg-amber-400',
    },
    cerrada: {
        texto: 'Cerrada',
        clasesBadge: 'bg-slate-800/80 border-slate-700 text-slate-400',
        clasesIcono: 'bg-white/5 border-white/10 text-slate-500',
        icono: Lock,
        punto: 'bg-slate-500',
    },
} as const;

export function TarjetaVentanaVotacion({ ventana }: TarjetaVentanaVotacionProps) {
    const config = CONFIG_ESTADO[ventana.estado];
    const Icono = config.icono;

    return (
        <div className="relative w-full bg-slate-900/85 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xl text-slate-100 hover:border-white/20 transition-all duration-200">
            <div className="flex items-center gap-3.5 min-w-0">
                <div className={`p-3 rounded-2xl border flex items-center justify-center shrink-0 shadow-inner ${config.clasesIcono}`}>
                    <Icono className="w-5 h-5" />
                </div>

                <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-black text-white truncate">{ventana.mesEtiqueta}</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${config.clasesBadge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${config.punto}`} />
                            {config.texto}
                        </span>
                    </div>

                    <p className="text-xs text-slate-400 font-medium">
                        Periodo: {formatearFecha(ventana.fechaInicio)} – {formatearFecha(ventana.fechaFin)}
                    </p>
                </div>
            </div>
        </div>
    );
}