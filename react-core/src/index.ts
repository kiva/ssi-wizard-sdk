import SSIriusRouter from "./components/SSIriusRouter";
import Dispatch from "./enums/FlowDispatchTypes";
import * as CommonConfigs from "./interfaces/ICommonProps";
import baseAgentFunction from "./helpers/agentRequest";
import * as GuardianSDKInterfaces from "./interfaces/GuardianInterfaces";
import SDK from "./utils/GuardianSDK";
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
export type IGuardianSDKConfig = GuardianSDKInterfaces.IGuardianSDKConfig;
export type IGuardianSDK = GuardianSDKInterfaces.IGuardianSDK;
export const GuardianSDK = SDK;

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
