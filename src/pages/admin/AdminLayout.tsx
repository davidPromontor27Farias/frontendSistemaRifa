import { NavLink, Outlet } from "react-router-dom";
import { LogOut, CalendarDays, BarChart3, Dices, Sparkles, ClipboardCheck, ListChecks } from "lucide-react";
import { useAuth } from "../../store/authStore";

const ENLACES = [
    { to: "/admin/votacion", etiqueta: "Votación Mensual", icono: CalendarDays },
    { to: "/admin/aprobaciones", etiqueta: "Aprobación de Boletos", icono: ListChecks},
    { to: "/admin/cierre-mes", etiqueta: "Cierre de Mes", icono: ClipboardCheck },
    { to: "/admin/acumulados", etiqueta: "Acumulados", icono: BarChart3 },
    { to: "/admin/tombola", etiqueta: "Tómbola Sorteo", icono: Dices },
];

export function AdminLayout() {
    const { logout } = useAuth();

    return (
        <div className="min-h-screen w-full relative bg-slate-950 text-slate-100 flex flex-col justify-start overflow-x-hidden">

            {/* Capa de Fondo Fija Continuada */}
            <div
                className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-fixed pointer-events-none z-0 transform scale-105"
                style={{ backgroundImage: `url("/walppaper.webp")` }}
            />
            <div className="fixed inset-0 w-full h-full bg-slate-950/80 backdrop-blur-xs pointer-events-none z-0" />

            {/* ========================================================================= */}
            {/* 1. NAVBAR ADMINISTRATIVA FIJA SUPERIOR                                     */}
            {/* ========================================================================= */}
            <header className="fixed top-0 left-0 right-0 z-50 w-full bg-slate-900/90 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-3 pb-0">

                    {/* ENCABEZADO: MARCA, USUARIO Y SALIR */}
                    <div className="flex items-center justify-between gap-4 pb-3">

                        {/* Logotipo & Badge Admin */}
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

                                </div>
                                <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
                                    Control General
                                </p>
                            </div>
                        </div>

                        {/* Perfil del Administrador & Botón de Salida */}
                        <div className="flex items-center gap-3 sm:gap-4">

                            {/* Card de Usuario */}
                            <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-2xl">
                                <div className="relative shrink-0">
                                    <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-[#4A8B2C] to-[#ee7624] opacity-75 blur-xs" />
      
                                </div>
                                <div className="min-w-0 hidden md:block">

                                    <span className="text-[9px] text-emerald-400 font-semibold block">
                                        Superusuario
                                    </span>
                                </div>
                            </div>

                            {/* Botón Salir */}
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

                    {/* NAVEGACIÓN POR PESTAÑAS (TABS) */}
                    <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar pt-1">
                        {ENLACES.map(({ to, etiqueta, icono: Icono }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                                        isActive
                                            ? "bg-white/10 border-[#4A8B2C] text-white shadow-md"
                                            : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
                                    }`
                                }
                            >
                                <Icono className="w-4 h-4 text-[#ee7624]" />
                                <span>{etiqueta}</span>
                            </NavLink>
                        ))}
                    </nav>

                </div>
            </header>

            {/* ========================================================================= */}
            {/* 2. ÁREA DE TRABAJO PRINCIPAL (CON DISTANCIA PT PARA LA NAVBAR FIXED)       */}
            {/* ========================================================================= */}
            <main className="relative z-10 flex-1 pt-28 sm:pt-32 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">

                {/* Banner Sutil de Contexto */}
                <div className="mb-6 flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md shadow-xl text-xs">
                    <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-[#ee7624] shrink-0" />
                        <span className="text-slate-300 font-medium">
                            Panel de Administración &bull; Rifa Electrónica Convención Comercial Imperquimia
                        </span>
                    </div>
                </div>

                {/* Vistas Secundarias (Votación, Cierre de Mes, Acumulados, Tómbola) */}
                <div className="w-full pb-12">
                    <Outlet />
                </div>

            </main>

        </div>
    );
}