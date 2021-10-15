import { useRef } from 'react';
import {
    ComponentStoreGet,
    ComponentStoreSet,
    ComponentStoreMethods,
    ComponentStore
} from '../interfaces/FlowRouterInterfaces';

export default useComponentStore;

function useComponentStore(step: string): ComponentStoreMethods {
    const componentStore = useRef<ComponentStore>(initComponentStore());

    const get: ComponentStoreGet = (
        dataKey: string,
        dfault?: any,
        uniqueComponentKey?: string
    ) => {
        if (!uniqueComponentKey) {
            uniqueComponentKey = step;
        }

        return (
            (componentStore.current[uniqueComponentKey] &&
                componentStore.current[uniqueComponentKey][dataKey]) ??
            dfault
        );
    };

    const set: ComponentStoreSet = (dataKey: string, value: any) => {
        if (!componentStore.current[step]) {
            componentStore.current[step] = {};
        }

        componentStore.current[step] = {
            ...componentStore.current[step],
            [dataKey]: value
        };
    };

    const reset = () => {
        componentStore.current = initComponentStore();
    };

    return { get, set, reset };
}

function initComponentStore(): ComponentStore {
    return {
        menu: {},
        confirmation: {},
        details: {}
    };
}
