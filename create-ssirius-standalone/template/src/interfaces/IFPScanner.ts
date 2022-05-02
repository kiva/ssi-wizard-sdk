export default interface IFPScanner {
    isScanInProgress(): boolean;
    isErrorPersistent(): boolean;
    getFingerprint(...args: any[]): Promise<string>;
    getDeviceInfo: () => Promise<any>;
}