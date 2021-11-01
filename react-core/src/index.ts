import SSIriusRouter from "./components/SSIriusRouter";
import Dispatch from "./enums/FlowDispatchTypes";
import * as CommonConfigs from "./interfaces/ICommonProps";
import baseAgentFunction from "./helpers/agentRequest";
import GuardianSDKConfig from "./interfaces/IGuardianSDKConfig";
import SDK from "./utils/GuardianSDK";
import GuardianSDKAbstract from "./abstracts/GuardianSDKClass";
import ErrorHandlerAbstract from "./abstracts/ErrorHandler";
import * as AgentInterfaces from "./interfaces/IAgent";
import * as CONSTANTS from "./interfaces/IConstants";
import * as FlowRouterInterfaces from "./interfaces/FlowRouterInterfaces";

// the React element
export default SSIriusRouter;

// FlowDispatchTypes.ts
export const FlowDispatchTypes = Dispatch;

// IConstants.ts
export type IConstants = CONSTANTS.IConstants;
export type CredentialKeyMap = CONSTANTS.CredentialKeyMap;

// Guardianship request SDK
export type IGuardianSDKConfig = GuardianSDKConfig;
export const GuardianSDK = SDK;
export const GuardianSDKClass = GuardianSDKAbstract;
export const ErrorHandler = ErrorHandlerAbstract;

// ICommonProps.ts
export type ICommonProps = CommonConfigs.ICommonProps;
export type AgentUIProps = CommonConfigs.AgentUIProps;
export type GuardianUIProps = CommonConfigs.GuardianUIProps;

// FlowRouterInterfaces.ts
export type FlowAction = FlowRouterInterfaces.FlowAction;

// Agent-to-Agent helpers
export const agentRequest = baseAgentFunction;
export type IIssuer = AgentInterfaces.IIssuer;
export type IVerifier = AgentInterfaces.IVerifier;

