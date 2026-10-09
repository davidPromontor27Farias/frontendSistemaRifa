import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useParticipantes } from '../../store/participantesStore';
import { TablaParticipantes } from '../../components/admin/TablaParticipantes';
import { FormularioParticipante, type DatosParticipanteForm } from '../../components/admin/FormularioParticipante';
import type { Participante } from '../../types/participante';

export function AdminParticipantesPage() {
    const { lista, agregarParticipante, editarParticipante, desactivarParticipante, reactivarParticipante } = useParticipantes();
    const [formularioAbierto, setFormularioAbierto] = useState(false);
    const [participanteEnEdicion, setParticipanteEnEdicion] = useState<Participante | undefined>(undefined);

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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-bold text-gray-900">Participantes</h1>
                    <p className="text-sm text-gray-500">Listado de personas nominables para la rifa (Fase 1 de configuración).</p>
                </div>
                <button
                    type="button"
                    onClick={abrirAlta}
                    className="flex items-center gap-1.5 bg-linear-to-r from-[#4a8b2c] to-[#ee7624] text-white text-sm font-semibold px-4 py-2.5 rounded-xl active:scale-95 transition"
                >
                    <UserPlus className="w-4 h-4" />
                    Nuevo participante
                </button>
            </div>

            <TablaParticipantes
                participantes={lista}
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
