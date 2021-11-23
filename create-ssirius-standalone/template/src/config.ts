import component_map from "./componentMap";
import { defaultComponentMap } from "./globals/defaultComponentMap";
import config_constants from "./constants";
import { IConstants } from "@kiva/ssirius-react";

const config: IConstants = {
    direction: 'ltr', // can be overridden in config_constants
    ...config_constants,
    component_map: {
        ...defaultComponentMap,
        ...component_map
    }
};

export default config;
