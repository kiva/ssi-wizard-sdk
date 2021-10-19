import ICommonProps from '../../../interfaces/ICommonProps';
import { TFunction } from 'i18next';

export interface ConfirmationProps extends ICommonProps { }

interface CredentialKeyDefinition {
    name: string;
    rendered?: boolean;
    dataType: string;
    wide?: boolean;
    alternateKey?: string;
    alternateName?: string;
}

export interface CredentialKeyMap {
    [index: string]: CredentialKeyDefinition;
}

export interface CredentialKeyFieldsProps {
    fields: CredentialKeyMap;
    t: TFunction;
}

export interface CredentialKeyFieldState {
    columnOne: string[];
    columnTwo: string[];
}

export interface ProofRequestProfile {
    schema_id: string;
    comment: string;
    proof_request: ProofRequestDefinition;
}

export interface ProofRequestDefinition {
    name: string;
    version: string;
    requested_attributes: RequestedAttributes;
    requested_predicates: PredicateDefinition;
}

export interface RequestedAttributes {
    [index: string]: AttributeDefinition;
}

interface AttributeDefinition {
    name: string;
    restrictions: any[];
}

interface PredicateDefinition {
    [index: string]: PredicateInfo;
}

interface PredicateInfo {
    name: string;
    p_type: string;
    p_value: any;
    restrictions: any[];
}

export interface ProofProfileProps extends ConfirmationProps {
    setCredentialKeys: Function;
}
