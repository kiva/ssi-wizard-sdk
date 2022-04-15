import { ComponentMap, IConstants, GuardianSDK } from "@kiva/ssirius-react";
import KivaIssuer from "./examples/agents/KivaIssuer";
import KivaVerifier from "./examples/agents/KivaVerifier";
import { FPErrorHandler } from "./examples/errorHandlers/FPErrorHandler";
import { SMSErrorHandler } from "./examples/errorHandlers/SMSErrorHandler";
import IActions from "./interfaces/IActions";

const actions: IActions = {
    updateToken: function(conf: IConstants, token: string) {
        const componentMap: ComponentMap = conf.component_map;
        conf.auth_token = token;
        componentMap.agency_qr.props.agent = new KivaVerifier(token);
        componentMap.issue.props.agent = new KivaIssuer(token);
        componentMap.fpScan.props.guardianSDK = GuardianSDK.init({
            url: 'https://sandbox-gateway.protocol-prod.kiva.org/v2/kyc',
            errorHandler: FPErrorHandler,
            token
        });
        componentMap.smsotp.props.guardianSDK = GuardianSDK.init({
            url: 'https://sandbox-gateway.protocol-prod.kiva.org/v2/kyc/sms',
            errorHandler: SMSErrorHandler,
            token
        });
        return conf;
    }
};

export default actions;