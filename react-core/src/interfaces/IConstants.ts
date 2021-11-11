import { AuthOption } from './AuthOptionInterfaces';
import { ComponentMap } from './FlowRouterInterfaces';

export interface IConstants {
    verification_options: AuthOption[];
    permittedOrigins?: string;
    permittedOriginPatterns?: string;
    credentialKeyMap: CredentialKeyMap;
    direction: string;
    permittedOpenerOrigins?: string[];
    proof_profile_url?: string;
    auth_token?: string;
    component_map: ComponentMap;
    slowInternetThreshold?: number;
    defaultLang: string;
    standaloneConf?: StandaloneConfig;
    credentialDefinition?: string;
}

export interface CredentialKeyMap {
    [index: string]: {
        name: string;
        rendered?: boolean;
        dataType: string;
        wide?: boolean;
        alternateKey?: string;
        alternateName?: string;
        options?: string[];
    };
}

interface StandaloneConfig {
    isStandalone: boolean;
    org?: string;
    footerText?: string;
    alt?: string;
}
