import axios from 'axios';

import { RejectionReport } from '../interfaces/RejectionProps';

const errorMessages: any = {
    'Network Error':
        'You are not logged into the Desktop tool. Please make sure you are logged in.',
    USER_NOT_LOGGED_IN:
        'You are not logged into the Desktop tool. Please make sure you are logged in.',
    FR_NOT_FOUND:
        'Fingerprint reader is not detected. Please make sure the fingerprint reader is plugged in or unplug the device and then plug it back in.',
    FR_NOT_CAPTURED:
        'Fingerprint reader is not detected. Please make sure the fingerprint reader is plugged in or unplug the device and then plug it back in.',
    DEVICE_IN_USE:
        'A request is already in progress. Please wait for the request to complete.'
};

export default class FingerprintScanner {
    private conf: FingerprintScannerConfig;

    static init(conf: FingerprintScannerConfig): FingerprintScanner {
        return new FingerprintScanner(conf);
    }

    constructor(conf: FingerprintScannerConfig) {
        this.conf = conf;
    }

    get = (endpoint: string, config?: any): Promise<any> => {
        const reqUrl = this.conf.api + endpoint;
        const conf = config || {};

        return axios.get<any>(reqUrl, conf).then(response => {
            if (
                response.data.hasOwnProperty('success') &&
                !response.data.success
            ) {
                const errorCode =
                    response.data.error ||
                    'Unknown error. Please contact your IT department.';
                throw new Error(errorCode);
            } else {
                return response.data;
            }
        });
    };

    getInfo = (): Promise<any> => {
        return this.get('/EKYC/Info');
    };

    getFingerprint = (): Promise<any> => {
        return this.get('/EKYC/Fingerprint');
    };

    makeDesktopToolRequest = (type: string): Promise<any> => {
        switch (type) {
            case 'Fingerprint':
                return this.getFingerprint();
            case 'Info':
                return this.getInfo();
            default:
                return Promise.reject(
                    'Unknown error. Please contact your IT department.'
                );
        }
    };

    createErrorString(error: any): string {
        if ('string' !== typeof error) {
            error = error.message;
        }

        if (errorMessages.hasOwnProperty(error)) {
            return errorMessages[error];
        }

        return error;
    }

    createErrorReport(error: any): RejectionReport {
        return {
            rejected: true,
            reason: this.createErrorString(error)
        };
    }
}

interface FingerprintScannerConfig {
    api: string;
}
