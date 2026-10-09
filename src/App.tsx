import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { RifaMockProviders } from "./store/RifaMockProviders";
import { RutaProtegida } from "./components/auth/RutaProtegida";
import { LoginPage } from "./pages/LoginPage";
import { RifaComercialPage } from "./pages/RifaComercialPage";
import { MisBoletosPage } from "./pages/MisBoletosPage";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminVotacionMensualPage } from "./pages/admin/AdminVotacionMensualPage";
import { AdminCierreMesPage } from "./pages/admin/AdminCierreMesPage";
import { AdminAcumuladosPage } from "./pages/admin/AdminAcumuladosPage";
import { AdminTombolaPage } from "./pages/admin/AdminTombolaPage";
import { RhLayout } from "./pages/rh/RhLayout";
import { RhParticipantesPage } from "./pages/rh/RhParticipantesPage";
import { AdminAprobacionesPage } from "./components/admin/AdminAprobacionesPage";

export default function App() {
    return (
        <RifaMockProviders>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    <Route
                        path="/"
                        element={
                            <RutaProtegida rolesPermitidos={["votante"]}>
                                <RifaComercialPage />
                            </RutaProtegida>
                        }
                    />
                    <Route
                        path="/mis-boletos"
                        element={
                            <RutaProtegida rolesPermitidos={["votante"]}>
                                <MisBoletosPage />
                            </RutaProtegida>
                        }
                    />

                    <Route
                        path="/admin"
                        element={
                            <RutaProtegida rolesPermitidos={["admin_comercial", "direccion_general"]}>
                                <AdminLayout />
                            </RutaProtegida>
                        }
                    >
                        <Route index element={<Navigate to="votacion" replace />} />
                        <Route path="votacion" element={<AdminVotacionMensualPage />} />
                        <Route path="cierre-mes" element={<AdminCierreMesPage />} />
                        <Route path="acumulados" element={<AdminAcumuladosPage />} />
                        <Route path="tombola" element={<AdminTombolaPage />} />
                        <Route path="aprobaciones" element={<AdminAprobacionesPage/>} />
                    </Route>

                    <Route
                        path="/rh"
                        element={
                            <RutaProtegida rolesPermitidos={["rh"]}>
                                <RhLayout />
                            </RutaProtegida>
                        }
                    >
                        <Route index element={<RhParticipantesPage />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </RifaMockProviders>
    )
}