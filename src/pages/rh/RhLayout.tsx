import { Outlet } from "react-router-dom";
import { LogOut, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "../../store/authStore";

function obtenerIniciales(nombre?: string | null): string {
    if (!nombre) return "?";
    const partes = nombre.trim().split(/\s+/);
    return ((partes[0]?.[0] ?? "") + (partes[1]?.[0] ?? "")).toUpperCase();
}

export function RhLayout() {
    const { usuario, logout } = useAuth();

    return (
        <div className="min-h-screen w-full relative bg-slate-950 text-slate-100 flex flex-col justify-start overflow-x-hidden">

            <div
                className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-fixed pointer-events-none z-0 transform scale-105"
                style={{ backgroundImage: `url("/walppaper.webp")` }}
            />
            <div className="fixed inset-0 w-full h-full bg-slate-950/80 backdrop-blur-xs pointer-events-none z-0" />

            <header className="fixed top-0 left-0 right-0 z-50 w-full bg-slate-900/90 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3">
                    <div className="flex items-center justify-between gap-4">

                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-white/15 p-1.5 flex items-center justify-center shrink-0 shadow-md">
                                <img
                                    src="/icon.png"
                                    alt="Imperquimia Logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs font-black text-white tracking-tight uppercase leading-none">Imperquimia</p>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#4A8B2C]/20 border border-[#4A8B2C]/30 text-emerald-300 text-[9px] font-bold uppercase">
                                        <ShieldCheck className="w-3 h-3" />
                                        RH
                                    </span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
                                    Recursos Humanos
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-2xl">
                                <div className="relative shrink-0">
                                    <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-[#4A8B2C] to-[#ee7624] opacity-75 blur-xs" />
                                    <div className="relative w-8 h-8 rounded-lg bg-slate-900 border border-white/20 text-white flex items-center justify-center font-black text-xs shadow-md">
                                        {obtenerIniciales(usuario?.nombre)}
                                    </div>
                                </div>
                                <div className="min-w-0 hidden md:block">
                                    <h2 className="text-xs font-bold text-white truncate max-w-[150px] leading-tight">
                                        {usuario?.nombre ?? "Recursos Humanos"}
                                    </h2>
                                    <span className="text-[9px] text-emerald-400 font-semibold block">
                                        Administrador de Nóminas
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={logout}
                                title="Cerrar Sesión"
                                className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 hover:text-rose-100 text-xs font-bold transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Salir</span>
                            </button>
                        </div>

                    </div>
                </div>
            </header>

            <main className="relative z-10 flex-1 pt-24 sm:pt-28 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">

                <div className="mb-6 flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md shadow-xl text-xs">
                    <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-[#ee7624] shrink-0" />
                        <span className="text-slate-300 font-medium">
                            Panel de Recursos Humanos &bull; Gestión de Personal Imperquimia
                        </span>
                    </div>
                </div>

                <div className="w-full pb-12">
                    <Outlet />
                </div>

            </main>

        </div>
    );
}