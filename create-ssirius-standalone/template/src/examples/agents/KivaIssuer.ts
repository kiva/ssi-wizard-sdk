import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
import { IIssuer, agentRequest } from '@kiva/ssirius-react';

export default class KivaIssuer implements IIssuer {
    public axiosInstance: AxiosInstance;
    private _connectionId?: string;
    private _proofProfile?: string;
    private _credentialId?: string;

    static init(proofProfile: string, token?: string) {
        return new KivaIssuer(proofProfile, token);
    }

    constructor(proofProfile: string, token?: string) {
        this._proofProfile = proofProfile;
        const config: any = {
            baseURL: 'http://localhost:8080'
        };
        if (token) {
            config.headers = {
                Authorization: `Bearer ${token}`
            };
        }
        const axiosConfig: AxiosRequestConfig = config;
        this.axiosInstance = axios.create(axiosConfig);
    }

    isConnected(response: any): boolean {
        const state: string = response.state;
        if (state === 'response' || state === 'active') {
            return true;
        }
        return false;
    }

    setProofProfile = (credentialDefinition: string) => {
        this._proofProfile = credentialDefinition;
    };

    isOffered(response: any): boolean {
        if (response.state === 'offer_sent') {
            return true;
        }
        return false;
    }

    isIssued(response: any): boolean {
        if (response.state === 'credential_issued') {
            return true;
        }
        return false;
    }

    getData(axiosData: any) {
        return axiosData.data;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    connect = async (ignore: string) => {
        return agentRequest(
            this.axiosInstance.post('/v2/kiva/api/connection', {}),
            (connection: any) => {
                this._connectionId = connection.data.connection_id;
                return btoa(JSON.stringify(connection.data.invitation));
            }
        );
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getConnection = async (ignore: string) => {
        return agentRequest(
            this.axiosInstance.get(
                '/v2/kiva/api/connection/' + this._connectionId
            ),
            this.getData
        );
    };

    async createCredential(entityData: any) {
        return agentRequest(
            this.axiosInstance.post('/v2/kiva/api/issue', {
                profile: this._proofProfile,
                connectionId: this._connectionId,
                entityData
            }),
            (credentialData: any) => {
                this._credentialId = credentialData.data.credential_exchange_id;
                return credentialData.data;
            }
        );
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    checkCredentialStatus(ignore: string) {
        return agentRequest(
            this.axiosInstance.get('/v2/kiva/api/issue/' + this._credentialId),
            this.getData
        );
    };
}
