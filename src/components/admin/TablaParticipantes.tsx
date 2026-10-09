import { Pencil, Power, PowerOff, User, Hash, Building2, Layers } from 'lucide-react';
import type { Participante } from '../../types/participante';

interface TablaParticipantesProps {
    participantes: Participante[];
    onEditar: (participante: Participante) => void;
    onDesactivar: (id: string) => void;
    onReactivar: (id: string) => void;
}

function obtenerIniciales(nombre?: string | null): string {
    if (!nombre) return '?';
    const partes = nombre.trim().split(/\s+/);
    return ((partes[0]?.[0] ?? '') + (partes[1]?.[0] ?? '')).toUpperCase();
}

export function TablaParticipantes({ participantes, onEditar, onDesactivar, onReactivar }: TablaParticipantesProps) {
    return (
        <div className="relative w-full bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden text-slate-100">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                    
                    {/* ENCABEZADO DE LA TABLA */}
                    <thead>
                        <tr className="bg-slate-950/60 border-b border-white/10 text-[10px] font-black uppercase tracking-wider text-slate-400">
                            <th className="px-5 py-4">
                                <div className="flex items-center gap-1.5">
                                    <Hash className="w-3.5 h-3.5 text-[#ee7624]" />
                                    <span>Empleado</span>
                                </div>
                            </th>
                            <th className="px-5 py-4">
                                <div className="flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5 text-[#ee7624]" />
                                    <span>Nombre</span>
                                </div>
                            </th>
                            <th className="px-5 py-4">
                                <div className="flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5 text-[#ee7624]" />
                                    <span>Departamento</span>
                                </div>
                            </th>
                            <th className="px-5 py-4">
                                <div className="flex items-center gap-1.5">
                                    <Layers className="w-3.5 h-3.5 text-[#ee7624]" />
                                    <span>Área</span>
                                </div>
                            </th>
                            <th className="px-5 py-4">Estatus</th>
                            <th className="px-5 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>

                    {/* CUERPO DE LA TABLA */}
                    <tbody className="divide-y divide-white/5">
                        {participantes.map((p) => {
                            const esActivo = p.estatus === 'activo';

                            return (
                                <tr
                                    key={p.id}
                                    className="hover:bg-white/5 transition-colors duration-150 group"
                                >
                                    {/* No. Empleado */}
                                    <td className="px-5 py-4 font-mono font-bold text-slate-400">
                                        <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px]">
                                            {p.numeroEmpleado}
                                        </span>
                                    </td>

                                    {/* Nombre con Avatar */}
                                    <td className="px-5 py-4 font-bold text-white">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4A8B2C]/20 to-[#ee7624]/20 border border-white/15 text-white flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm">
                                                {obtenerIniciales(p.nombre)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                                                    {p.nombre}
                                                </p>
                                                {p.puesto && (
                                                    <p className="text-[10px] text-slate-400 font-normal truncate">
                                                        {p.puesto}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Departamento */}
                                    <td className="px-5 py-4 text-slate-300 font-medium">
                                        {p.departamento}
                                    </td>

                                    {/* Área */}
                                    <td className="px-5 py-4 text-slate-400 text-[11px]">
                                        {p.area}
                                    </td>

                                    {/* Badge Estatus */}
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
                                            {esActivo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>

                                    {/* Acciones */}
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            {/* Editar */}
                                            <button
                                                type="button"
                                                onClick={() => onEditar(p)}
                                                title="Editar colaborador"
                                                className="p-2 rounded-xl bg-white/5 hover:bg-[#4A8B2C]/20 border border-white/10 hover:border-[#4A8B2C]/40 text-slate-300 hover:text-white transition active:scale-90 cursor-pointer"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>

                                            {/* Activar / Desactivar */}
                                            {esActivo ? (
                                                <button
                                                    type="button"
                                                    onClick={() => onDesactivar(p.id)}
                                                    title="Dar de baja (mantiene registro histórico)"
                                                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 hover:text-rose-100 transition active:scale-90 cursor-pointer"
                                                >
                                                    <PowerOff className="w-3.5 h-3.5" />
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => onReactivar(p.id)}
                                                    title="Reactivar colaborador"
                                                    className="p-2 rounded-xl bg-[#4A8B2C]/20 hover:bg-[#4A8B2C]/30 border border-[#4A8B2C]/40 text-emerald-300 hover:text-white transition active:scale-90 cursor-pointer"
                                                >
                                                    <Power className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                        {/* ESTADO VACÍO */}
                        {participantes.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <User className="w-8 h-8 text-slate-600 stroke-[1.5]" />
                                        <p className="text-xs font-bold text-slate-400">Sin participantes registrados</p>
                                        <p className="text-[11px] text-slate-500">
                                            Haz clic en el botón de nuevo participante para añadir al primer integrante.
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