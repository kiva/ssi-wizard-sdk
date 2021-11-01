export default abstract class GuardianSDKClass {
    abstract fetchKyc(postBody: any, token?: string): Promise<any>;
}
