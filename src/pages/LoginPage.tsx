import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, KeyRound, LogIn, Trophy, TicketCheck } from "lucide-react";
import { useAuth } from "../store/authStore";

export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [numeroEmpleado, setNumeroEmpleado] = useState("");
    const [error, setError] = useState(false);

    async function manejarEnvio(evento: FormEvent) {
        evento.preventDefault();
        const encontrado = await login(numeroEmpleado);
        if (!encontrado) {
            setError(true);
            return;
        }
        setError(false);
        if (encontrado.rol === "rh") {
            navigate("/rh", { replace: true });
            return;
        }
        const esAdmin = encontrado.rol === "admin_comercial" || encontrado.rol === "direccion_general";
        navigate(esAdmin ? "/admin/votacion" : "/", { replace: true });
    }

    return (
        <div className="min-h-screen w-full flex bg-slate-950 text-slate-100 overflow-hidden select-none">

            {/* LADO IZQUIERDO: HERO VISUAL INNOVADOR (TÓMBOLA + GLASSMORPHISM) */}
            <div className="hidden lg:flex lg:w-[55%] relative items-center justify-center p-12 overflow-hidden">

                {/* Imagen de Fondo de la Tómbola con Tratamiento Visual */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
                    style={{ backgroundImage: `url("/imgIcon.jpg")` }}
                />

                {/* Overlays Gradientes en Colores de Marca */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />

                {/* Resplandores Ambientales (#4A8B2C y #ee7624) */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4A8B2C]/30 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ee7624]/30 rounded-full blur-[120px] pointer-events-none" />

                {/* Contenido Elevado sobre la Tómbola */}
                <div className="relative z-10 max-w-lg space-y-8">

                    {/* Badge de Aniversario */}
                    <div className="inline-flex items-center gap-2  py-1.5 rounded-full   text-[25px] font-bold text-[#ee7624] tracking-widest uppercase shadow-xl">
                        <span>Rumbo a los 60 Años</span>
                    </div>

                    {/* Mensaje de Impacto */}
                    <div className="space-y-3">
                        <h2 className="text-4xl font-black tracking-tight text-white leading-tight">
                            La emoción de ganar, <br />
                            <span className="bg-gradient-to-r from-[#4A8B2C] via-emerald-400 to-[#ee7624] bg-clip-text text-transparent">
                                ahora 100% digital.
                            </span>
                        </h2>
                        <p className="text-slate-300 text-sm leading-relaxed font-normal">
                            Participa con tus boletos acumulados por ventas y reconocimientos. Cada esfuerzo te acerca al gran premio de la Convención 2027.
                        </p>
                    </div>

                    {/* Tarjeta Flotante Interactiva (Widget de Stats de la Rifa) */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#4A8B2C]/20 border border-[#4A8B2C]/40 flex items-center justify-center text-[#4A8B2C]">
                                <Trophy className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[17px] text-slate-400 uppercase tracking-wider font-semibold">Premios Estelar</p>
                                <p className="text-[15px] font-bold text-white">Auto &bull; Moto &bull; Bicicleta</p>
                            </div>
                        </div>

                        <div className=" p-4 rounded-2xl shadow-2xl flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#ee7624]/20 border border-[#ee7624]/40 flex items-center justify-center text-[#ee7624]">
                                <TicketCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[16px] text-slate-400 uppercase tracking-wider font-semibold">Tómbola Digital</p>
                                <p className="text-[15px] font-bold text-white">Folios Transparentes</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* LADO DERECHO: FORMULARIO DE ACCESO PREMIUM */}
            <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-12 relative bg-slate-950">

                <div className="hidden lg:block absolute -left-[2px] top-1/6 bottom-1/6 w-[4px] bg-gradient-to-b from-transparent via-[#4A8B2C] to-transparent opacity-40 blur-[4px] pointer-events-none" />
                <div className="hidden lg:block absolute left-0 top-12 bottom-12 w-[1px] bg-gradient-to-b from-transparent via-[#4A8B2C]/40 to-transparent pointer-events-none" />
                <div className="hidden lg:block absolute left-[-2px] top-1/2 -translate-y-1/2 w-[4px] h-16 bg-[#ee7624]/50 rounded-full blur-[3px] pointer-events-none" />

                <div className="absolute top-0 right-0 w-80 h-80 bg-[#4A8B2C]/15 rounded-full blur-[100px] pointer-events-none lg:hidden" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#ee7624]/15 rounded-full blur-[100px] pointer-events-none lg:hidden" />

                <div className="w-full max-w-md space-y-8 relative z-10">

                    <div className="flex flex-col items-center justify-center text-center">

                        <div className="relative group mb-4 flex items-center justify-center mx-auto">
                            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#4A8B2C] to-[#ee7624] opacity-50 blur-md group-hover:opacity-80 transition duration-300" />
                            <div className="relative w-16 h-16 rounded-2xl bg-slate-900 border border-white/15 p-2 flex items-center justify-center shadow-xl">
                                <img
                                    src="/icon.png"
                                    alt="Imperquimia Logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            Iniciar Sesión
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1">
                            Ingresa tu número de empleado para acceder a la plataforma
                        </p>
                    </div>

                    <form onSubmit={manejarEnvio} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="numeroEmpleado" className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                Número de empleado
                            </label>

                            <div className="relative flex items-center">
                                <KeyRound className="w-4 h-4 text-slate-500 absolute left-4 pointer-events-none" />
                                <input
                                    id="numeroEmpleado"
                                    autoFocus
                                    type="text"
                                    value={numeroEmpleado}
                                    onChange={(e) => {
                                        setNumeroEmpleado(e.target.value);
                                        setError(false);
                                    }}
                                    placeholder="Ej. 1001"
                                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-900/90 border border-white/10 text-white text-sm font-semibold placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#4A8B2C] focus:border-transparent transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#ee7624]/15 border border-[#ee7624]/30 text-xs text-[#ee7624] font-medium animate-shake">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>No encontramos ese número de empleado. Verifica e intenta de nuevo.</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!numeroEmpleado.trim()}
                            className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#4A8B2C] to-[#ee7624] hover:brightness-110 text-white font-bold text-sm py-4 px-4 rounded-2xl shadow-xl shadow-[#4A8B2C]/20 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
                        >
                            <LogIn className="w-4 h-4" />
                            <span>Ingresar a la Rifa</span>
                        </button>
                    </form>

                </div>
            </div>

        </div>
    );
}