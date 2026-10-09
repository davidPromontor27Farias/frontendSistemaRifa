import { useMemo, useState } from 'react';
import { useAuth } from '../store/authStore';
import { useParticipantes } from '../store/participantesStore';
import { useVotacionMensual } from '../store/votacionStore';
import type { ColaboradorNominable, ComprobanteVoto, SeleccionNominado } from '../types/rifa';

const BOLETOS_MENSUALES = 2;
export const JUSTIFICACION_MIN = 15;

function obtenerMesActivo(): { clave: string; etiqueta: string } {
    const ahora = new Date();
    const etiquetaCruda = new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' }).format(ahora);
    const etiqueta = etiquetaCruda.charAt(0).toUpperCase() + etiquetaCruda.slice(1);
    const clave = `${ahora.getFullYear()}-${ahora.getMonth() + 1}`;
    return { clave, etiqueta };
}

function crearSeleccionInicial(): SeleccionNominado[] {
    return [
        { colaborador: null, boletos: 1, justificacion: '' },
        { colaborador: null, boletos: 1, justificacion: '' },
    ];
}

export function useRifaComercialPage() {
    const { usuario } = useAuth();
    const { activos } = useParticipantes();
    const { ventanaEstaAbierta, yaVotoEnMes, registrarVoto, votos } = useVotacionMensual();

    const { clave: mesClave, etiqueta: mesEtiqueta } = useMemo(obtenerMesActivo, []);

    const [seleccion, setSeleccion] = useState<SeleccionNominado[]>(crearSeleccionInicial);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [indiceSelectorActivo, setIndiceSelectorActivo] = useState<number | null>(null);

    const opciones: ColaboradorNominable[] = useMemo(
        () => activos.filter((p) => p.tipo === 'no_comercial' && p.id !== usuario?.participanteId),
        [activos, usuario?.participanteId]
    );

    const ventanaAbierta = usuario ? ventanaEstaAbierta(mesClave) : false;
    const votoEmitido = usuario ? yaVotoEnMes(usuario.numeroEmpleado, mesClave) : false;

    const comprobante: ComprobanteVoto | null = useMemo(() => {
        if (!usuario || !votoEmitido) return null;
        const voto = votos.find((v) => v.votanteNumeroEmpleado === usuario.numeroEmpleado && v.mesClave === mesClave);
        if (!voto) return null;
        return {
            mes: mesEtiqueta,
            nominaciones: voto.nominaciones.map((n) => ({
                colaborador: n.participante,
                boletos: n.boletos,
                justificacion: n.justificacion,
            })),
            folios: voto.folios,
            fechaEmision: voto.fechaEmision,
        };
    }, [usuario, votoEmitido, votos, mesClave, mesEtiqueta]);

    function abrirSelector(indice: number) {
        if (votoEmitido) return;
        setIndiceSelectorActivo(indice);
    }

    function cerrarSelector() {
        setIndiceSelectorActivo(null);
    }

    function seleccionarEnIndiceActivo(colaborador: ColaboradorNominable) {
        if (indiceSelectorActivo === null) return;
        const indice = indiceSelectorActivo;
        setSeleccion((actual) => actual.map((s, i) => (i === indice ? { ...s, colaborador } : s)));
        setIndiceSelectorActivo(null);
    }

    function quitarColaborador(indice: number) {
        setSeleccion((actual) => actual.map((s, i) => (i === indice ? { ...s, colaborador: null } : s)));
    }

    function actualizarJustificacion(indice: number, valor: string) {
        setSeleccion((actual) => actual.map((s, i) => (i === indice ? { ...s, justificacion: valor } : s)));
    }

    const idsSeleccionados = seleccion.map((s) => s.colaborador?.id).filter((id): id is string => Boolean(id));
    const boletosAsignados = seleccion.reduce((acc, s) => acc + (s.colaborador ? s.boletos : 0), 0);
    const todosLosSlotsLlenos = seleccion.every((s) => s.colaborador !== null);
    const justificacionesValidas = seleccion.map((s) => s.justificacion.trim().length >= JUSTIFICACION_MIN);
    const todasLasJustificacionesValidas = justificacionesValidas.every(Boolean);
    const puedeConfirmar = todosLosSlotsLlenos && todasLasJustificacionesValidas && !votoEmitido && ventanaAbierta;

    function generarFolios(seleccionFinal: SeleccionNominado[]): string[] {
        const base = Date.now() % 90000;
        const sufijoMes = mesEtiqueta.slice(0, 3).toUpperCase();
        return seleccionFinal.flatMap((s, i) =>
            Array.from({ length: s.boletos }, (_, j) => `RF-${sufijoMes}-${String(base + i * 10 + j).padStart(5, '0')}`)
        );
    }

    async function confirmarVoto() {
        if (!puedeConfirmar || !usuario) return;

        const nominaciones = seleccion
            .filter((s): s is SeleccionNominado & { colaborador: ColaboradorNominable } => s.colaborador !== null)
            .map((s) => ({
                participanteId: s.colaborador.id,
                boletos: s.boletos,
                justificacion: s.justificacion.trim(),
            }));

        const exito = await registrarVoto({
            mesClave,
            votanteNumeroEmpleado: usuario.numeroEmpleado,
            nominaciones,
            folios: generarFolios(seleccion),
        });

        if (exito) setModalAbierto(true);
    }

    return {
        usuario,
        mesEtiqueta,
        ventanaAbierta,
        seleccion,
        idsSeleccionados,
        opciones,
        boletosAsignados,
        boletosMensuales: BOLETOS_MENSUALES,
        justificacionesValidas,
        puedeConfirmar,
        confirmarVoto,
        modalAbierto,
        setModalAbierto,
        comprobante,
        votoEmitido,
        indiceSelectorActivo,
        abrirSelector,
        cerrarSelector,
        seleccionarEnIndiceActivo,
        quitarColaborador,
        actualizarJustificacion,
    };
}
