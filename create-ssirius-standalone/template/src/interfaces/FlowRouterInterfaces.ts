import { FC, Component } from 'react';

export type ComponentStoreGet = (
    dataKey: string,
    dfault?: any,
    component?: string
) => any;
export type ComponentStoreSet = (dataKey: string, value: any) => void;

export interface FlowAction {
    type: string;
    payload?: any;
}

export interface ComponentStoreMethods {
    get: ComponentStoreGet;
    set: ComponentStoreSet;
    reset: () => void;
}

export interface ComponentStore {
    [index: string]: any;
    menu: any;
    confirmation: any;
    verificationRequirement: any;
    details: any;
}

export interface ComponentMap {
    [index: string]: ComponentDefinition;
    menu: ComponentDefinition;
    confirmation: ComponentDefinition;
    details: ComponentDefinition;
}

interface ComponentDefinition {
    component: FC<any> | typeof Component | string;
    props: any;
    dataHelper?: any;
}
