import ICommonProps from '../../../interfaces/ICommonProps';
import { ComponentStoreMethods, FlowAction } from '../../../interfaces/FlowRouterInterfaces';
import { CountryCodeConfig } from '../../SMSOTPScreen/interfaces/SMSOTPInterfaces';
import { CredentialKeyMap } from '../../../interfaces/IConstants';
import { TFunction } from 'i18next';

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
    t: TFunction;
}
