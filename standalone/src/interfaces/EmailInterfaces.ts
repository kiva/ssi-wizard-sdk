import ICommonProps from './ICommonProps';

export interface EmailProps extends ICommonProps {
    no_input: string;
    instructions: string;
    back_text: string;
    continue: string;
}

export interface EmailState {
    email: string;
}
