import {RejectionReport} from './RejectionProps';
import {EkycPostBody} from './EkycPostBodyInterface';
import ICommonProps from './ICommonProps';

export interface FingerprintEkycBody {
    profile: string;
    guardianData: GuardianData;
}

export interface GuardianData extends EkycPostBody {
    pluginType: string;
    params: {
        image: string;
        position: number;
    }
}

export interface FPScanProps extends ICommonProps {
    backendURL: string;
}
