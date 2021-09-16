type TBaseAgentFunction = (
    request: Promise<any>,
    callback: (data: any) => any,
    error?: string
) => Promise<any>;

export interface IBaseAgent {
    profiles: TBaseAgentFunction;
    establish: TBaseAgentFunction;
    check: TBaseAgentFunction;
    send: TBaseAgentFunction;
    prove: TBaseAgentFunction;
}

export interface IAgent {
    fetchProofOptions(): Promise<any>;
    checkVerification(verificationId: string): Promise<any>;
    sendVerification(connectionId: string, profile: object): Promise<string>;
    establishConnection(connectionId: string): Promise<any>;
    getConnection(connectionId: string): Promise<any>;
    isConnected(response: any): boolean;
    isVerified(response: any): boolean;
    isOffered(response: any): boolean;
    isIssued(response: any): boolean;
    getProof(response: any): any;
    formatProof(response: any): any;
    isRejected?: (response: any): boolean;
    setProofProfile?: (credentialDefinition: string): void;
    createCredential(entityData: any): Promise<any>;
    checkCredentialStatus(credentialId: string): Promise<any>;
}
