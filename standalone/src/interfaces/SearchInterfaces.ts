import ICommonProps from './ICommonProps';

export interface SearchInputData {
    // TODO: Don't allow additional keys
    [index: string]: string;
    type: string;
    value: string;
}

// TODO: Make this make sense
export interface AltSearchInputData {
    [index: string]: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    mothersFirstName?: string | undefined;
    fathersFirstName?: string | undefined;
    birthDate?: string | undefined;
}

interface AltSearchErrors {
    firstName: boolean;
    lastName: boolean;
    mothersFirstName: boolean;
    fathersFirstName: boolean;
    birthDate: boolean;
}

export interface AltSearchProps extends ICommonProps {
    search: AltSearchInputData;
    toggleSearchType(): void;
}

export interface AltSearchState {
    search: AltSearchInputData;
    errors: AltSearchErrors;
    rows: Array<string | boolean>;
}

export interface SearchProps extends Filters, ICommonProps {
    setFiltersValue(data: SearchInputData): void;
}

export interface Filters {
    filters: SearchInputData;
}

export interface SearchState extends Filters {
    error: boolean;
    errorReason: string;
    altSearch: boolean;
}
