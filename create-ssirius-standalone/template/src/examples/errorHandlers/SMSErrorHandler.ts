import map from "lodash/map";
import startCase from "lodash/startCase";
import { SMSErrorHandlerConf } from "./interfaces/ErrorHandlerInterfaces";

export class SMSErrorHandlerClass {
    private errorCodes: any;

    static init(conf: SMSErrorHandlerConf): SMSErrorHandlerClass {
        return new SMSErrorHandlerClass(conf);
    }

    constructor(conf: SMSErrorHandlerConf) {
        this.errorCodes = conf.errorCodes;
    }

    createErrorString = (errorCode: string, options: any): string => {
        if (!errorCode.length || !options.hasOwnProperty(errorCode)) {
            return '????';
        }

        return options[errorCode];
    };

    explainError(error: any): string {
        const reason: string | boolean = this.determineError(error);
        const errorOptions = this.errorCodes;

        return this.createErrorString(reason, errorOptions);
    }

    normalizeErrorCode(code: string): string {
        const pieces = code.split("_");
        if (pieces.length === 1) {
            return code;
        }
        return map(pieces, x => {
            return startCase(x.toLowerCase());
        }).join("");
    }

    determineError(errorObject: any): string {
        let errorCode = "";

        if (!errorObject.hasOwnProperty("response") || !errorObject.response) {
            errorCode = "NetworkAborted";
        } else if (!!errorObject.response.data.code) {
            errorCode = this.normalizeErrorCode(errorObject.response.data.code);
        }

        return errorCode;
    }
}

export const SMSErrorHandler = new SMSErrorHandlerClass({
    errorCodes: {
        "NoCitizenFound": 'No record found. Please use an alternative KYC process.',
        "NetworkAborted": 'The request couldn’t go through. Please check your internet connection and try again.',
        "PhoneNumberNoMatch": 'The phone number registered may need to be updated in order to complete the authentication. Please try a different number or update the phone number.',
        "OtpNoMatch": 'The request could not be authenticated. Please try again.',
        "OtpExpired": "The code entered has expired. Please try again.",
        "SmsSendFailed": 'The SMS with the one-time passcode failed to send. Please try again.'
    }
})