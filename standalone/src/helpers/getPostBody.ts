import {FingerprintEkycBody, GuardianData} from '../interfaces/ScanFingerprintInterfaces';
import {ComponentStoreGet} from '../interfaces/FlowRouterInterfaces';

export default function setPostBody(
    image: string,
    position: number,
    device: any,
    get: ComponentStoreGet
): FingerprintEkycBody {
    const body: FingerprintEkycBody = {
        profile: 'identity.proof.request.json',
        guardianData: createGuardianData(image, position, get)
    };

    return body;
}

function createGuardianData(image: string, position: number, get: ComponentStoreGet): GuardianData {
    const searchType: string = get('searchType', '', 'searchMenu');
    const body: any = {
        pluginType: 'FINGERPRINT',
        params: {image, position}
    };

    if ('filters' === searchType) {
        body['filters'] = getFilters(get)
    } else if ('search' === searchType) {
        body['search'] = get('search', {}, 'searchMenu');
    }

    return body;
}

function getFilters(get: ComponentStoreGet) {
    const filters: any = {
        externalIds: {}
    };
    const filterData: any = get('filters', {}, 'searchMenu');

    if (
        !Object.keys(filterData).length
    ) {
        throw new Error(
            'The filter data is incomplete: ' + JSON.stringify(filterData)
        );
    }

    for (const k in filterData) {
        filters.externalIds[k] = filterData[k];
    }

    return filters;
}
