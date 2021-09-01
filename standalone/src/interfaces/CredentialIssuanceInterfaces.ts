import ICommonProps from './ICommonProps';

export interface CredentialIssuanceProps extends ICommonProps {
    dependencies: DependencyConfig;
}

interface DependencyConfig {
    [index: string]: string[];
}
