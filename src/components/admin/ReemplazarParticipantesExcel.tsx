import { useRef, useState } from "react";
import { Trash2, X, CheckCircle2, AlertTriangle } from "lucide-react";
import { useParticipantes } from "../../store/participantesStore";
import { apiFetch } from "../../lib/api";

interface ResumenReemplazo {
    tipo: "exito" | "error";
    mensaje: string;
    detalle?: string[];
}

interface RespuestaReemplazo {
    creados: number;
    actualizados: number;
    eliminados: number;
    inactivadosPorHistorial: string[];
}

export function ReemplazarParticipantesExcel() {
    const { recargar } = useParticipantes();
    const inputRef = useRef<HTMLInputElement>(null);
    const [confirmando, setConfirmando] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [resumen, setResumen] = useState<ResumenReemplazo | null>(null);

    function pedirConfirmacion() {
        setResumen(null);
        setConfirmando(true);
    }

    function confirmarYAbrirSelector() {
        setConfirmando(false);
        inputRef.current?.click();
    }

    async function manejarArchivoSeleccionado(evento: React.ChangeEvent<HTMLInputElement>) {
        const archivo = evento.target.files?.[0];
        evento.target.value = "";
        if (!archivo) return;

        setCargando(true);
        setResumen(null);
        try {
            const formData = new FormData();
            formData.append("archivo", archivo);
            const resultado = await apiFetch<RespuestaReemplazo>("/api/participantes/reemplazar-excel", {
                method: "POST",
                body: formData,
            });
            await recargar();
            setResumen({
                tipo: "exito",
                mensaje: `Reemplazo completo: ${resultado.creados} nuevos, ${resultado.actualizados} actualizados, ${resultado.eliminados} eliminados.`,
                detalle:
                    resultado.inactivadosPorHistorial.length > 0
                        ? [`${resultado.inactivadosPorHistorial.length} persona(s) no se pudieron eliminar por tener historial y se marcaron Inactivo: ${resultado.inactivadosPorHistorial.join(", ")}`]
                        : undefined,
            });
        } catch (error) {
            setResumen({ tipo: "error", mensaje: error instanceof Error ? error.message : "No se pudo reemplazar el listado." });
        } finally {
            setCargando(false);
        }
    }

    return (
        <div className="relative">
            <input
                ref={inputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={manejarArchivoSeleccionado}
                className="hidden"
            />
            <button
                type="button"
                onClick={pedirConfirmacion}
                disabled={cargando}
                className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 hover:text-rose-100 text-sm font-semibold px-4 py-2.5 rounded-xl active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
                <Trash2 className="w-4 h-4" />
                {cargando ? "Reemplazando..." : "Reemplazar todo desde Excel"}
            </button>

            {confirmando && (
                <div className="absolute right-0 z-20 mt-2 w-96 rounded-2xl border border-rose-500/40 bg-rose-500/10 backdrop-blur-xl p-4 shadow-2xl text-xs text-rose-100">
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
                        <div className="space-y-2">
                            <p className="font-bold">Esto reemplaza TODO el listado.</p>
                            <p className="opacity-90">
                                Quien no aparezca en el nuevo archivo será eliminado permanentemente (o marcado Inactivo si tiene historial). Esta acción no se puede deshacer.
                            </p>
                            <div className="flex items-center gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={confirmarYAbrirSelector}
                                    className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold transition cursor-pointer"
                                >
                                    Sí, reemplazar todo
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setConfirmando(false)}
                                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition cursor-pointer"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {resumen && (
                <div
                    className={`absolute right-0 z-20 mt-2 w-96 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl text-xs ${
                        resumen.tipo === "exito"
                            ? "bg-[#4A8B2C]/15 border-[#4A8B2C]/40 text-emerald-100"
                            : "bg-rose-500/15 border-rose-500/40 text-rose-100"
                    }`}
                >
                    <div className="flex items-start gap-2">
                        {resumen.tipo === "exito" ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                        ) : (
                            <AlertTriangle className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-1">
                            <p className="font-bold">{resumen.mensaje}</p>
                            {resumen.detalle?.map((linea, i) => (
                                <p key={i} className="text-[11px] opacity-80">
                                    {linea}
                                </p>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => setResumen(null)}
                            className="ml-auto p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}