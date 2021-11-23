import IErrorHandler from "./IErrorHandler";

export interface IGuardianSDKConfig {
    url: string;
    token?: string;
    errorHandler?: IErrorHandler;
}

export interface IGuardianSDK {
    cancel?: Function;
    fetchKyc(postBody: any, token?: string): Promise<any>;
}