import {AuthOption} from './AuthOptionInterfaces';
import {ComponentMap} from './FlowRouterInterfaces';

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
}

interface CredentialKeyDefinition {
    name: string;
    rendered?: boolean;
    dataType: string;
    wide?: boolean;
    alternateKey?: string;
    alternateName?: string;
}

interface CredentialKeyMap {
    [index: string]: CredentialKeyDefinition;
}
