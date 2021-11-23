import { ICommonProps } from "@kiva/ssirius-react";

export interface FingerSelectProps extends ICommonProps {
    isReadOnly?: boolean;
    changeFingerSelection?: (index: string) => void;
}

export interface FingerSelectState {
    selectedFinger: string;
}

export interface FingerTypeTranslation {
    [index: string]: number;
    right_thumb: number;
    right_index: number;
    right_middle: number;
    right_ring: number;
    right_little: number;
    left_thumb: number;
    left_index: number;
    left_middle: number;
    left_ring: number;
    left_little: number;
}

export interface FingerTypesMap {
    [index: string]: string;
    right_thumb: string;
    right_index: string;
    right_middle: string;
    right_ring: string;
    right_little: string;
    left_thumb: string;
    left_index: string;
    left_middle: string;
    left_ring: string;
    left_little: string;
}

export interface FingerDefinition {
    name: string;
    code: string;
}

export interface FingerList {
    1: FingerDefinition;
    2: FingerDefinition;
    3: FingerDefinition;
    4: FingerDefinition;
    5: FingerDefinition;
    6: FingerDefinition;
    7: FingerDefinition;
    8: FingerDefinition;
    9: FingerDefinition;
    10: FingerDefinition;
}
