import { Gift } from 'lucide-react';

interface TarjetaBoletosAcumuladosProps {
    totalBoletos: number;
    boletosPorMes: Record<string, number>;
}

function etiquetaDeClaveMes(clave: string): string {
    const [anio, mes] = clave.split('-').map(Number);
    const fecha = new Date(anio, mes - 1, 1);
    const cruda = new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' }).format(fecha);
    return cruda.charAt(0).toUpperCase() + cruda.slice(1);
}

export function TarjetaBoletosAcumulados({ totalBoletos, boletosPorMes }: TarjetaBoletosAcumuladosProps) {
    const meses = Object.entries(boletosPorMes).sort(([a], [b]) => a.localeCompare(b));

    return (
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#4a8b2c] to-[#386b20] p-5 sm:p-6 shadow-xl shadow-[#4a8b2c]/20 text-white">
            <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -left-6 -bottom-10 w-32 h-32 rounded-full bg-[#ee7624]/20 blur-2xl" />

            <div className="relative z-10">
                <div className="flex items-center gap-2 text-white/80 text-xs sm:text-sm font-medium">
                    <Gift className="w-4 h-4" />
                    Tus boletos acumulados para la rifa
                </div>
                <p className="text-4xl sm:text-5xl font-extrabold mt-1 tabular-nums">{totalBoletos}</p>

                {meses.length > 0 && (
                    <div className="mt-4 space-y-1.5">
                        {meses.map(([mesClave, boletos]) => (
                            <div key={mesClave} className="flex items-center justify-between text-sm text-white/90">
                                <span>{etiquetaDeClaveMes(mesClave)}</span>
                                <span className="font-semibold tabular-nums">{boletos} boleto(s)</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
