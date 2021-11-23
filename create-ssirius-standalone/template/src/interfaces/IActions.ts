import { IConstants } from "@kiva/ssirius-react";

export default interface IActions {
    [index: string]: (config: IConstants, ...actionArgs: any) => IConstants;
}