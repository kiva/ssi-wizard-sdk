export interface IVerifier extends IBaseAgent {
    isVerified(response: any): boolean;
    fetchProofOptions?: () => Promise<any>;
    setProofProfile?: (proofProfile: string) => void;
    verify(connectionId: string, profile: any): Promise<any>;
    checkVerification(verificationId: string): Promise<any>;
    getProof(data: any): any;
    isRejected(response: any): boolean;
}

export interface IIssuer extends IBaseAgent {
    isOffered(response: any): boolean;
    isIssued(response: any): boolean;
    createCredential(data: any): Promise<any>;
    checkCredentialStatus(credentialId: string): Promise<any>;
}

interface IBaseAgent {
    isConnected(connectionData: any): boolean;
    connect(connectionId: string): Promise<any>;
    getConnection(connectionId: string): Promise<any>;
}
