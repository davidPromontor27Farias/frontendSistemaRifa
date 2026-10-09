import type { ReactNode } from 'react';
import { AuthProvider } from './authStore';
import { ParticipantesProvider } from './participantesStore';
import { MatrizVentasProvider } from './matrizVentasStore';
import { VotacionProvider } from './votacionStore';
import { TombolaProvider } from './tombolaStore';

export function RifaMockProviders({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <ParticipantesProvider>
                <MatrizVentasProvider>
                    <VotacionProvider>
                        <TombolaProvider>{children}</TombolaProvider>
                    </VotacionProvider>
                </MatrizVentasProvider>
            </ParticipantesProvider>
        </AuthProvider>
    );
}
