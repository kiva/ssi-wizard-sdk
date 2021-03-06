import { ICommonProps } from "@kiva/ssirius-react";

export interface AuthOption {
    id: string;
    title: string;
    description: string;
    sequence: string[];
    type: string;
}

export interface MenuOptionProps {
    key: string;
    id: string;
    title: string;
    description: string;
    selected: boolean;
    setAuthType(option: number): void;
    recommended: boolean;
    option_index: number;
    type: string;
}

export interface AuthOptionProps extends ICommonProps { }
