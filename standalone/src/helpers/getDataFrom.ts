import {ProofRequestProfile, CredentialKeyMap, RequestedAttributes} from '../interfaces/ConfirmationInterfaces';

export default function getDataFrom(info: ProofRequestProfile) {
    const attributes: RequestedAttributes =
        info.proof_request.requested_attributes;
    const ret: CredentialKeyMap = {};
    for (const key in attributes) {
        ret[key] = {
            name: attributes[key].name,
            dataType: getDataType(key)
        };
        if (key.indexOf('photo') === -1) {
            ret[key].rendered = true;
        }
    }

    return ret;
}

function getDataType(key: string) {
    const lowercaseKey = key.toLowerCase();

    if (lowercaseKey.indexOf('phone') > -1) return 'phoneNumber';
    if (lowercaseKey.indexOf('date') > -1) return 'date';

    return 'text';
}