import { AgentUIProps, IIssuer } from "@kiva/ssirius-react";

export interface CredentialIssuanceProps extends AgentUIProps {
    dependencies: DependencyConfig;
    agent: Agent;
}

interface Agent extends IIssuer {
    setProofProfile(profile: string): void;
}

interface DependencyConfig {
    [index: string]: string[];
}
