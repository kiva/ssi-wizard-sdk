import { SearchInputData } from '../preBuilt/SearchMenu/interfaces/SearchInterfaces';
import { AltSearchInputData } from '../preBuilt/AlternateSearch/interfaces/AltSearchInterfaces';

export interface EkycPostBody {
    search?: AltSearchInputData;
    filters?: {
        externalIds: SearchInputData
    };
}
