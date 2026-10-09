import { useRef, useState } from "react";
import { FileSpreadsheet, X, CheckCircle2, AlertTriangle } from "lucide-react";
import { useParticipantes } from "../../store/participantesStore";
import { apiFetch } from "../../lib/api";

interface ResumenCarga {
    tipo: "exito" | "error";
    mensaje: string;
    detalle?: string[];
}

interface RespuestaImportacion {
    agregados: number;
    omitidosPorDuplicado: string[];
}

export function CargaParticipantesExcel() {
    const { recargar } = useParticipantes();
    const inputRef = useRef<HTMLInputElement>(null);
    const [cargando, setCargando] = useState(false);
    const [resumen, setResumen] = useState<ResumenCarga | null>(null);

    function abrirSelectorArchivo() {
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
            const resultado = await apiFetch<RespuestaImportacion>("/api/participantes/importar-excel", {
                method: "POST",
                body: formData,
            });
            await recargar();
            setResumen({
                tipo: "exito",
                mensaje: `Se agregaron ${resultado.agregados} participante${resultado.agregados === 1 ? "" : "s"}.`,
                detalle:
                    resultado.omitidosPorDuplicado.length > 0
                        ? [`${resultado.omitidosPorDuplicado.length} fila(s) omitidas por ID ya existente: ${resultado.omitidosPorDuplicado.join(", ")}`]
                        : undefined,
            });
        } catch (error) {
            setResumen({ tipo: "error", mensaje: error instanceof Error ? error.message : "No se pudo leer el archivo." });
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
                onClick={abrirSelectorArchivo}
                disabled={cargando}
                className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold px-4 py-2.5 rounded-xl active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
                <FileSpreadsheet className="w-4 h-4 text-[#ee7624]" />
                {cargando ? "Cargando..." : "Cargar desde Excel"}
            </button>

            {resumen && (
                <div
                    className={`absolute right-0 z-20 mt-2 w-80 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl text-xs ${
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