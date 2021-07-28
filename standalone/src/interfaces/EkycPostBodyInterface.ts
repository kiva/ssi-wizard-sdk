import {SearchInputData, AltSearchInputData} from './SearchInterfaces';

export interface EkycPostBody {
    search?: AltSearchInputData;
    filters?: SearchInputData | FilteredSearchInputData;
}

interface FilteredSearchInputData {
    [index: string]: string;
}
