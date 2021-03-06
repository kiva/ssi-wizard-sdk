import { ICommonProps } from "@kiva/ssirius-react";

export interface DetailsProps extends ICommonProps {
    personalInfo: any;
    actionButtonCaption: string;
    exportAction(): void;
}

export interface PhotoAttach {
    data: string;
    type: string;
    encoding: string;
}
