import {ProofRequestProfile} from './VerificationInterfaces';
import {ComponentStoreMethods, FlowAction} from './FlowRouterInterfaces';
import ICommonProps from './ICommonProps';

export interface SMSProps extends ICommonProps {
    phoneNumber: string;
    setSmsInfo(data: SMSData): void;
    phoneScreen: string;
    email: string;
    smsSent: boolean;
    profile: ProofRequestProfile;
    invalid_number: string;
    invalid_otp: string;
    phoneIntls: CountryCodeConfig;
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
}

export interface PhoneNumberInputProps {
    phoneNumber: string;
    handlePhoneNumberChange: (input: string) => void;
    handleEnter: (keyCode: number) => void;
    phoneIntls: CountryCodeConfig;
}

export interface OTPScreenProps {
    phoneNumber: string;
    email: string;
    smsSent: boolean;
    setContainerState(data: SMSData): void;
    profile: ProofRequestProfile;
    store: ComponentStoreMethods;
    invalid_otp: string;
    auth_token?: string;
    phoneIntls: CountryCodeConfig;
    specificError?: string;
    dispatch: (action: FlowAction) => void;
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
}

export interface PhoneScreenProps {
    phoneNumber: string;
    setContainerState(data: SMSData): void;
    email: string;
    smsSent: boolean;
    profile: ProofRequestProfile;
    store: ComponentStoreMethods;
    invalid_number: string;
    auth_token?: string;
    phoneIntls: CountryCodeConfig;
    dispatch: (action: FlowAction) => void;
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
