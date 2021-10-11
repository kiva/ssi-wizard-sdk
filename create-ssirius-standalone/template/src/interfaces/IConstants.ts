import { AuthOption } from '../preBuilt/AuthenticationOptionMenu/interfaces/AuthOptionInterfaces';
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

interface CredentialKeyDefinition {
    name: string;
    rendered?: boolean;
    dataType: string;
    wide?: boolean;
    alternateKey?: string;
    alternateName?: string;
    options?: string[];
}

export interface CredentialKeyMap {
    [index: string]: CredentialKeyDefinition;
}

interface StandaloneConfig {
    isStandalone: boolean;
    org?: string;
    footerText?: string;
    alt?: string;
}
