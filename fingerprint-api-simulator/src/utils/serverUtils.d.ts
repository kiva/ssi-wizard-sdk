declare namespace serverUtils {
    function serverInit(): Application;
    function listenOnPort(app: Application, port: number, apiName?: string): any;
    function configureEndpoints(app: Application, endpoints: string[], returnValue: IConfig);
}