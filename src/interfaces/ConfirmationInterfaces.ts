import ICommonProps from './ICommonProps';

export interface ConfirmationProps extends ICommonProps {
    agreement: string,
    reviewText: string,
    info_includes: string,
    buttonText: string
}

interface CredentialKeyDefinition {
    name: string,
    rendered?: boolean,
    dataType: string,
    wide?: boolean,
    alternateKey?: string,
    alternateName?: string
}

export interface CredentialKeyMap {
    [index: string]: CredentialKeyDefinition
}

export interface CredentialKeyFieldsProps {
    fields: CredentialKeyMap
}

export interface CredentialKeyFieldState {
    columnOne: string[],
    columnTwo: string[]
}
