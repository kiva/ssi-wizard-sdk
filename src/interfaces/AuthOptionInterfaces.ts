import ICommonProps from './ICommonProps';

export interface AuthOption {
    id: string,
    title: string,
    description: string,
    sequence: string[]
}

export interface MenuOptionProps {
    key: string,
    id: string,
    title: string,
    description: string,
    selected: boolean,
    setAuthType(option: number): void,
    recommended: boolean,
    option_index: number
}

export interface AuthOptionProps extends ICommonProps {
    instructions: string,
    selectButtonText: string
}

export interface AuthOptionState {
    optionSelected: number
}