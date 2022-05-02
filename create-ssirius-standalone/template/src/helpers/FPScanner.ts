import IFPScanner from "../interfaces/IFPScanner";
import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import actions from "../actions";
import config from "../config";

export default class FPScanner implements IFPScanner {
    private host: string;
    private deviceInfo?: ScrubbedData;
    private persistentError: boolean;
    private scanInProgress: boolean;
    private startScan = (url: string, method: Method, callback: (response: AxiosResponse) => any, data?: any): Promise<any> => {
        const param: AxiosRequestConfig = {url, method};
        if (data) param.data = data;

        this.scanInProgress = true;
        return axios(param)
            .then(callback)
            .catch(e => {
                this.persistentError = 'FR_NOT_CAPTURED' !== e.message;
                const errorCode = this.createErrorMessage(e.message);

                throw new Error(errorCode);
            })
            .finally(() => {
                this.scanInProgress = false;
            });
    };
    private createErrorMessage = (errorCode: any): string => {
        let errorMessage = 'An unknown error has occurred.';

        if (this.errorMessages.hasOwnProperty(errorCode)) {
            errorMessage = this.errorMessages[errorCode];
        } else if ('string' !== typeof errorCode) {
            errorMessage = errorCode.message;
        }

        return errorMessage;
    };
    private scrubSensitiveInfo = (data: any): ScrubbedData => {
        delete data.ImageBase64;
        delete data.Token;

        return data;
    }

    protected errorMessages: any = {
        'Network Error': 'You are not logged into the Desktop tool. Please make sure you are logged in.',
        USER_NOT_LOGGED_IN: 'You are not logged into the Desktop tool. Please make sure you are logged in.',
        FR_NOT_FOUND: 'Fingerprint reader is not detected. Please make sure the fingerprint reader is plugged in or unplug the device and then plug it back in.',
        FR_NOT_CAPTURED: 'Fingerprint reader is not detected. Please make sure the fingerprint reader is plugged in or unplug the device and then plug it back in.'
    };

    constructor(host: string) {
        this.host = host;
        this.persistentError = false;
        this.scanInProgress = false;
    }

    static init(host: string) {
        return new FPScanner(host);
    }

    isErrorPersistent(): boolean {
        return this.persistentError;
    }

    isScanInProgress(): boolean {
        return this.scanInProgress;
    }

    getFingerprint = async (...args: any[]): Promise<string> => {
        const reqUrl = `${this.host}/EKYC/Fingerprint`;

        return this.startScan(reqUrl, 'GET', (response) => {
            if (
                response.data.hasOwnProperty('success') &&
                !response.data.success
            ) {
                const e = response.data.error || 'UNKNOWN_ERROR';

                throw new Error(e);
            } else {
                const {ImageBase64} = response.data;
                if (response.data.Token) {
                    actions.updateToken(config, response.data.Token);
                }
                const deviceInfo: ScrubbedData = this.scrubSensitiveInfo(response.data);

                this.deviceInfo = deviceInfo;
                return ImageBase64.replace(
                    'data:image/png;base64,',
                    ''
                );
            }
        });
    }

    getDeviceInfo = async (): Promise<ScrubbedData> => {
        const reqUrl = `${this.host}/EKYC/Info`;

        return this.startScan(reqUrl, 'GET', (response) => {
            if (
                response.data.hasOwnProperty('success') &&
                !response.data.success
            ) {
                const e = response.data.error || 'UNKNOWN_ERROR';

                throw new Error(e);
            } else {
                const deviceInfo: ScrubbedData = this.scrubSensitiveInfo(response.data);

                this.deviceInfo = deviceInfo;
                return deviceInfo;
            }
        });
    }
}

interface ScrubbedData {
    [index: string]: any;
    ImageBase64: never;
    Token: never;
}