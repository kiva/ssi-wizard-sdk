import SSIriusRouter from "./components/SSIriusRouter";
import Dispatch from "./enums/FlowDispatchTypes";
import Common from "./interfaces/ICommonProps";
import * as CONSTANTS from "./interfaces/IConstants";
import * as FlowRouterInterfaces from "./interfaces/FlowRouterInterfaces";

// the React element
export default SSIriusRouter;

// FlowDispatchTypes.ts
export const FlowDispatchTypes = Dispatch;

// IConstants.ts
export type IConstants = CONSTANTS.IConstants;
export type CredentialKeyMap = CONSTANTS.CredentialKeyMap;

// ICommonProps.ts
export type ICommonProps = Common;

// FlowRouterInterfaces.ts
export type FlowAction = FlowRouterInterfaces.FlowAction;

