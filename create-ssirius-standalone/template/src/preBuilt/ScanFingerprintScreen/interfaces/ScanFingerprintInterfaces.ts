import { SearchInputData } from '../../SearchMenu/interfaces/SearchInterfaces';
import { AltSearchInputData } from '../../AlternateSearch/interfaces/AltSearchInterfaces';
import { ComponentStoreGet, GuardianUIProps } from '@kiva/ssirius-react';
import IFPScanner from '../../../interfaces/IFPScanner';

export interface FingerprintEkycBody {
    profile: string;
    guardianData: GuardianData;
    device: any;
}

export interface GuardianData extends EkycPostBody {
    pluginType: string;
    params: {
        image: string;
        position: number;
    }
}

export interface FPScanProps extends GuardianUIProps {
    scanner: IFPScanner,
    getPostBody(image: string, position: number, device: any, get: ComponentStoreGet): any;
}

export interface EkycPostBody {
    search?: AltSearchInputData;
    filters?: {
        externalIds: SearchInputData
    };
}
