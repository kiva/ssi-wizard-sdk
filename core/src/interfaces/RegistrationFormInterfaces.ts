import ICommonProps from './ICommonProps';
import {ComponentStoreMethods, FlowAction} from './FlowRouterInterfaces';
import {CountryCodeConfig} from './SMSOTPInterfaces';
import {CredentialKeyMap} from './IConstants';

export interface InputProps {
    name: string;
    handleInputChange(inputField: any): void;
    handleStringInput(input: string, key: string, prefix?: string): void;
    inputField: string;
    setCredentialCreationData(data: any): void;
    dataType: string | any;
    dispatch: (action: FlowAction) => void;
    store: ComponentStoreMethods;
    phoneIntls: CountryCodeConfig;
    CredentialKeys: CredentialKeyMap;
}

export interface RegistrationFormProps extends ICommonProps {
    phoneIntls: CountryCodeConfig;
}

export interface ButtonProps {
    onClickBack(): void;
    onSubmit: (event: any) => boolean | undefined;
    onPopulateForm(): void;
}

interface CredentialDependencies {
    [index: string]: string[];
}
