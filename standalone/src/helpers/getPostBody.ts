import {FingerprintEkycBody} from '../interfaces/ScanFingerprintInterfaces';
import {ComponentStoreGet} from '../interfaces/FlowRouterInterfaces';

export default function setPostBody(
    image: string,
    position: number,
    device: any,
    get: ComponentStoreGet
): FingerprintEkycBody {
    const body: FingerprintEkycBody = {image, position, device};
    addCredentialsToBody(body, get);
    console.log(body);

    return body;
}

function addCredentialsToBody(
    body: FingerprintEkycBody,
    get: ComponentStoreGet
) {
    const searchType: string = get('searchType', '', 'searchMenu');
    if ('filters' === searchType) {
        insertFilters(body, get);
    } else if ('search' === searchType) {
        body['search'] = get('search', {}, 'searchMenu');
    }
}

function insertFilters(body: FingerprintEkycBody, get: ComponentStoreGet) {
    const filterData: any = get('filters', {}, 'searchMenu');

    if (
        !Object.keys(filterData).length
    ) {
        throw new Error(
            'The filter data is incomplete: ' + JSON.stringify(filterData)
        );
    }

    body.filters = {
        externalIds: {}
    };

    for (const k in filterData) {
        body.filters.externalIds[k] = filterData[k];
    }
}
