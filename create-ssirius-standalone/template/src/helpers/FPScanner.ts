import IFPScanner from "../interfaces/IFPScanner";
import axios from 'axios';
import actions from "../actions";
import config from "../config";

export default class FPScanner implements IFPScanner {
    private host: string;
    private deviceInfo: any;

    constructor(host: string) {
        this.host = host;
    }

    static init(host: string) {
        return new FPScanner(host);
    }

    getFingerprint = async (...args: any[]): Promise<string> => {
        const reqUrl = `${this.host}/EKYC/Fingerprint`;

        return axios.get<any>(reqUrl).then(response => {
            if (
                response.data.hasOwnProperty('success') &&
                !response.data.success
            ) {
                const errorCode =
                    response.data.error ||
                    'Unknown error. Please contact your IT department.';
                throw new Error(errorCode);
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

    getDeviceInfo = () => {
        if (this.deviceInfo) return Promise.resolve(this.deviceInfo);

        const reqUrl = `${this.host}/EKYC/Info`;

        return axios.get<any>(reqUrl).then(response => {
            if (
                response.data.hasOwnProperty('success') &&
                !response.data.success
            ) {
                const errorCode =
                    response.data.error ||
                    'Unknown error. Please contact your IT department.';
                throw new Error(errorCode);
            } else {
                const deviceInfo: ScrubbedData = this.scrubSensitiveInfo(response.data);

                this.deviceInfo = deviceInfo;
                return deviceInfo;
            }
        });
    }

    scrubSensitiveInfo = (data: any): ScrubbedData => {
        delete data.ImageBase64;
        delete data.Token;

        return data;
    }
}

interface ScrubbedData {
    [index: string]: any;
    ImageBase64: never;
    Token: never;
}