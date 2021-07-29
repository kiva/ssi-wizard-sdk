import {RejectionReport} from './RejectionProps';
import {EkycPostBody} from './EkycPostBodyInterface';

export interface FingerprintEkycBody extends EkycPostBody {
    image: string;
    device: any;
    position: number;
}
