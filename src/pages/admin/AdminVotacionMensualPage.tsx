import { Info } from 'lucide-react';
import { useVotacionMensual } from '../../store/votacionStore';
import { TarjetaVentanaVotacion } from '../../components/admin/TarjetaVentanaVotacion';

function formatearFecha(iso: string): string {
    return new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
}

export function AdminVotacionMensualPage() {
    const { ventanas, ventanaActiva, cargando } = useVotacionMensual();
    const activa = ventanaActiva();

    return (
        <div className="space-y-6 text-slate-100 pt-10">

            {/* ENCABEZADO DE LA SECCIÓN */}

            {/* AVISO: MES ACTIVO */}
            {activa ? (
                <div className="flex items-center gap-3 bg-[#4A8B2C]/10 border border-[#4A8B2C]/30 text-emerald-300 text-xs sm:text-sm font-semibold rounded-2xl p-4 backdrop-blur-md shadow-lg">
                    <div className="p-2 rounded-xl bg-[#4A8B2C]/20 border border-[#4A8B2C]/30 shrink-0">
                        <Info className="w-4 h-4" />
                    </div>
                    <p className="leading-relaxed text-slate-200">
                        <strong className="text-emerald-300 font-bold">Mes activo: {activa.mesEtiqueta}.</strong>{' '}
                        La votación está abierta hasta el {formatearFecha(activa.fechaFin)}.
                    </p>
                </div>
            ) : (
                <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold rounded-2xl p-4 backdrop-blur-md shadow-lg">
                    <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 shrink-0">
                        <Info className="w-4 h-4" />
                    </div>
                    <p className="leading-relaxed text-slate-200">
                        No hay ningún mes de votación abierto en este momento.
                    </p>
                </div>
            )}

            {/* LISTA DE MESES DE LA CAMPAÑA */}
            <div className="space-y-3">
                {!cargando && ventanas.map((ventana) => (
                    <TarjetaVentanaVotacion key={ventana.mesClave} ventana={ventana} />
                ))}
            </div>

        </div>
    );
}