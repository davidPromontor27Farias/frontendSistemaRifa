import { Building2, Loader2, ShieldAlert, Ticket, User } from "lucide-react";
import type { Participante } from "../../types/participante";



export interface FilaVotoEquipo{
    participante: Participante;
    cebe: string;
    totalBoletos: number;
}


interface SeccionVotosEquipoProps {
    filas: FilaVotoEquipo[];
    cargando: boolean;
}

function obtenerIniciales(nombre?: string | null): string{
    if(!nombre) return '?';
    const partes = nombre.trim().split(/\s+/);
    return ((partes[0]?.[0] ?? '') + (partes[1]?.[0] ?? '')).toUpperCase();
}

export function SeccionVotosEquipo({ filas, cargando }: SeccionVotosEquipoProps) {
    const ordenadas = [...filas].sort((a, b) => b.totalBoletos - a.totalBoletos);

    return (
        <div className="relative w-full bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden text-slate-100">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                    <thead>
                        <tr className="bg-slate-950/60 border-b border-white/10 text-[10px] font-black uppercase tracking-wider text-slate-400">
                            <th className="px-5 py-4">
                                <div className="flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5 text-[#ee7624]" />
                                    <span>Integrante</span>
                                </div>
                            </th>
                            <th className="px-5 py-4">
                                <div className="flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5 text-[#ee7624]" />
                                    <span>CEBE</span>
                                </div>
                            </th>
                            <th className="px-5 py-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                    <Ticket className="w-3.5 h-3.5 text-[#ee7624]" />
                                    <span>Total de votos</span>
                                </div>
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-white/5">
                        {cargando ? (
                            <tr>
                                <td colSpan={3} className="px-5 py-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Loader2 className="w-6 h-6 text-slate-500 animate-spin" />
                                        <p className="text-xs font-bold text-slate-400">Cargando equipo...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : ordenadas.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-5 py-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <ShieldAlert className="w-8 h-8 text-slate-600 stroke-[1.5]" />
                                        <p className="text-xs font-bold text-slate-400">Aún no tienes integrantes con votos registrados</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            ordenadas.map(({ participante, cebe, totalBoletos }) => (
                                <tr key={participante.id} className="hover:bg-white/5 transition-colors duration-150 group">
                                    <td className="px-5 py-4 font-bold text-white">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4A8B2C]/20 to-[#ee7624]/20 border border-white/15 text-white flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm">
                                                {obtenerIniciales(participante.nombre)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                                                    {participante.nombre}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-mono truncate">
                                                    {participante.numeroEmpleado}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-slate-300 font-medium">
                                        {cebe || <span className="text-slate-500">—</span>}
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-black text-xs tabular-nums border shadow-sm ${
                                                totalBoletos > 0
                                                    ? 'bg-[#ee7624]/20 border-[#ee7624]/40 text-[#ee7624]'
                                                    : 'bg-white/5 border-white/10 text-slate-500'
                                            }`}
                                        >
                                            <Ticket className="w-3.5 h-3.5" />
                                            {totalBoletos} {totalBoletos === 1 ? 'Boleto' : 'Boletos'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}