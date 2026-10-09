import { useState, type FormEvent } from "react";
import { X, UserPlus, UserCheck, Hash, Building2, Briefcase, Layers, Save, Tag } from "lucide-react";
import type { Participante, TipoParticipante } from "../../types/participante";

export interface DatosParticipanteForm {
    numeroEmpleado: string;
    nombre: string;
    departamento: string;
    puesto: string;
    area: string;
    tipo: TipoParticipante;
}

interface FormularioParticipanteProps {
    participante?: Participante;
    onGuardar: (datos: DatosParticipanteForm) => void;
    onCerrar: () => void;
}

export function FormularioParticipante({ participante, onGuardar, onCerrar }: FormularioParticipanteProps) {
    const [datos, setDatos] = useState<DatosParticipanteForm>({
        numeroEmpleado: participante?.numeroEmpleado ?? "",
        nombre: participante?.nombre ?? "",
        departamento: participante?.departamento ?? "",
        puesto: participante?.puesto ?? "",
        area: participante?.area ?? "",
        tipo: participante?.tipo ?? "no_comercial",
    });

    const valido = Boolean(
        datos.numeroEmpleado.trim() &&
        datos.nombre.trim() &&
        datos.area.trim()
    );

    function manejarEnvio(evento: FormEvent) {
        evento.preventDefault();
        if (!valido) return;
        onGuardar(datos);
    }

    function campo<K extends keyof DatosParticipanteForm>(clave: K, valor: DatosParticipanteForm[K]) {
        setDatos((actual) => ({ ...actual, [clave]: valor }));
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            <form
                onSubmit={manejarEnvio}
                className="relative w-full max-w-lg bg-slate-900 border border-white/15 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5 text-slate-100"
            >
                {/* Resplandores Ambientales de Fondo */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#4A8B2C]/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ee7624]/15 rounded-full blur-3xl pointer-events-none" />

                {/* ENCABEZADO DEL MODAL */}
                <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#4A8B2C]/20 to-[#ee7624]/20 border border-white/15 text-[#ee7624] shadow-inner">
                            {participante ? <UserCheck className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                        </div>
                        <div>
                            <h2 className="text-base font-black text-white tracking-tight">
                                {participante ? "Editar Participante" : "Nuevo Participante"}
                            </h2>
                            <p className="text-xs text-slate-400">
                                {participante ? "Actualiza la información del colaborador" : "Registra un nuevo miembro del equipo"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onCerrar}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* CUERPO DEL FORMULARIO */}
                <div className="relative z-10 space-y-4">

                    {/* NÚMERO DE EMPLEADO & ÁREA */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                <Hash className="w-3 h-3 text-[#ee7624]" />
                                No. Empleado
                            </label>
                            <input
                                type="text"
                                value={datos.numeroEmpleado}
                                onChange={(e) => campo("numeroEmpleado", e.target.value)}
                                placeholder="Ej: E-1045"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#4A8B2C] focus:ring-1 focus:ring-[#4A8B2C] transition shadow-inner"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                <Layers className="w-3 h-3 text-[#ee7624]" />
                                Área
                            </label>
                            <input
                                type="text"
                                value={datos.area}
                                onChange={(e) => campo("area", e.target.value)}
                                placeholder="Ej: OPERACIONES (50000010)"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#4A8B2C] focus:ring-1 focus:ring-[#4A8B2C] transition shadow-inner"
                            />
                        </div>
                    </div>

                    {/* NOMBRE COMPLETO */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                            <UserPlus className="w-3 h-3 text-[#ee7624]" />
                            Nombre Completo
                        </label>
                        <input
                            type="text"
                            value={datos.nombre}
                            onChange={(e) => campo("nombre", e.target.value)}
                            placeholder="Nombre(s) y Apellidos"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#4A8B2C] focus:ring-1 focus:ring-[#4A8B2C] transition shadow-inner"
                        />
                    </div>

                    {/* DEPARTAMENTO & PUESTO */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                <Building2 className="w-3 h-3 text-[#ee7624]" />
                                Departamento
                            </label>
                            <input
                                type="text"
                                value={datos.departamento}
                                onChange={(e) => campo("departamento", e.target.value)}
                                placeholder="Ej: Ventas Gobierno"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#4A8B2C] focus:ring-1 focus:ring-[#4A8B2C] transition shadow-inner"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                <Briefcase className="w-3 h-3 text-[#ee7624]" />
                                Puesto
                            </label>
                            <input
                                type="text"
                                value={datos.puesto}
                                onChange={(e) => campo("puesto", e.target.value)}
                                placeholder="Ej: Ejecutivo Comercial"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#4A8B2C] focus:ring-1 focus:ring-[#4A8B2C] transition shadow-inner"
                            />
                        </div>
                    </div>

                    {/* TIPO (COMERCIAL / NO COMERCIAL) */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                            <Tag className="w-3 h-3 text-[#ee7624]" />
                            Tipo
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => campo("tipo", "comercial")}
                                className={`py-2.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                                    datos.tipo === "comercial"
                                        ? "bg-[#4A8B2C]/25 border-[#4A8B2C]/60 text-emerald-200"
                                        : "bg-slate-950 border-white/10 text-slate-400 hover:text-white"
                                }`}
                            >
                                Comercial
                            </button>
                            <button
                                type="button"
                                onClick={() => campo("tipo", "no_comercial")}
                                className={`py-2.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                                    datos.tipo === "no_comercial"
                                        ? "bg-[#ee7624]/25 border-[#ee7624]/60 text-orange-200"
                                        : "bg-slate-950 border-white/10 text-slate-400 hover:text-white"
                                }`}
                            >
                                No Comercial
                            </button>
                        </div>
                    </div>

                </div>

                {/* BOTÓN DE ACCIÓN */}
                <div className="relative z-10 pt-3 border-t border-white/10">
                    <button
                        type="submit"
                        disabled={!valido}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-xs font-black tracking-wider uppercase bg-gradient-to-r from-[#4A8B2C] via-emerald-600 to-[#ee7624] text-white transition active:scale-[0.98] cursor-pointer shadow-lg shadow-[#4A8B2C]/20 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:brightness-100"
                    >
                        <Save className="w-4 h-4" />
                        <span>{participante ? "Guardar Cambios" : "Registrar Participante"}</span>
                    </button>
                </div>

            </form>
        </div>
    );
}