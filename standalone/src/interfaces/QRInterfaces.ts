import {ProofRequestProfile} from './ConfirmationInterfaces';
import ICommonProps from './ICommonProps';
import {TFunction} from 'i18next';

export interface QRProps extends ICommonProps {
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
    t: TFunction;
}
