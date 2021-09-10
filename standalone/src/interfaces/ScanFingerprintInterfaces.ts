import {RejectionReport} from './RejectionProps';
import {EkycPostBody} from './EkycPostBodyInterface';

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
