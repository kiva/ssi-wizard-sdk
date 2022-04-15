export default interface IFPScanner {
    getFingerprint(...args: any[]): Promise<string>;
    getDeviceInfo: () => Promise<any>;
}