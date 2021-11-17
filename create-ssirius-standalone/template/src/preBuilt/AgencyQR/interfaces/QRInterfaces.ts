import { ProofRequestProfile } from '../../ConfirmationScreen/interfaces/ConfirmationInterfaces';
import { AgentUIProps } from '@kiva/ssirius-react';

export interface QRProps extends AgentUIProps {
    setConnectionId(id: string): Promise<void>;
    verifyConnection(established: boolean): Promise<void>;
    connectionId: string;
    connected: boolean;
    agentType: string;
    profile: ProofRequestProfile;
}

export interface QRButtonProps {
    onSubmit(): void;
    onClickBack(): void;
    onReset(): void;
    isConnectionReady: boolean;
    isVerifying: boolean;
}
