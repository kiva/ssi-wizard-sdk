import axios from 'axios';
import map from "lodash/map";
import startCase from "lodash/startCase";

import { FPErrorHandlerConf } from './interfaces/ErrorHandlerInterfaces';

export class FPErrorHandlerClass {
    private errorCodes: any;

    static init(conf: FPErrorHandlerConf): FPErrorHandlerClass {
        return new FPErrorHandlerClass(conf);
    }

    constructor(conf: FPErrorHandlerConf) {
        this.errorCodes = conf.errorCodes;
    }

    determineError = (errorObject: any): string => {
        let errorCode = "";
        if (axios.isCancel(errorObject)) {
            console.log(errorObject.message);
            errorCode = "Cancel";
        }

        if (!errorObject.hasOwnProperty("response") || !errorObject.response) {
            errorCode = "NetworkAborted";
        } else {
            if (errorObject.response.hasOwnProperty("status")
                && errorObject.response.status === 401) {
                errorCode = "SDKAccessDenied";
            } else {
                errorCode = this.normalizeErrorCode(errorObject.response.data.code);
            }
        }

        return errorCode;
    };

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
}

export const FPErrorHandler = new FPErrorHandlerClass({
    errorCodes: {
        "NetworkAborted": 'The request couldn’t go through. Please check your internet connection and try again.',
        "NoCitizenFound": 'No record found. Please use an alternative KYC process.',
        "FingerprintNoMatch": 'Fingerprint did not match the stored records for the citizen. Please try again or use an alternative KYC process.',
        "FingerprintLowQuality": 'Fingerprint captured is too low quality to be used for matching. Please try again.',
        "FingerprintMissingNotCaptured": 'Fingerprints are not captured in the registry. Please use an alternative KYC process.',
        "FingerprintMissingUnableToPrint": 'Fingerprints are not captured in the registry. Please try a different finger or use an alternative KYC process.',
        "ServiceError": 'An unexpected service error occurred. Please contact your IT team and use an alternative KYC process.',
        "InternalServerError": 'An unexpected service error occurred. Please contact your IT team and use an alternative KYC process.'
    }
});
