import React, { useState, useRef, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { v4 as uuid4 } from 'uuid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Button from '@material-ui/core/Button';
import ErrorIcon from '@material-ui/icons/Error';
import QRCode from 'qrcode';
import classNames from 'classnames';
import { IVerifier } from '@kiva/ssirius-react';

import { QRProps, QRButtonProps } from './interfaces/QRInterfaces';
import { ProofRequestProfile } from '../ConfirmationScreen/interfaces/ConfirmationInterfaces';

import { FlowDispatchTypes } from '@kiva/ssirius-react';

import '../../css/Common.scss';
import './css/QRScreen.scss';
import TranslationContext from '../../contexts/TranslationContext';

let cancel: boolean;

const pollInterval = 1000;

export default function AgencyQR(props: QRProps) {
    const agent = props.agent as IVerifier;
    const [retrievingInviteUrl, setRetrievingInviteUrl] =
        useState<boolean>(false);
    const [inviteUrl, setInviteUrl] = useState<string>('');
    const [connectionError, setConnectionError] = useState<string>('');
    const [verifying, setVerifying] = useState<boolean>(false);
    const [isConnectionReady, setIsConnectionReady] = useState<boolean>(false);
    const [agentConnected, setAgentConnected] = useState<boolean>(
        props.store.get('agent_connected', false)
    );
    const [connectionId, setConnectionId] = useState<string>(
        props.store.get('connection_id', '')
    );
    const t = useContext(TranslationContext);

    const profile = useRef<ProofRequestProfile>(
        props.store.get(
            'profile',
            {
                comment: '',
                proof_request: {},
                schema_id: ''
            },
            'confirmation'
        )
    );

    const selectedVerificationOptionId = useRef<string>(
        props.CONSTANTS.verification_options[
            props.store.get('authIndex', 0, 'menu')
        ].id
    );

    function startProcess(reset?: boolean) {
        if (!connectionId || reset) {
            console.log('Attempting to get a connection');
            startConnection();
        } else if (agentConnected) {
            console.log('Starting a verification');
            startVerification();
        }
    }

    useEffect(() => {
        startProcess();

        return () => {
            cancel = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function startConnection() {
        setRetrievingInviteUrl(true);
        setConnectionError('');

        getInviteUrl();
    }

    function storeConnectionId(connectionId: string): void {
        props.store.set('connection_id', connectionId);
        setConnectionId(connectionId);
    }

    async function getInviteUrl() {
        try {
            const proposedConnectionId: string = uuid4();
            const url: string = await agent.connect(
                proposedConnectionId
            );
            processInviteUrl(url);
            pollConnection(proposedConnectionId);
        } catch (e: any) {
            console.log(e);
            processConnectionError(e);
        }
    }

    async function pollConnection(generatedId: string) {
        try {
            const connectionStatus: any = await agent.getConnection(
                generatedId
            );
            if (agent.isConnected(connectionStatus)) {
                props.store.set('agent_connected', true);
                storeConnectionId(generatedId);
                setIsConnectionReady(true);
                setAgentConnected(true);
            } else if (!cancel) {
                setTimeout(() => {
                    pollConnection(generatedId);
                }, pollInterval);
            }
        } catch (e: any) {
            console.log(e);
            processConnectionError(e);
        }
    }

    async function pollVerification(verificationOptionId: string) {
        try {
            if (!verificationOptionId) {
                verificationOptionId = selectedVerificationOptionId.current;
            }

            const verificationStatus: any = await agent.checkVerification(
                verificationOptionId
            );

            if (agent.isVerified(verificationStatus)) {
                acceptProof(agent.getProof(verificationStatus));
            } else if (
                !!agent.isRejected &&
                agent.isRejected(verificationStatus)
            ) {
                const errorMessage = t('Errors.qr.rejectedProof', {
                    proofRequestComment: profile.current.comment
                });
                // eslint-disable-next-line
                throw errorMessage;
            } else if (!cancel) {
                setTimeout(() => {
                    pollVerification(verificationOptionId);
                }, pollInterval);
            }
        } catch (e: any) {
            console.log(e);
            processConnectionError(e);
        }
    }

    function startVerification() {
        if (verifying || !agentConnected) {
            toast.error(t('Errors.qr.notConnected'), {
                duration: 3000
            });
        } else {
            setVerifying(true);
            verify();
        }
    }

    function settleConnectionId(existingId?: string): string {
        const id: string = existingId || connectionId;
        return id;
    }

    function acceptProof(verificationData: any) {
        props.store.set('personalInfo', verificationData);
        props.dispatch({ type: FlowDispatchTypes.NEXT });
    }

    async function verify() {
        try {
            const id: string = settleConnectionId();
            const verification: any = await agent.verify(
                id,
                profile.current
            );
            pollVerification(verification);
        } catch (e: any) {
            console.log(e);
            processConnectionError(e);
        }
    }

    function processInviteUrl(invitation?: string): void {
        setRetrievingInviteUrl(false);

        if (invitation) {
            setInviteUrl(invitation);
            writeQRtoCanvas(invitation);
        } else {
            processConnectionError(t('Errors.qr.noInviteUrl'));
        }
    }

    function writeQRtoCanvas(invitation: string) {
        try {
            QRCode.toCanvas(
                document.getElementById('qr-code'),
                invitation || '',
                {
                    width: 400
                }
            );
        } catch {
            console.error('The QR code failed to write to the canvas');
        }
    }

    function processConnectionError(error: any) {
        let errorMessage: string;
        if ('string' === typeof error) {
            errorMessage = error;
        } else {
            errorMessage = error.hasOwnProperty('message') ? error.message : t('Errors.unknown');
        }
        cancel = true;
        setRetrievingInviteUrl(false);
        setVerifying(false);
        setConnectionError(errorMessage);
    }

    function resetFlow(): void {
        props.store.set('connection_id', '');
        props.store.set('agent_connected', false);
        setIsConnectionReady(false);
        setVerifying(false);
        setConnectionId('');
        setAgentConnected(false);
        startProcess(true);
    }

    function renderQRInvite() {
        return (
            <div>
                <Typography
                    component="h2"
                    variant="h6"
                    gutterBottom
                    className="qr-loading-title">
                    <strong>
                        {agentConnected ? t('QR.text.clickVerify') : t('QR.text.scanQR')}
                    </strong>
                    <br />
                    {agentConnected
                        ? t('QR.text.connected')
                        : t('QR.text.scanQRInstructions')}
                </Typography>
                <div id="qr-box">
                    <canvas id="qr-code"></canvas>
                    <CheckCircleIcon
                        className={classNames({
                            'qr-icon': true,
                            'dialog-icon': true,
                            verified: true,
                            hidden: !agentConnected
                        })}
                    />
                </div>
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

    function renderVerifying() {
        return (
            <div data-cy="verify-qr">
                <Typography
                    component="h2"
                    variant="h6"
                    gutterBottom
                    className="qr-loading-title">
                    {t('Standard.verifying')}...
                </Typography>
                <div id="qr-loader">
                    <CircularProgress className="dialog-icon verifying" />
                </div>
            </div>
        );
    }

    function renderError() {
        return (
            <div className="centered status-report">
                <ErrorIcon className="dialog-icon error" />
                <Typography
                    id="instructions"
                    component="h2"
                    align="center"
                    className="error-description">
                    {connectionError}
                </Typography>
            </div>
        );
    }

    function renderBody() {
        if (connectionError) {
            return renderError();
        } else if (verifying) {
            return renderVerifying();
        } else if (inviteUrl && !retrievingInviteUrl) {
            return renderQRInvite();
        } else {
            return renderRetrieving();
        }
    }

    return (
        <div
            id={selectedVerificationOptionId.current}
            className="flex-block column">
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center">
                {renderBody()}
            </Grid>
            <QRScreenButtons
                isConnectionReady={isConnectionReady}
                isVerifying={verifying}
                onClickBack={() =>
                    props.dispatch({ type: FlowDispatchTypes.BACK })
                }
                onSubmit={() => startVerification()}
                onReset={() => resetFlow()}
            />
        </div>
    );
}

function QRScreenButtons(props: QRButtonProps) {
    const t = useContext(TranslationContext);

    return (
        <Grid
            container
            className="qrButtons buttonListNew row"
            direction="row"
            justifyContent="center"
            alignItems="center">
            <Grid item>
                <Button
                    data-cy="qr-back"
                    className="back secondary"
                    onClick={props.onClickBack}>
                    {t('Standard.back')}
                </Button>
            </Grid>
            <Grid item>
                <Button
                    data-cy="reset-flow"
                    className="qr-reset"
                    onClick={props.onReset}>
                    {t('QR.text.resetConnection')}
                </Button>
            </Grid>
            <Grid item>
                <Button
                    disabled={!props.isConnectionReady || props.isVerifying}
                    type="submit"
                    data-cy="qr-scan-next"
                    className="next button-verify"
                    onSubmit={props.onSubmit}
                    onClick={props.onSubmit}>
                    {t('Standard.next')}
                </Button>
            </Grid>
        </Grid>
    );
}