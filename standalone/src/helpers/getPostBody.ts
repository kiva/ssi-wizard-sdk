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
    console.log('Aloha');
    console.log(filterData);

    if (
        !filterData ||
        !filterData.hasOwnProperty('type') ||
        !filterData.hasOwnProperty('value')
    ) {
        throw new Error(
            'The filter data is incomplete: ' + JSON.stringify(filterData)
        );
    }

    body.filters = {
        [filterData.type]: filterData.value
    };
}
