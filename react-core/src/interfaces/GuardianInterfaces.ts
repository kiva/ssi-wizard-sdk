import IErrorHandler from "./IErrorHandler";

export interface IGuardianSDKConfig {
    url: string;
    token?: string;
    errorHandler?: IErrorHandler;
}

export interface IGuardianSDK {
    fetchKyc(postBody: any, token?: string): Promise<any>;
}