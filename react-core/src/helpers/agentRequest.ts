export default async function agentRequest(
    request: Promise<any>,
    callback?: (data: any) => any,
    error?: string
): Promise<any> {
    try {
        let connection: any = await request;
        if (callback) {
            connection = callback(connection);
        }

        return Promise.resolve(connection);
    } catch (e) {
        console.error(e);
        return Promise.reject(determineErrorString(e, error));
    }
}

export function determineErrorString(error: any, errorMsg?: string): string {
    if (errorMsg) return errorMsg;

    try {
        return `${error.message} (${error.response.data.code}: ${error.response.data.message})`;
    } catch {
        return error.hasOwnProperty('message')
            ? error.message
            : 'Unknown error!';
    }
}