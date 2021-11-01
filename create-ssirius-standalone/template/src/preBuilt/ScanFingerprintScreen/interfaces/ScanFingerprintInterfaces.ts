import { EkycPostBody } from '../../../interfaces/EkycPostBodyInterface';
import { GuardianUIProps } from '@kiva/ssirius-react';

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

export interface FPScanProps extends GuardianUIProps {
    backendURL: string;
}
