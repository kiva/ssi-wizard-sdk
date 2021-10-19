import axios from 'axios';
import { v4 as uuid4 } from 'uuid';

const CancelToken = axios.CancelToken;

export default class GuardianSDK {
    public readonly config: any;
    public cancel: any;
    private auth_method: any;
    private url: string;
    private token?: string;

    static init(config: GuardianSDKConfig): GuardianSDK {
        return new GuardianSDK(config);
    }

    constructor(config: GuardianSDKConfig) {
        this.cancel = null;
        this.auth_method = config.auth_method;
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
            console.log(error);
            const errorDetails = ` (${error.response.data.code}: ${error.response.data.message})`;
            const msg: string = error.message + errorDetails;
            console.error(error);
            return Promise.reject(msg);
        } finally {
            this.cancel = null;
        }
    }
}

interface GuardianSDKConfig {
    url: string;
    auth_method: string;
    token?: string;
}
