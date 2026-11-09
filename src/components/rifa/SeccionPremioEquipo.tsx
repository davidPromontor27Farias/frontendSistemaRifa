import { Briefcase, Loader2, ShieldAlert, User, UsersIcon } from "lucide-react";
import type { PremioIntegranteMes } from "../../hooks/useEquipoGerente";


interface SeccionPremioEquipoProps {
    filas: PremioIntegranteMes[];
    cargando: boolean;
}


function formatearMoneda(valor: number): string{
    return new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN', maximumFractionDigits: 0}).format(valor);
}

function obtenerIniciales(nombre?: string | null): string{
    if(!nombre) return '?';
    const partes = nombre.trim().split(/\s+/);
    return ((partes[0]?.[0] ?? '') + (partes[1]?.[0] ?? '')).toUpperCase();

}

export function SeccionPremioEquipo({filas, cargando}: SeccionPremioEquipoProps){
    const ordenadas = [...filas].sort((a, b) => b.premioTotal - a.premioTotal);
    const totalEjecutivo = filas.reduce((acc, f) => acc + f.premioEjecutivo, 0);
    const totalSupervisor = filas.reduce((acc, f) => acc + f.premioSupervisor, 0);


    return (
        <div className="space-y-4">
            {filas.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-900/85 backdrop-blur-xl rounded-2xl border border-white/10 p-4 text-center space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ejecutivo · 80%</p>
                        <p className="text-base font-black text-amber-300">{formatearMoneda(totalEjecutivo)}</p>
                    </div>
                    <div className="bg-slate-900/85 backdrop-blur-xl rounded-2xl border border-white/10 p-4 text-center space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Supervisor · 20%</p>
                        <p className="text-base font-black text-amber-300">{formatearMoneda(totalSupervisor)}</p>
                    </div>
                    <div className="bg-[#4A8B2C]/10 border border-[#4A8B2C]/30 rounded-2xl p-4 text-center space-y-1">
                        <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Total</p>
                        <p className="text-base font-black text-emerald-300">{formatearMoneda(totalEjecutivo + totalSupervisor)}</p>
                    </div>
                </div>
            )}

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
                                <th className="px-5 py-4">Mes</th>
                                <th className="px-5 py-4 text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                        <Briefcase className="w-3.5 h-3.5 text-[#ee7624]" />
                                        <span>Ejecutivo · 80%</span>
                                    </div>
                                </th>
                                <th className="px-5 py-4 text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                        <UsersIcon className="w-3.5 h-3.5 text-[#ee7624]" />
                                        <span>Supervisor · 20%</span>
                                    </div>
                                </th>
                                <th className="px-5 py-4 text-right">Total</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-white/5">
                            {cargando ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Loader2 className="w-6 h-6 text-slate-500 animate-spin" />
                                            <p className="text-xs font-bold text-slate-400">Calculando premio en efectivo del equipo...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : ordenadas.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <ShieldAlert className="w-8 h-8 text-slate-600 stroke-[1.5]" />
                                            <p className="text-xs font-bold text-slate-400">
                                                Ningún integrante de tu equipo ha generado premio en efectivo todavía
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                ordenadas.map((f) => (
                                    <tr key={`${f.participanteId}-${f.mesClave}`} className="hover:bg-white/5 transition-colors duration-150 group">
                                        <td className="px-5 py-4 font-bold text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4A8B2C]/20 to-[#ee7624]/20 border border-white/15 text-white flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm">
                                                    {obtenerIniciales(f.nombre)}
                                                </div>
                                                <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                                                    {f.nombre}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-slate-300">{f.mesEtiqueta}</td>
                                        <td className="px-5 py-4 text-center font-black text-amber-300">{formatearMoneda(f.premioEjecutivo)}</td>
                                        <td className="px-5 py-4 text-center font-black text-slate-400">{formatearMoneda(f.premioSupervisor)}</td>
                                        <td className="px-5 py-4 text-right font-black text-white">{formatearMoneda(f.premioTotal)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}













