import { useMemo, useState } from 'react';
import { ListChecks, ShieldAlert, Clock3, CheckCircle2 } from 'lucide-react';
import { useParticipantes } from '../../store/participantesStore';
import { useVotacionMensual, LIMITE_BOLETOS_POR_NOMINADO } from '../../store/votacionStore';
import { TarjetaAprobacionVoto } from '../../components/admin/TarjetaAprobacionVoto';

type PestanaAprobacion = 'pendientes' | 'revisados';

const PESTANAS: { clave: PestanaAprobacion; etiqueta: string; icono: typeof Clock3 }[] = [
    { clave: 'pendientes', etiqueta: 'Pendientes', icono: Clock3 },
    { clave: 'revisados', etiqueta: 'Revisados', icono: CheckCircle2 },
];

export function AdminAprobacionesPage() {
    const { lista } = useParticipantes();
    const { votos, revisarNominacion, calcularAcumulados } = useVotacionMensual();
    const [pestana, setPestana] = useState<PestanaAprobacion>('pendientes');

    const participantePorNumeroEmpleado = useMemo(
        () => new Map(lista.map((p) => [p.numeroEmpleado, p])),
        [lista]
    );

    const boletosActualesPorNominado = useMemo(() => {
        const mapa = new Map<string, number>();
        for (const acumulado of calcularAcumulados()) {
            mapa.set(acumulado.participanteId, acumulado.totalBoletos);
        }
        return mapa;
    }, [calcularAcumulados]);

    const tieneAlgunPendiente = (voto: (typeof votos)[number]) =>
        voto.nominaciones.some((n) => n.estado === 'pendiente');

    const votosFiltrados = useMemo(
        () =>
            votos
                .filter((v) => (pestana === 'pendientes' ? tieneAlgunPendiente(v) : !tieneAlgunPendiente(v)))
                .sort((a, b) => new Date(b.fechaEmision).getTime() - new Date(a.fechaEmision).getTime()),
        [votos, pestana]
    );

    const contadores = useMemo(
        () => ({
            pendientes: votos.filter(tieneAlgunPendiente).length,
            revisados: votos.filter((v) => !tieneAlgunPendiente(v)).length,
        }),
        [votos]
    );

    return (
        <div className="space-y-6 text-slate-100 pt-10">

            {/* ENCABEZADO DE LA SECCIÓN */}


            {/* AVISO DE LÍMITE POR NOMINADO */}
            <div className="flex items-start sm:items-center gap-3 bg-[#ee7624]/10 border border-[#ee7624]/30 text-[#ee7624] text-xs sm:text-sm font-semibold rounded-2xl p-4 backdrop-blur-md shadow-lg">
                <div className="p-2 rounded-xl bg-[#ee7624]/20 border border-[#ee7624]/30 shrink-0">
                    <ShieldAlert className="w-4 h-4 text-[#ee7624]" />
                </div>
                <p className="leading-relaxed text-slate-200">
                    <strong className="text-[#ee7624] font-bold">Regla de límite:</strong> cada nominado puede recibir un máximo de {LIMITE_BOLETOS_POR_NOMINADO} boletos en total. Si ya alcanzó el límite, puedes seguir aprobando boletos para él, pero no se le sumarán adicionales.
                </p>
            </div>

            {/* PESTAÑAS */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {PESTANAS.map(({ clave, etiqueta, icono: Icono }) => (
                    <button
                        key={clave}
                        type="button"
                        onClick={() => setPestana(clave)}
                        className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-2xl border whitespace-nowrap transition-all cursor-pointer ${
                            pestana === clave
                                ? 'bg-white/10 border-[#4A8B2C] text-white shadow-md'
                                : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`}
                    >
                        <Icono className="w-4 h-4 text-[#ee7624]" />
                        <span>{etiqueta}</span>
                        <span className="px-1.5 py-0.5 rounded-full bg-black/30 text-[10px] font-black">
                            {contadores[clave]}
                        </span>
                    </button>
                ))}
            </div>

            {/* LISTA DE VOTOS */}
            <div className="space-y-4">
                {votosFiltrados.map((voto) => (
                    <TarjetaAprobacionVoto
                        key={voto.id}
                        voto={voto}
                        votante={participantePorNumeroEmpleado.get(voto.votanteNumeroEmpleado)}
                        boletosActualesPorNominado={boletosActualesPorNominado}
                        limite={LIMITE_BOLETOS_POR_NOMINADO}
                        onRevisarNominacion={revisarNominacion}
                    />
                ))}

                {votosFiltrados.length === 0 && (
                    <div className="bg-slate-900/60 border border-dashed border-white/15 rounded-3xl p-12 text-center space-y-3">
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-white/5 border border-white/10 text-slate-500 flex items-center justify-center">
                            <ListChecks className="w-6 h-6 text-slate-400 stroke-[1.5]" />
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            No hay votos en este estado
                        </p>
                    </div>
                )}
            </div>

        </div>
    );
}