import { ArrowLeft, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../store/authStore';
import { useVotacionMensual } from '../store/votacionStore';
import { TarjetaBoletosAcumulados } from '../components/rifa/TarjetaBoletosAcumulados';

export function MisBoletosPage() {
    const { usuario } = useAuth();
    const { calcularAcumulados } = useVotacionMensual();

    const acumulado = usuario?.participanteId
        ? calcularAcumulados().find((a) => a.participanteId === usuario.participanteId)
        : undefined;

    return (
        <div className="max-w-xl mx-auto p-4 space-y-5">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-4 h-4" />
                Volver a votar
            </Link>

            {usuario?.participanteId ? (
                <TarjetaBoletosAcumulados
                    totalBoletos={acumulado?.totalBoletos ?? 0}
                    boletosPorMes={acumulado?.boletosPorMes ?? {}}
                />
            ) : (
                <section className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-start gap-3">
                    <Info className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-500">
                        No eres participante nominable en la rifa de este año, por lo que no acumulas boletos propios.
                        Puedes seguir votando normalmente para apoyar a tus compañeros.
                    </p>
                </section>
            )}
        </div>
    );
}
