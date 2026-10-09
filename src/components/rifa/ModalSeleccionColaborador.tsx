import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, User, Building2, X } from 'lucide-react';
import type { ColaboradorNominable } from '../../types/rifa';

interface ModalSeleccionColaboradorProps {
    abierto: boolean;
    opciones: ColaboradorNominable[];
    excluirIds: string[];
    onSeleccionar: (colaborador: ColaboradorNominable) => void;
    onCerrar: () => void;
}

export function ModalSeleccionColaborador({ abierto, opciones, excluirIds, onSeleccionar, onCerrar }: ModalSeleccionColaboradorProps) {
    const [query, setQuery] = useState('');

    useEffect(() => {
        if (abierto) setQuery('');
    }, [abierto]);

    const resultados = useMemo(() => {
        const termino = query.trim().toLowerCase();
        return opciones.filter((c) => {
            if (excluirIds.includes(c.id)) return false;
            if (!termino) return true;
            return (
                c.nombre.toLowerCase().includes(termino) ||
                c.departamento.toLowerCase().includes(termino) ||
                c.area.toLowerCase().includes(termino)
            );
        });
    }, [query, excluirIds, opciones]);

    return (
        <AnimatePresence>
            {abierto && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={onCerrar}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                    >
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
                            <div>
                                <h3 className="text-base font-bold text-gray-900">Selecciona un colaborador</h3>
                                <p className="text-xs text-gray-500">Busca por nombre, departamento o área</p>
                            </div>
                            <button
                                type="button"
                                onClick={onCerrar}
                                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 active:scale-90 transition-all cursor-pointer"
                            >
                                <X className="w-4.5 h-4.5" />
                            </button>
                        </div>

                        <div className="p-4 border-b border-gray-100 shrink-0">
                            <div className="relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    autoFocus
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Buscar por nombre o departamento..."
                                    className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a8b2c]/40 focus:border-[#4a8b2c] transition-all"
                                />
                            </div>
                        </div>

                        <div className="overflow-y-auto flex-1">
                            {resultados.length > 0 ? (
                                resultados.map((c) => (
                                    <button
                                        key={c.id}
                                        type="button"
                                        onClick={() => onSeleccionar(c)}
                                        className="w-full flex items-center gap-3 px-5 py-3 hover:bg-[#4a8b2c]/5 active:bg-[#4a8b2c]/10 text-left transition-colors border-b border-gray-50 last:border-b-0 cursor-pointer"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                            <User className="w-4.5 h-4.5 text-gray-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{c.nombre}</p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
                                                <Building2 className="w-3 h-3 shrink-0" /> {[c.departamento, c.area].filter(Boolean).join(' · ')}
                                            </p>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <p className="px-5 py-8 text-sm text-gray-400 text-center">Sin resultados para "{query}"</p>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
