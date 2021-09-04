import ICommonProps from './ICommonProps';

export interface SearchInputData {
    [index: string]: string;
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

export interface AltSearchProps extends ICommonProps {
    toggleSearchType(): void;
}

export interface SearchProps extends ICommonProps {
    dropdownConfig: DropdownConfig;
}

interface DropdownConfig {
    [index: string]: DropdownConfigDefinition;
}

export interface DropdownConfigDefinition {
    validation(input: string): boolean;
    name: string;
    errorMsg: string;
}
