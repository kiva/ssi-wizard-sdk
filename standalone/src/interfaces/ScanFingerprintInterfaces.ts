import {RejectionReport} from './RejectionProps';
import {EkycPostBody} from './EkycPostBodyInterface';
import ICommonProps from './ICommonProps';

export interface FingerprintEkycBody extends EkycPostBody {
    image: string;
    device: any;
    position: number;
}

export interface FPScanProps extends ICommonProps {
    backendURL: string;
}
