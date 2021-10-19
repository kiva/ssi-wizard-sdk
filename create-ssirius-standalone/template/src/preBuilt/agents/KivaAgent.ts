import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
import BaseAgent from './BaseAgent';
import { map } from 'lodash';
import { IAgent } from './AgentInterfaces';
import { ProofRequestProfile } from '../ConfirmationScreen/interfaces/ConfirmationInterfaces';

export default class KivaAgent extends BaseAgent implements IAgent {
    public axiosInstance: AxiosInstance;
    private _connectionId?: string;
    private _verificationId?: string;
    private _proofProfile?: string;
    private _credentialId?: string;

    static init(token?: string) {
        return new KivaAgent(token);
    }

    constructor(token?: string) {
        super();
        const config: any = {
            baseURL: 'https://sandbox-gateway.protocol-prod.kiva.org'
        };
        if (token) {
            config.headers = {
                Authorization: `Bearer ${token}`
            };
        }
        const axiosConfig: AxiosRequestConfig = config;
        this.axiosInstance = axios.create(axiosConfig);
    }

    setProofProfile = (credentialDefinition: string) => {
        this._proofProfile = credentialDefinition;
    };

    fetchProofOptions() {
        return super.profiles(
            this.axiosInstance.get('/v2/kiva/api/profiles/proofs', {}),
            (profiles: any) => {
                return map(profiles.data, (value, key) => {
                    return {
                        schema_id: key,
                        ...value
                    };
                });
            }
        );
    }

    isConnected(response: any): boolean {
        const state: string = response.state;
        if (state === 'response' || state === 'active') {
            return true;
        }
        return false;
    }

    isVerified(response: any): boolean {
        if (response.state === 'verified' && response.verified === 'true') {
            return true;
        }
        return false;
    }

    isRejected(response: any): boolean {
        if (response.state === 'verified' && response.verified === 'false') {
            return true;
        }
        return false;
    }

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

    formatProof(response: any): void {
        // TODO: Define an actual credential schema structure so that we can know that we're mapping data to actual PII map keys
        const proof: any = {};
        for (const key in response) {
            proof[key] = response[key].raw;
        }
        return proof;
    }

    getData(axiosData: any) {
        return axiosData.data;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    establishConnection = async (ignore: string) => {
        return super.establish(
            this.axiosInstance.post('/v2/kiva/api/connection', {}),
            (connection: any) => {
                this._connectionId = connection.data.connection_id;
                return btoa(JSON.stringify(connection.data.invitation));
            }
        );
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getConnection = async (ignore: string) => {
        return super.check(
            this.axiosInstance.get(
                '/v2/kiva/api/connection/' + this._connectionId
            ),
            this.getData
        );
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    checkVerification = async (ignore: string) => {
        return super.prove(
            this.axiosInstance.get(
                '/v2/kiva/api/verify/' + this._verificationId
            ),
            this.getData
        );
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sendVerification = async (
        ignore: string,
        profile: ProofRequestProfile
    ): Promise<string> => {
        return super.send(
            this.axiosInstance.post('/v2/kiva/api/verify', {
                connectionId: this._connectionId,
                profile: profile.schema_id
            }),
            (verification: any) => {
                this._verificationId =
                    verification.data.presentation_exchange_id;
                return this._verificationId;
            }
        );
    };

    getProof(data: any) {
        return this.formatProof(
            data.presentation.requested_proof.revealed_attrs
        );
    }

    async createCredential(entityData: any) {
        return super.offer(
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
        return super.issue(
            this.axiosInstance.get('/v2/kiva/api/issue/' + this._credentialId),
            this.getData
        );
    };
}
