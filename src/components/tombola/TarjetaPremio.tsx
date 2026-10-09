import { Award, Gift, Trophy, Play } from 'lucide-react';
import type { Premio } from '../../types/tombola';

interface TarjetaPremioProps {
    premio: Premio;
    nombreGanador?: string;
    onSortear: () => void;
}

export function TarjetaPremio({ premio, nombreGanador, onSortear }: TarjetaPremioProps) {
    const esPremioMayor = premio.categoria === 'mayor';
    const Icono = esPremioMayor ? Trophy : Gift;

    return (
        <div className="relative w-full bg-slate-900/85 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xl text-slate-100 hover:border-white/20 transition-all duration-200">
            {/* DATOS DEL PREMIO */}
            <div className="flex items-center gap-3.5 min-w-0">
                <div
                    className={`p-3 rounded-2xl border flex items-center justify-center shrink-0 shadow-inner ${
                        esPremioMayor
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                            : 'bg-[#4A8B2C]/20 border-[#4A8B2C]/40 text-emerald-400'
                    }`}
                >
                    <Icono className="w-5 h-5" />
                </div>

                <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-black text-white truncate">{premio.nombre}</p>
                        <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                esPremioMayor
                                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                    : 'bg-white/5 border-white/10 text-slate-400'
                            }`}
                        >
                            {esPremioMayor ? 'Premio Mayor' : 'Premio Estándar'}
                        </span>
                    </div>

                    {premio.sorteado && nombreGanador ? (
                        <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Ganador: {nombreGanador}</span>
                        </p>
                    ) : (
                        <p className="text-xs text-slate-400 font-medium">Disponible para sorteo en vivo</p>
                    )}
                </div>
            </div>

            {/* ACCIÓN DE ACCIONAR TÓMBOLA */}
            {!premio.sorteado && (
                <button
                    type="button"
                    onClick={onSortear}
                    className="shrink-0 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-[#4A8B2C] via-emerald-600 to-[#ee7624] hover:brightness-110 active:scale-95 px-5 py-2.5 rounded-xl transition cursor-pointer shadow-lg shadow-[#4A8B2C]/20"
                >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Girar Tómbola</span>
                </button>
            )}
        </div>
    );
}