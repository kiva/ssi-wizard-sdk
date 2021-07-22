import {AuthOption} from './AuthOptionInterfaces';
import {ComponentMap} from './FlowRouterInterfaces';

export interface IConstants {
    verification_options: AuthOption[];
    permittedOrigins?: string;
    permittedOriginPatterns?: string;
    direction: string;
    permittedOpenerOrigins?: string[];
    proof_profile_url?: string;
    auth_token?: string;
    component_map: ComponentMap;
}
