import ErrorHandler from "../abstracts/ErrorHandler";

export default interface IGuardianSDKConfig {
    url: string;
    token?: string;
    errorHandler?: ErrorHandler;
}