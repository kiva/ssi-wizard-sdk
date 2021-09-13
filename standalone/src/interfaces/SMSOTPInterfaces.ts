import {ProofRequestProfile} from './ConfirmationInterfaces';
import {ComponentStoreMethods, FlowAction} from './FlowRouterInterfaces';
import ICommonProps from './ICommonProps';
import {TFunction} from 'i18next';

export interface SMSProps extends ICommonProps {
    phoneNumber: string;
    setSmsInfo(data: SMSData): void;
    phoneScreen: string;
    email: string;
    smsSent: boolean;
    profile: ProofRequestProfile;
    phoneIntls: CountryCodeConfig;
    backendURL: string;
}

export interface CountryCodeConfig {
    only: boolean;
    countries: string[];
}

export interface OTPState {
    [index: string]: any;
    phoneNumber: string;
    smsSent: boolean;
    phoneScreen: string;
}

export interface SMSData {
    [index: string]: any;
    smsSent: boolean;
    phoneNumber: string;
    phoneScreen: string;
}

export interface PhoneState {
    phoneNumber: string;
    error: string;
    requestInProgress: boolean;
}

export interface SMSButtonProps {
    onSubmit(): void;
    onClickBack(): void;
    t: TFunction;
}

export interface PhoneNumberInputProps {
    phoneNumber: string;
    handlePhoneNumberChange: (input: string) => void;
    handleEnter: (keyCode: number) => void;
    phoneIntls: CountryCodeConfig;
    t: TFunction;
}

export interface OTPScreenProps {
    phoneNumber: string;
    email: string;
    smsSent: boolean;
    setContainerState(data: SMSData): void;
    profile: ProofRequestProfile;
    store: ComponentStoreMethods;
    auth_token?: string;
    phoneIntls: CountryCodeConfig;
    specificError?: string;
    dispatch: (action: FlowAction) => void;
    t: TFunction;
    SDK: any;
}

export interface OTPInputProps {
    handleOTPEntry: (index: number, value: string) => void;
}

export interface OTPInputState {
    otp: string[];
    smsError: string;
    requestInProgress: boolean;
    idVerified: boolean;
}

export interface SMSStatusProps {
    status: string;
    errorText?: string;
    t: TFunction;
}

export interface PhoneScreenProps {
    phoneNumber: string;
    setContainerState(data: SMSData): void;
    email: string;
    smsSent: boolean;
    profile: ProofRequestProfile;
    store: ComponentStoreMethods;
    auth_token?: string;
    phoneIntls: CountryCodeConfig;
    dispatch: (action: FlowAction) => void;
    t: TFunction;
    SDK: any;
}

export interface SMSPostBody {
    profile: string;
    guardianData: GuardianData;
    device: any;
}

interface GuardianData {
    pluginType: string;
    filters: object;
    params: PhoneParams | OTPParams;
}

interface PhoneParams {
    phoneNumber: string;
}

interface OTPParams {
    otp: number;
}
