import { useParticipantes } from '../../store/participantesStore';
import { useVotacionMensual } from '../../store/votacionStore';
import { TablaAcumulados } from '../../components/admin/TablaAcumulados';

export function AdminAcumuladosPage() {
    const { lista } = useParticipantes();
    const { calcularAcumulados } = useVotacionMensual();

    const acumulados = calcularAcumulados();


    const filas = acumulados
        .map((acumulado) => {
            const participante = lista.find((p) => p.id === acumulado.participanteId);
            return participante ? { participante, acumulado } : null;
        })
        .filter((fila): fila is { participante: typeof lista[number]; acumulado: typeof acumulados[number] } => fila !== null);
    
    return (
        <div className="space-y-6 mt-20">
            
            {/* TABLA DE ACUMULADOS */}
            <div className="w-full">
                <TablaAcumulados filas={filas} />
            </div>

        </div>
    );
}