import { Application } from "express";
import IConfig from "../interfaces/IConfig";
import IOpts from "../interfaces/IOpts";

declare module 'tsarina' {
    function serverInit(): Application;
    function listenOnPort(app: Application, port: number, apiName?: string): any;
    function configureEndpoints(app: Application, endpoints: string[], returnValue: IConfig);
    function createBase64Img(fileName: string): string;
    function createEndpoints(opts: IOpts): string[];
    function parseOpts(opts: IOpts): Promise<IConfig>;

    type IConfig = IConfig;
    type IOpts = IOpts;
}