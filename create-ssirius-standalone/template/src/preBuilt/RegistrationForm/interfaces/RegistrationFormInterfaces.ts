import { ICommonProps, CredentialKeyMap, FlowAction, ComponentStoreMethods } from '@kiva/ssirius-react';
import { CountryCodeConfig } from '../../SMSOTPScreen/interfaces/SMSOTPInterfaces';

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
