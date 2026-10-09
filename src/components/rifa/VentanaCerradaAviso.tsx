import { CalendarOff } from 'lucide-react';

export function VentanaCerradaAviso() {
    return (
        <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <CalendarOff className="w-7 h-7 text-gray-400" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">La votación de este mes no está abierta</h2>
            <p className="text-sm text-gray-500 mt-1.5 max-w-sm mx-auto">
                La votación está disponible del 1 al último día de cada mes, de octubre a diciembre. Vuelve a intentarlo
                cuando inicie el siguiente periodo.
            </p>
        </section>
    );
}
