import { User, Ticket, Building2, ShieldAlert } from 'lucide-react';
import type { Participante } from '../../types/participante';
import type { AcumuladoParticipante } from '../../types/votacionMensual';

interface FilaAcumulado {
    participante: Participante;
    acumulado: AcumuladoParticipante | undefined;
}

interface TablaAcumuladosProps {
    filas: FilaAcumulado[];
}

function obtenerIniciales(nombre?: string | null): string {
    if (!nombre) return '?';
    const partes = nombre.trim().split(/\s+/);
    return ((partes[0]?.[0] ?? '') + (partes[1]?.[0] ?? '')).toUpperCase();
}

export function TablaAcumulados({ filas }: TablaAcumuladosProps) {
    const ordenadas = [...filas].sort(
        (a, b) => (b.acumulado?.totalBoletos ?? 0) - (a.acumulado?.totalBoletos ?? 0)
    );

    return (
        <div className="relative w-full bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden text-slate-100">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                    
                    {/* ENCABEZADO DE LA TABLA */}
                    <thead>
                        <tr className="bg-slate-950/60 border-b border-white/10 text-[10px] font-black uppercase tracking-wider text-slate-400">
                            <th className="px-5 py-4">
                                <div className="flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5 text-[#ee7624]" />
                                    <span>Participante</span>
                                </div>
                            </th>
                            <th className="px-5 py-4">
                                <div className="flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5 text-[#ee7624]" />
                                    <span>Departamento</span>
                                </div>
                            </th>
                            <th className="px-5 py-4">Estatus</th>
                            <th className="px-5 py-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                    <Ticket className="w-3.5 h-3.5 text-[#ee7624]" />
                                    <span>Boletos Acumulados</span>
                                </div>
                            </th>
                        </tr>
                    </thead>

                    {/* CUERPO DE LA TABLA */}
                    <tbody className="divide-y divide-white/5">
                        {ordenadas.map(({ participante, acumulado }) => {
                            const esActivo = participante.estatus === 'activo';
                            const totalBoletos = acumulado?.totalBoletos ?? 0;

                            return (
                                <tr
                                    key={participante.id}
                                    className="hover:bg-white/5 transition-colors duration-150 group"
                                >
                                    {/* Participante con Avatar */}
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

                                    {/* Departamento */}
                                    <td className="px-5 py-4 text-slate-300 font-medium">
                                        {participante.departamento}
                                    </td>

                                    {/* Estatus */}
                                    <td className="px-5 py-4">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                                esActivo
                                                    ? 'bg-[#4A8B2C]/20 border-[#4A8B2C]/40 text-emerald-300'
                                                    : 'bg-slate-800/80 border-slate-700 text-slate-400'
                                            }`}
                                        >
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full ${
                                                    esActivo ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                                                }`}
                                            />
                                            {esActivo ? 'Activo' : 'Inactivo (No Participa)'}
                                        </span>
                                    </td>

                                    {/* Boletos Acumulados */}
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
                            );
                        })}

                        {/* ESTADO VACÍO */}
                        {ordenadas.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-5 py-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <ShieldAlert className="w-8 h-8 text-slate-600 stroke-[1.5]" />
                                        <p className="text-xs font-bold text-slate-400">Sin datos de acumulados registrados</p>
                                        <p className="text-[11px] text-slate-500">
                                            Los folios se irán sumando automáticamente a medida que los colaboradores emitan sus votos mensuales.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}