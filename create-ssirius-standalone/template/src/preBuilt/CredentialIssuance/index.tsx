import React, { useState, useRef, useEffect, useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import toast from 'react-hot-toast';
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import classNames from 'classnames';
import CircularProgress from '@material-ui/core/CircularProgress';
import { v4 as uuid4 } from 'uuid';
import { FlowDispatchTypes } from '@kiva/ssirius-react';
import ErrorIcon from '@material-ui/icons/Error';
import QRCode from 'qrcode';
import '../../css/Common.scss';
import '../AgencyQR/css/QRScreen.scss';
import { QRScreenButtons } from '../../components/QRScreenButtons';
import { CredentialIssuanceProps } from './interfaces/CredentialIssuanceInterfaces';
import TranslationContext from '../../contexts/TranslationContext';

const pollInterval = 200;

let cancelConnectionPolling: boolean;
let cancelCredentialPolling: boolean;

const CREDENTIAL_STORE_KEY = 'credentialCreationData';

export default function CredentialIssuance(props: CredentialIssuanceProps) {
    const t = useContext(TranslationContext);
    const agent = props.agent;
    const credentialData = useRef(constructInitialData());

    const [retrievingInviteUrl, setRetrievingInviteUrl] =
        useState<boolean>(true);
    const [inviteUrl, setInviteUrl] = useState<string>('');
    const [connectionError, setConnectionError] = useState<string>('');
    const [connected, setConnected] = useState<boolean>(
        props.store.get('isConnected', false)
    );
    const [offered, setOffered] = useState<boolean>(
        props.store.get('isOffered', false)
    );
    const [issued, setIssued] = useState<boolean>(
        props.store.get('isIssued', false)
    );

    function constructInitialData() {
        let credentialCreationData = props.store.get(CREDENTIAL_STORE_KEY, {});
        const deps = props.dependencies;

        for (const key in deps) {
            for (let i = 0; i < deps[key].length; i++) {
                const storeKey = deps[key][i];
                const storedValue = props.store.get(storeKey, false, key);
                if (storedValue) {
                    credentialCreationData = {
                        ...credentialCreationData,
                        ...(isObject(storedValue)
                            ? storedValue
                            : { [storeKey]: storedValue })
                    };
                }
            }
        }

        props.store.set(CREDENTIAL_STORE_KEY, credentialCreationData);
        return props.store.get(CREDENTIAL_STORE_KEY);
    }

    function isObject(value: any) {
        return (
            'object' === typeof value && value !== null && !Array.isArray(value)
        );
    }

    const startProcess = (reset?: boolean) => {
        if (!props.store.get('isConnected', false) || reset) {
            console.log('Attempting to get a connection');
            startConnection();
        }
    };

    const getInviteUrl = async () => {
        try {
            const connectionId: string = uuid4();
            const url: string = await agent.connect(connectionId);
            props.store.set('connectionId', connectionId);
            processInviteUrl(url);
            pollConnection(connectionId);
        } catch (e: any) {
            console.log(e);
            processConnectionError(e);
        }
    };

    function processInviteUrl(invitation?: string): void {
        setRetrievingInviteUrl(false);

        if (invitation) {
            setInviteUrl(invitation);
            writeQRtoCanvas(invitation);
        } else {
            processConnectionError(t('Errors.qr.noInviteUrl'));
        }
    }

    function processConnectionError(error: any) {
        const errorMessage = error.hasOwnProperty('message') ? error.message : t('Errors.unknown');
        cancelConnectionPolling = true;
        cancelCredentialPolling = true;

        setRetrievingInviteUrl(false);
        setOffered(false);
        setConnectionError(errorMessage);
        setConnected(false);
        props.store.set('isConnected', false);
        props.store.set('isOffered', false);
        props.store.set('isIssued', false);
    }

    const startConnection = () => {
        setRetrievingInviteUrl(true);
        setConnectionError('');

        getInviteUrl();
    };

    useEffect(() => {
        startProcess();

        return () => {
            cancelConnectionPolling = true;
            cancelCredentialPolling = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const pollConnection = async (connectionId: string) => {
        try {
            const connectionStatus: any = await agent.getConnection(
                connectionId
            );
            if (agent.isConnected(connectionStatus)) {
                setConnected(true);
                props.store.set('isConnected', true);
                cancelConnectionPolling = true;
                startCredentialCreation();
            } else if (!cancelConnectionPolling) {
                setTimeout(() => {
                    pollConnection(connectionId);
                }, pollInterval);
            }
        } catch (e: any) {
            console.log(e);
            processConnectionError(e);
        }
    };

    const pollCredentialStatus = async (credentialId: string) => {
        try {
            const credentialStatus: any = await agent.checkCredentialStatus(
                credentialId
            );
            if (agent.isIssued(credentialStatus)) {
                setIssued(true);
                props.store.set('isIssued', true);
                cancelCredentialPolling = true;
            } else if (!cancelCredentialPolling) {
                setTimeout(() => {
                    pollCredentialStatus(credentialId);
                }, pollInterval);
            }
        } catch (e) {
            console.log(e);
            processConnectionError(e);
        }
    };

    const startCredentialCreation = () => {
        if (offered || !props.store.get('isConnected', true)) {
            toast.error(t('Errors.qr.notConnected'), {
                duration: 3000
            });
        } else {
            createCredential();
        }
    };

    const createCredential = async () => {
        try {
            agent.setProofProfile(props.CONSTANTS.credentialDefinition || '');
            const credential: any = await agent.createCredential(
                credentialData.current
            );
            if (agent.isOffered(credential)) {
                // show offered state
                setOffered(true);
                props.store.set('isOffered', true);
            }
            pollCredentialStatus(credential.credentialId);
        } catch (e) {
            console.log(e);
            processConnectionError(e);
        }
    };

    const writeQRtoCanvas = (invitation?: string) => {
        try {
            QRCode.toCanvas(
                document.getElementById('qr-code'),
                invitation || inviteUrl || '',
                {
                    width: 400
                }
            );
        } catch {
            console.error('The QR code failed to write to the canvas');
        }
    };

    function renderQRInvite() {
        return (
            <div>
                <Typography
                    component="h2"
                    variant="h6"
                    gutterBottom
                    className="qr-loading-title">
                    {connected
                        ? t('CredentialIssuance.text.connectionSuccessful')
                        : t('CredentialIssuance.text.instructions')}
                </Typography>
                <div id="qr-box">
                    <canvas
                        id="qr-code"
                        className="inspectlet-sensitive"></canvas>
                    <CheckCircleIcon
                        className={classNames({
                            'qr-icon': true,
                            'dialog-icon': true,
                            verified: true,
                            hidden: !connected
                        })}
                    />
                </div>
            </div>
        );
    }

    function renderCredentialOffered(text?: string) {
        const header: string =
            text ||
            t('CredentialIssuance.text.offerNotice');
        return (
            <div className="centered-flex-content">
                <Typography
                    component="h2"
                    variant="h6"
                    gutterBottom
                    className="qr-loading-title">
                    {header}
                </Typography>
                <Grid container justifyContent="space-around">
                    <Grid item>
                        <CreditCardIcon
                            id="credential-offer-icon"
                            style={{
                                margin: '0 auto',
                                fontSize: 190,
                                color: '#AAA'
                            }}
                            className={classNames({
                                'credential-icon': true,
                                hidden: !connected
                            })}
                        />
                    </Grid>
                </Grid>
            </div>
        );
    }

    function renderCredentialIssued(text?: string) {
        const header: string = text || t('CredentialIssuance.text.issueNotice');
        return (
            <div className="centered-flex-content">
                <Typography
                    component="h2"
                    variant="h6"
                    gutterBottom
                    className="qr-loading-title">
                    {header}
                </Typography>
                <Grid container justifyContent="space-around">
                    <Grid item>
                        <div id="credential-box">
                            <CreditCardIcon
                                style={{
                                    margin: '0 auto',
                                    fontSize: 190,
                                    color: '#AAA'
                                }}
                                className={classNames({
                                    'credential-icon': true,
                                    verified: true
                                })}
                            />
                            <CheckCircleIcon
                                className={classNames({
                                    'qr-icon': true,
                                    'dialog-icon': true,
                                    verified: true
                                })}
                            />
                        </div>
                    </Grid>
                </Grid>
            </div>
        );
    }

    function renderRetrieving(text?: string) {
        const header: string = text || t('QR.text.retrieving');
        return (
            <div className="centered-flex-content">
                <Typography
                    component="h2"
                    variant="h6"
                    gutterBottom
                    className="qr-loading-title">
                    {header}
                </Typography>
                <div id="qr-loader">
                    <CircularProgress className="dialog-icon verifying" />
                </div>
            </div>
        );
    }

    function renderError() {
        return (
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                direction="column"
                className="status-report">
                <Grid item>
                    <ErrorIcon className="dialog-icon error" />
                </Grid>
                <Grid item xs={4}>
                    <Typography
                        id="instructions"
                        component="h2"
                        align="center"
                        className="error-description">
                        {connectionError}
                    </Typography>
                </Grid>
            </Grid>
        );
    }

    function renderBody() {
        if (connectionError) {
            return renderError();
        } else if (issued) {
            return renderCredentialIssued();
        } else if (offered) {
            return renderCredentialOffered();
        } else if (inviteUrl && !retrievingInviteUrl) {
            return renderQRInvite();
        } else {
            return renderRetrieving();
        }
    }

    return (
        <div id="QR_scan" className="flex-block column">
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center">
                {renderBody()}
            </Grid>
            <QRScreenButtons
                backText={t('Standard.back')}
                onClickBack={() => {
                    props.dispatch({ type: FlowDispatchTypes.BACK });
                }}
            />
        </div>
    );
}
