import ICommonProps from './ICommonProps';

export interface CredentialIssuanceProps extends ICommonProps {
    dependencies: DependencyConfig;
    no_invite: string;
    noConnectionWarning: string;
    connectionEstablishedNotice: string;
    scanCodeInstructions: string;
    retrievingQRNotice: string;
    backText: string;
}

interface DependencyConfig {
    [index: string]: string[];
}
