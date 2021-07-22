import ICommonProps from './ICommonProps';

export interface DetailsProps extends ICommonProps {
    personalInfo: any;
    actionButtonCaption: string;
    exportAction(): void;
    printButtonCaption: string;
    authority_body: string;
    record_type: string;
    no_data: string;
}

export interface PhotoAttach {
    data: string;
    type: string;
    encoding: string;
}
