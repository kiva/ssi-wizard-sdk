import axios from 'axios';
import { v4 as uuid4 } from 'uuid';
import ErrorHandler from '../abstracts/ErrorHandler';
// import GuardianSDKClass from '../abstracts/GuardianSDKClass';
import { determineErrorString } from '../helpers/agentRequest';
import IGuardianSDKConfig from '../interfaces/IGuardianSDKConfig';

const CancelToken = axios.CancelToken;

export default class GuardianSDK {
    public readonly config: any;
    public cancel: any;
    private url: string;
    private token?: string;

    static init(config: IGuardianSDKConfig): GuardianSDK {
        return new GuardianSDK(config);
    }

    constructor(config: IGuardianSDKConfig) {
        this.cancel = null;
        this.url = config.url;
        if (config.token) {
            this.token = config.token;
        }
    }

    async fetchKyc(requestBody: any, token?: string): Promise<any> {
        const ekycUri = this.url;
        const ekycId: string = uuid4();
        const headers: any = {
            'Content-Type': 'application/json',
            'x-request-id': ekycId
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        } else if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response: any = await axios.post(ekycUri, requestBody, {
                headers,
                // TODO: Decide if there should be a unique cancel token that is responsible for cancelling all requests within this utility class
                cancelToken: new CancelToken((cancel: any): void => {
                    this.cancel = cancel;
                })
            });
            response.data['ekycId'] = ekycId;
            return Promise.resolve(response.data);
        } catch (error: any) {
            console.error(error);
            return Promise.reject(catchError(error, this.config.errorHandler));
        } finally {
            this.cancel = null;
        }
    }
}

function catchError(error: any, handler?: ErrorHandler) {
    let msg: string;
    if (handler) {
        msg = handler.explainError(error);
    } else {
        msg = determineErrorString(error);
    }
    return msg;
}
