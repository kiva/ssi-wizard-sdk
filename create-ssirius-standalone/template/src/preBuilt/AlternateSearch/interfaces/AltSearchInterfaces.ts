import ICommonProps from "../../../interfaces/ICommonProps";

export interface AltSearchProps extends ICommonProps {
    toggleSearchType(): void;
}

// TODO: Make this make sense
export interface AltSearchInputData {
    [index: string]: string | undefined;
    firstName?: string;
    lastName?: string;
    mothersFirstName?: string;
    fathersFirstName?: string;
    birthDate?: string;
}

export interface AltSearchErrors {
    firstName: boolean;
    lastName: boolean;
    mothersFirstName: boolean;
    fathersFirstName: boolean;
    birthDate: boolean;
}
