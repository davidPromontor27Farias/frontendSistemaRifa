import { useMemo, useState } from 'react';
import { AlertTriangle, Plus, Dices, Gift, Sparkles } from 'lucide-react';
import { useParticipantes } from '../../store/participantesStore';
import { useVotacionMensual } from '../../store/votacionStore';
import { useTombola } from '../../store/tombolaStore';
import { TarjetaPremio } from '../../components/tombola/TarjetaPremio';
import { FormularioPremio, type DatosPremioForm } from '../../components/admin/FormularioPremio';
import { RuletaSorteo, type SegmentoRuleta } from '../../components/tombola/RuletaSorteo';
import { ModalGanadorPremio } from '../../components/tombola/ModalGanadorPremio';
import type { GanadorPremio } from '../../types/tombola';

const MAX_SEGMENTOS_VISIBLES = 8;

export function AdminTombolaPage() {
    const { lista: participantes, activos } = useParticipantes();
    const { calcularAcumulados } = useVotacionMensual();
    const { premios, ganadores, agregarPremio, ejecutarSorteo } = useTombola();

    const [formularioAbierto, setFormularioAbierto] = useState(false);
    const [premioEnSorteoId, setPremioEnSorteoId] = useState<string | null>(null);
    const [girando, setGirando] = useState(false);
    const [ganadorActual, setGanadorActual] = useState<GanadorPremio | null>(null);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [errorSorteo, setErrorSorteo] = useState<string | null>(null);

    const nombrePorId = useMemo(() => new Map(participantes.map((p) => [p.id, p.nombre])), [participantes]);
    const premioEnSorteo = premios.find((p) => p.id === premioEnSorteoId) ?? null;

    const segmentos: SegmentoRuleta[] = useMemo(() => {
        if (!premioEnSorteo) return [];
        const acumulados = calcularAcumulados();
        const idsActivos = new Set(activos.map((p) => p.id));

        // Misma regla que el store: un ganador de premio mayor no vuelve a aparecer como opción en otro premio mayor.
        const idsGanadoresDeMayores = new Set(
            ganadores
                .filter((g) => premios.find((p) => p.id === g.premioId)?.categoria === 'mayor')
                .map((g) => g.participanteId)
        );

        const elegibles = acumulados.filter((a) => {
            if (!idsActivos.has(a.participanteId) || a.totalBoletos <= 0) return false;
            if (premioEnSorteo.categoria === 'mayor' && idsGanadoresDeMayores.has(a.participanteId)) return false;
            return true;
        });

        const principales = elegibles
            .sort((a, b) => b.totalBoletos - a.totalBoletos)
            .slice(0, MAX_SEGMENTOS_VISIBLES);

        if (ganadorActual && !principales.some((a) => a.participanteId === ganadorActual.participanteId)) {
            const ganadorAcumulado = elegibles.find((a) => a.participanteId === ganadorActual.participanteId);
            if (ganadorAcumulado) principales[principales.length - 1] = ganadorAcumulado;
        }

        return principales.map((a) => ({
            participanteId: a.participanteId,
            nombre: nombrePorId.get(a.participanteId) ?? '—',
            boletos: a.totalBoletos,
        }));
    }, [premioEnSorteo, calcularAcumulados, activos, ganadores, premios, ganadorActual, nombrePorId]);

    async function sortear(premioId: string) {
        setErrorSorteo(null);
        const acumulados = calcularAcumulados();
        const idsActivos = new Set(activos.map((p) => p.id));
        const ganador = await ejecutarSorteo(premioId, acumulados, idsActivos);
        if (!ganador) {
            setErrorSorteo(
                'No hay participantes elegibles para este premio (sin boletos activos o ya ganaron un premio mayor).'
            );
            return;
        }
        setPremioEnSorteoId(premioId);
        setGanadorActual(ganador);
        setGirando(true);
    }

    function manejarFinAnimacion() {
        setGirando(false);
        setModalAbierto(true);
    }

    function guardarPremio(datos: DatosPremioForm) {
        agregarPremio(datos);
        setFormularioAbierto(false);
    }

    const nombreGanadorActual = ganadorActual ? nombrePorId.get(ganadorActual.participanteId) ?? '—' : '';

    return (
        <div className="space-y-6 text-slate-100 pt-10">
            
            {/* ENCABEZADO DE LA SECCIÓN */}
            <div className="bg-slate-900/85 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
                {/* Resplandor ambiental de fondo */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ee7624]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex items-center gap-3.5">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-[#ee7624]/20 to-[#ee7624]/5 border border-[#ee7624]/30 text-[#ee7624] shadow-inner shrink-0">
                        <Dices className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                Tómbola Digital de Sorteo
                            </h1>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#4A8B2C]/20 border border-[#4A8B2C]/30 text-[#4A8B2C] text-[10px] font-black uppercase tracking-widest">
                                Fase 4
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                            Gestión de premios y ejecución del sorteo aleatorio ponderado por folios acumulados.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 shrink-0">
                    <button
                        type="button"
                        onClick={() => setFormularioAbierto(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#4A8B2C] via-emerald-600 to-[#ee7624] hover:brightness-110 active:scale-95 text-white text-xs font-black uppercase tracking-wider px-5 py-3.5 rounded-2xl transition cursor-pointer shadow-lg shadow-[#4A8B2C]/20"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Nuevo Premio</span>
                    </button>
                </div>
            </div>

            {/* ALERTA DE ERROR EN SORTEO */}
            {errorSorteo && (
                <div className="flex items-start gap-3 bg-[#ee7624]/15 border border-[#ee7624]/30 text-[#ee7624] text-xs sm:text-sm font-semibold rounded-2xl p-4 backdrop-blur-md shadow-lg animate-fade-in">
                    <div className="p-2 rounded-xl bg-[#ee7624]/20 border border-[#ee7624]/30 shrink-0">
                        <AlertTriangle className="w-4 h-4 text-[#ee7624]" />
                    </div>
                    <p className="leading-relaxed text-slate-200 mt-0.5">
                        <strong className="text-[#ee7624] font-bold">Atención:</strong> {errorSorteo}
                    </p>
                </div>
            )}

            {/* SECCIÓN DE LA RULETA EN SORTEO */}
            {premioEnSorteo && (girando || modalAbierto) && (
                <div className="relative bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-white/15 p-6 shadow-2xl space-y-4 text-center overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#4A8B2C] via-[#ee7624] to-[#4A8B2C]" />

                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300 uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-[#ee7624] animate-spin" style={{ animationDuration: '3s' }} />
                        <span>Sorteando Premio:</span>
                        <span className="text-white font-black">{premioEnSorteo.nombre}</span>
                    </div>

                    <RuletaSorteo
                        segmentos={segmentos}
                        ganadorId={ganadorActual?.participanteId ?? null}
                        girando={girando}
                        onFinAnimacion={manejarFinAnimacion}
                    />
                </div>
            )}

            {/* LISTA DE PREMIOS REGISTRADOS */}
            <div className="space-y-3">
                {[...premios]
                    .sort((a, b) => a.orden - b.orden)
                    .map((premio) => {
                        const ganador = ganadores.find((g) => g.premioId === premio.id);
                        return (
                            <TarjetaPremio
                                key={premio.id}
                                premio={premio}
                                nombreGanador={ganador ? nombrePorId.get(ganador.participanteId) : undefined}
                                onSortear={() => sortear(premio.id)}
                            />
                        );
                    })}

                {/* ESTADO VACÍO */}
                {premios.length === 0 && (
                    <div className="bg-slate-900/60 border border-dashed border-white/15 rounded-3xl p-12 text-center space-y-3">
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-white/5 border border-white/10 text-slate-500 flex items-center justify-center">
                            <Gift className="w-6 h-6 text-slate-400 stroke-[1.5]" />
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Aún no hay premios registrados
                        </p>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            Comienza agregando los reconocimientos que se sortearán durante la Convención Comercial.
                        </p>
                    </div>
                )}
            </div>

            {/* MODAL FORMULARIO DE PREMIO */}
            {formularioAbierto && (
                <FormularioPremio
                    siguienteOrden={premios.length + 1}
                    onGuardar={guardarPremio}
                    onCerrar={() => setFormularioAbierto(false)}
                />
            )}

            {/* MODAL DE ANUNCIO DE GANADOR */}
            <ModalGanadorPremio
                abierto={modalAbierto}
                premio={premioEnSorteo}
                nombreGanador={nombreGanadorActual}
                folioGanador={ganadorActual?.folioGanador ?? ''}
                onCerrar={() => setModalAbierto(false)}
            />

        </div>
    );
}