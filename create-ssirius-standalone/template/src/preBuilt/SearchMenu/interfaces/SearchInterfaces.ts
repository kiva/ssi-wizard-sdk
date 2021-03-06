import { ICommonProps } from "@kiva/ssirius-react";

export interface SearchInputData {
    [index: string]: string;
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
    type?: string;
}
