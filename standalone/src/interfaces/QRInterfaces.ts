import {ProofRequestProfile} from './ConfirmationInterfaces';
import ICommonProps from './ICommonProps';

export interface QRProps extends ICommonProps {
    setConnectionId(id: string): Promise<void>;
    verifyConnection(established: boolean): Promise<void>;
    connectionId: string;
    connected: boolean;
    agentType: string;
    profile: ProofRequestProfile;
    no_connection_error: string;
    no_invite: string;
    click_verify: string;
    retrieving_notice: string;
    scan_qr: string;
    connection_established: string;
    instructions: string;
    reset: string;
    back_text: string;
    next_text: string;
    rejected: string;
    verifying: string;
}

export interface QRState {
    inviteUrl: string | undefined;
    connectionError: string;
    retrievingInviteUrl: boolean;
    verifying: boolean;
    isConnectionReady: boolean;
    agent_connected: boolean;
    connectionId: string;
}

export interface QRButtonProps {
    onSubmit(): void;
    onClickBack(): void;
    onReset(): void;
    isConnectionReady: boolean;
    isVerifying: boolean;
    reset: string;
    back_text: string;
    next_text: string;
}
