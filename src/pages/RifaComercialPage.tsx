import { CalendarDays, LogOut, Ticket as TicketIcon, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRifaComercialPage } from '../hooks/useRifaComercialPage';
import { useAuth } from '../store/authStore';
import { TarjetaSaldoBoletos } from '../components/rifa/TarjetaSaldoBoletos';
import { FormularioNominacion } from '../components/rifa/FormularioNominacion';
import { EstadoVotacionCompletada } from '../components/rifa/EstadoVotacionCompletada';
import { ModalComprobante } from '../components/rifa/ModalComprobante';
import { ModalSeleccionColaborador } from '../components/rifa/ModalSeleccionColaborador';
import { VentanaCerradaAviso } from '../components/rifa/VentanaCerradaAviso';

export function RifaComercialPage() {
    const { logout } = useAuth();
    const {
        usuario,
        mesEtiqueta,
        ventanaAbierta,
        seleccion,
        idsSeleccionados,
        opciones,
        boletosAsignados,
        boletosMensuales,
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
    } = useRifaComercialPage();

    const idsExcluidosParaSelector =
        indiceSelectorActivo !== null
            ? idsSeleccionados.filter((id) => id !== seleccion[indiceSelectorActivo]?.colaborador?.id)
            : idsSeleccionados;

    return (
        <div className="min-h-screen w-full relative bg-slate-950 text-slate-100 flex flex-col justify-start">
            
            {/* Capa de Fondo Fija Continuada */}
            <div
                className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-fixed pointer-events-none z-0 transform scale-105"
                style={{ backgroundImage: `url('/walppaper.webp')` }}
            />
            <div className="fixed inset-0 w-full h-full bg-slate-950/80 backdrop-blur-xs pointer-events-none z-0" />

            {/* ========================================================================= */}
            {/* 1. NAVBAR SUPERIOR POSICIONADA COMO FIXED (PERMANENTE AL SCROLL)           */}
            {/* ========================================================================= */}
            <header className="fixed top-0 left-0 right-0 z-50 w-full bg-slate-900/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3 shadow-2xl transition-all">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    
                    {/* Logotipo e Identidad */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 border border-white/15 p-1.5 flex items-center justify-center shrink-0 shadow-md">
                            <img 
                                src="/icon.png" 
                                alt="Imperquimia Logo" 
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-xs font-black text-white tracking-tight uppercase leading-none">Imperquimia</p>
                        </div>
                    </div>

                    {/* Perfil del Usuario + Periodo Activo */}
                    <div className="flex items-center gap-3 sm:gap-6">
                        
                        {/* Usuario */}
                        <div className="flex items-center gap-2" >
                            
          
                            <div className="min-w-0 hidden md:block">
                                <h2 className="text-xs font-bold text-white truncate max-w-[160px] leading-tight">
                                    {usuario?.nombre ?? 'Ejecutivo Comercial'}
                                </h2>

                            </div>
                        </div>

                        {/* Badge Mes */}
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#4A8B2C]/20 text-[#4A8B2C] border border-[#4A8B2C]/30 font-bold text-xs uppercase shadow-inner">
                            <CalendarDays className="w-3.5 h-3.5" />
                            <span>{mesEtiqueta}</span>
                        </span>

                        {/* Botón Salir */}
                        <button
                            type="button"
                            onClick={logout}
                            title="Cerrar Sesión"
                            className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 hover:text-rose-100 text-xs font-bold transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden lg:inline">Salir</span>
                        </button>
                    </div>

                </div>
            </header>

            {/* ========================================================================= */}
            {/* 2. ÁREA DE TRABAJO PRINCIPAL (CON MARGEN SUPERIOR SEGURO DE 112px / pt-28) */}
            {/* ========================================================================= */}
            <main className="relative z-10 flex-1 pt-28 sm:pt-32 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full mt-20">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* COLUMNA IZQUIERDA: RESUMEN DE BOLETOS Y ACCESO RÁPIDO (4 COLS) */}
                    <div className="lg:col-span-4 space-y-4">
                        
                        {/* Tarjeta de Saldo de Boletos */}
                        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-1">
                            <TarjetaSaldoBoletos
                                boletosMensuales={boletosMensuales}
                                boletosAsignados={boletosAsignados}
                                votoEmitido={votoEmitido}
                            />
                        </div>

                        {/* Botón a Mis Boletos Acumulados */}
                        {usuario?.participanteId && (
                            <Link
                                to="/mis-boletos"
                                className="group flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur-xl border border-white/10 hover:border-[#4A8B2C]/50 rounded-2xl shadow-xl transition-all duration-300 cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-[#4A8B2C]/20 border border-[#4A8B2C]/30 text-[#4A8B2C]">
                                        <TicketIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition">
                                            Mis Boletos Acumulados
                                        </p>
                                        <p className="text-[11px] text-slate-400">
                                            Consulta tus folios acumulados
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition" />
                            </Link>
                        )}



                    </div>

                    {/* COLUMNA DERECHA: FORMULARIO PRINCIPAL AMPLIO (8 COLS) */}
                    <div className="lg:col-span-8 h-auto pb-16">
                        {!ventanaAbierta ? (
                            <div className="bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
                                <VentanaCerradaAviso />
                            </div>
                        ) : votoEmitido && comprobante ? (
                            <div className="bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
                                <EstadoVotacionCompletada
                                    comprobante={comprobante}
                                />
                            </div>
                        ) : (
                            <FormularioNominacion
                                seleccion={seleccion}
                                onAbrirSelector={abrirSelector}
                                onQuitarColaborador={quitarColaborador}
                                onCambiarJustificacion={actualizarJustificacion}
                                justificacionesValidas={justificacionesValidas}
                                puedeConfirmar={puedeConfirmar}
                                onConfirmar={confirmarVoto}
                            />
                        )}
                    </div>

                </div>

            </main>

            {/* Modal de Comprobante Digital */}
            <ModalComprobante
                abierto={modalAbierto}
                comprobante={comprobante}
                onCerrar={() => setModalAbierto(false)}
            />

            {/* Modal de Selección de Colaborador */}
            <ModalSeleccionColaborador
                abierto={indiceSelectorActivo !== null}
                opciones={opciones}
                excluirIds={idsExcluidosParaSelector}
                onSeleccionar={seleccionarEnIndiceActivo}
                onCerrar={cerrarSelector}
            />

        </div>
    );
}