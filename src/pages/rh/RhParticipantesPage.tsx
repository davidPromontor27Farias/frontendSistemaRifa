import { useMemo, useState } from "react";
import { Search, UserPlus, Briefcase, Users2 } from "lucide-react";
import { useParticipantes } from "../../store/participantesStore";
import { TablaParticipantes } from "../../components/admin/TablaParticipantes";
import { FormularioParticipante, type DatosParticipanteForm } from "../../components/admin/FormularioParticipante";
import { CargaParticipantesExcel } from "../../components/admin/CargaParticipantesExcel";
import { ReemplazarParticipantesExcel } from "../../components/admin/ReemplazarParticipantesExcel";
import type { Participante, TipoParticipante } from "../../types/participante";

export function RhParticipantesPage() {
    const { lista, agregarParticipante, editarParticipante, desactivarParticipante, reactivarParticipante } = useParticipantes();
    const [pestana, setPestana] = useState<TipoParticipante>("comercial");
    const [busqueda, setBusqueda] = useState("");
    const [formularioAbierto, setFormularioAbierto] = useState(false);
    const [participanteEnEdicion, setParticipanteEnEdicion] = useState<Participante | undefined>(undefined);

    const comerciales = useMemo(() => lista.filter((p) => p.tipo === "comercial"), [lista]);
    const noComerciales = useMemo(() => lista.filter((p) => p.tipo === "no_comercial"), [lista]);
    const listaPestanaActiva = pestana === "comercial" ? comerciales : noComerciales;

    const filtrada = useMemo(() => {
        const termino = busqueda.trim().toLowerCase();
        if (!termino) return listaPestanaActiva;
        return listaPestanaActiva.filter(
            (p) => p.nombre.toLowerCase().includes(termino) || p.numeroEmpleado.toLowerCase().includes(termino)
        );
    }, [listaPestanaActiva, busqueda]);

    function abrirAlta() {
        setParticipanteEnEdicion(undefined);
        setFormularioAbierto(true);
    }

    function abrirEdicion(participante: Participante) {
        setParticipanteEnEdicion(participante);
        setFormularioAbierto(true);
    }

    function guardar(datos: DatosParticipanteForm) {
        if (participanteEnEdicion) {
            editarParticipante({ ...participanteEnEdicion, ...datos });
        } else {
            agregarParticipante(datos);
        }
        setFormularioAbierto(false);
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-lg font-bold text-white">Participantes</h1>
                    <p className="text-sm text-slate-400">Alta, edición y baja del personal que participa en la rifa.</p>
                </div>
                <div className="flex items-center gap-2.5">
                    <ReemplazarParticipantesExcel />
                    <CargaParticipantesExcel />
                    <button
                        type="button"
                        onClick={abrirAlta}
                        className="flex items-center gap-1.5 bg-linear-to-r from-[#4a8b2c] to-[#ee7624] text-white text-sm font-semibold px-4 py-2.5 rounded-xl active:scale-95 transition cursor-pointer"
                    >
                        <UserPlus className="w-4 h-4" />
                        Nuevo participante
                    </button>
                </div>
            </div>

            {/* PESTAÑAS COMERCIAL / NO COMERCIAL */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-0">
                <button
                    type="button"
                    onClick={() => setPestana("comercial")}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition cursor-pointer ${
                        pestana === "comercial"
                            ? "bg-white/10 border-[#4A8B2C] text-white"
                            : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`}
                >
                    <Briefcase className="w-4 h-4 text-[#4A8B2C]" />
                    Comercial
                    <span className="text-[10px] font-black bg-white/10 px-1.5 py-0.5 rounded-full">{comerciales.length}</span>
                </button>
                <button
                    type="button"
                    onClick={() => setPestana("no_comercial")}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition cursor-pointer ${
                        pestana === "no_comercial"
                            ? "bg-white/10 border-[#ee7624] text-white"
                            : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`}
                >
                    <Users2 className="w-4 h-4 text-[#ee7624]" />
                    No Comercial
                    <span className="text-[10px] font-black bg-white/10 px-1.5 py-0.5 rounded-full">{noComerciales.length}</span>
                </button>
            </div>

            {/* BUSCADOR */}
            <div className="relative max-w-md">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar por nombre o número de empleado..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white text-xs font-semibold placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4A8B2C] focus:border-transparent transition shadow-inner"
                />
            </div>

            <TablaParticipantes
                participantes={filtrada}
                onEditar={abrirEdicion}
                onDesactivar={desactivarParticipante}
                onReactivar={reactivarParticipante}
            />

            {formularioAbierto && (
                <FormularioParticipante
                    participante={participanteEnEdicion}
                    onGuardar={guardar}
                    onCerrar={() => setFormularioAbierto(false)}
                />
            )}
        </div>
    );
}