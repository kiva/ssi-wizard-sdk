import {IBaseAgent} from '../interfaces/AgentInterfaces';

export default class BaseAgent implements IBaseAgent {
    async baseFunction(
        request: Promise<any>,
        callback: (data: any) => any,
        error?: string
    ): Promise<any> {
        try {
            const connection: any = await request;

            return Promise.resolve(callback(connection));
        } catch (e) {
            console.error(e);
            return Promise.reject(this.determineErrorString(e, error));
        }
    }

    async profiles(
        request: Promise<any>,
        callback: (data: any) => any,
        error?: string
    ): Promise<any> {
        return this.baseFunction(request, callback, error);
    }

    async establish(
        request: Promise<any>,
        callback: (data: any) => any,
        error?: string
    ): Promise<any> {
        return this.baseFunction(request, callback, error);
    }

    async check(
        request: Promise<any>,
        callback: (data: any) => any,
        error?: string
    ): Promise<any> {
        return this.baseFunction(request, callback, error);
    }

    async send(
        request: Promise<any>,
        callback: (data: any) => any,
        error?: string
    ): Promise<any> {
        return this.baseFunction(request, callback, error);
    }

    async prove(
        request: Promise<any>,
        callback: (data: any) => any,
        error?: string
    ): Promise<any> {
        return this.baseFunction(request, callback, error);
    }

    async offer(
        request: Promise<any>,
        callback: (data: any) => any,
        error?: string
    ): Promise<any> {
        return this.baseFunction(request, callback, error);
    }

    async issue(
        request: Promise<any>,
        callback: (data: any) => any,
        error?: string
    ): Promise<any> {
        return this.baseFunction(request, callback, error);
    }

    determineErrorString(error: any, errorMsg?: string): string {
        if (errorMsg) return errorMsg;

        try {
            return `${error.message} (${error.response.data.code}: ${error.response.data.message})`;
        } catch {
            return error.hasOwnProperty('message')
                ? error.message
                : 'Unknown error!';
        }
    }
}
