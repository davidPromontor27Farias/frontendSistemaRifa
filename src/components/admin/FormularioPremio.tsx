import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import type { CategoriaPremio } from '../../types/tombola';

export interface DatosPremioForm {
    nombre: string;
    categoria: CategoriaPremio;
    orden: number;
}

interface FormularioPremioProps {
    siguienteOrden: number;
    onGuardar: (datos: DatosPremioForm) => void;
    onCerrar: () => void;
}

export function FormularioPremio({ siguienteOrden, onGuardar, onCerrar }: FormularioPremioProps) {
    const [nombre, setNombre] = useState('');
    const [categoria, setCategoria] = useState<CategoriaPremio>('mayor');

    function manejarEnvio(evento: FormEvent) {
        evento.preventDefault();
        if (!nombre.trim()) return;
        onGuardar({ nombre: nombre.trim(), categoria, orden: siguienteOrden });
    }

    return (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <form
                onSubmit={manejarEnvio}
                className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-100 p-5 sm:p-6 space-y-4"
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-gray-900">Nuevo premio</h2>
                    <button type="button" onClick={onCerrar} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div>
                    <label className="text-xs font-semibold text-gray-500">Nombre del premio</label>
                    <input
                        autoFocus
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ej. Auto 0km"
                        className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#4a8b2c]/30 focus:border-[#4a8b2c] outline-none"
                    />
                </div>

                <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Categoría</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => setCategoria('mayor')}
                            className={`px-3 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                                categoria === 'mayor'
                                    ? 'bg-[#4a8b2c] text-white border-[#4a8b2c]'
                                    : 'bg-white text-gray-600 border-gray-200'
                            }`}
                        >
                            Premio mayor
                        </button>
                        <button
                            type="button"
                            onClick={() => setCategoria('menor')}
                            className={`px-3 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                                categoria === 'menor'
                                    ? 'bg-[#4a8b2c] text-white border-[#4a8b2c]'
                                    : 'bg-white text-gray-600 border-gray-200'
                            }`}
                        >
                            Premio menor
                        </button>
                    </div>
                    {categoria === 'mayor' && (
                        <p className="text-xs text-gray-400 mt-1.5">
                            Regla aplicada: un participante solo puede ganar un premio mayor.
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={!nombre.trim()}
                    className="w-full py-3 rounded-xl text-sm font-bold text-white bg-linear-to-r from-[#4a8b2c] to-[#ee7624] active:scale-95 transition disabled:opacity-40"
                >
                    Guardar premio
                </button>
            </form>
        </div>
    );
}
