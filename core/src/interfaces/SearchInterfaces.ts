import ICommonProps from './ICommonProps';

export interface SearchInputData {
    type: string;
    value: string;
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

interface AltSearchTextProps {
    missingNamesError: string;
    dateInputError: string;
    missingFuzzyDataError: string;
    inputLengthError: string;
    primaryInstructions: string;
    firstRowInstructions: string;
    labelOne: string;
    labelTwo: string;
    labelThree: string;
    labelFour: string;
    labelFive: string;
    nextText: string;
    backText: string;
    firstRowHeader: string;
    secondRowHeader: string;
    secondRowSubheader: string;
}

export interface AltSearchProps extends ICommonProps, AltSearchTextProps {
    toggleSearchType(): void;
}

export interface SearchProps extends ICommonProps, AltSearchTextProps {
    dropdownConfig: DropdownConfig;
    instructions: string;
    placeholder: string;
    alternateSearchInstructions: string;
}

interface DropdownConfig {
    [index: string]: DropdownConfigDefinition;
}

export interface DropdownConfigDefinition {
    validation(input: string): boolean;
    name: string;
    errorMsg: string;
}
