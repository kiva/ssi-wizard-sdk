import { MutableRefObject } from "react";
import { IConstants } from "./IConstants";

export default interface SSIriusProps {
    CONSTANTS: IConstants;
    resetFunction?: MutableRefObject<any>;
}