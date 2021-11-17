interface KYCErrorHandlerConf {
    errorCodes: {
        [index: string]: string;
    }
}

export interface FPErrorHandlerConf extends KYCErrorHandlerConf {

}

export interface SMSErrorHandlerConf extends KYCErrorHandlerConf {

}