import {SearchInputData, AltSearchInputData} from './SearchInterfaces';

export interface EkycPostBody {
    search?: AltSearchInputData;
    filters?: {
        externalIds: SearchInputData
    };
}
