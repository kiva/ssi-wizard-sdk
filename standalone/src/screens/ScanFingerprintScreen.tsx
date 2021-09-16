/* eslint-disable jsx-a11y/anchor-is-valid */

import React, {useState, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import '../css/Common.scss';
import '../css/ScanFingerprintScreen.scss';

import FingerSelectionScreen from './FingerSelectionScreen';
import DialogContainer from '../components/DialogContainer';
import FingerprintScanning from '../dataHelpers/FingerprintScanning';
import GuardianSDK from '../dataHelpers/GuardianSDK';
import getPostBody from '../helpers/getPostBody';

import {FingerprintEkycBody, FPScanProps} from '../interfaces/ScanFingerprintInterfaces';
import FlowDispatchTypes from '../enums/FlowDispatchTypes';

import failed from '../images/np_fingerprint_failed.png';
import success from '../images/np_fingerprint_verified.png';
import in_progress from '../images/np_fingerprint_inprogress.png';

const FINGER_STORE = 'selectedFinger';

export default function ScanFingerprintScreen(props: FPScanProps) {
    const SLOW_INTERNET_THRESHOLD: number =
        props.CONSTANTS.slowInternetThreshold || 10000;
    const [selectedFinger, setSelectedFinger] = useState<string>(
        props.store.get(FINGER_STORE, 'right_thumb')
    );
    const [processResultMessage, setProcessResultMessage] =
        useState<string>('');
    const [slowInternet, setSlowInternet] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [dialogComplete, setDialogComplete] = useState<boolean>(false);
    const [dialogSuccess, setDialogSuccess] = useState<boolean>(false);
    const [scanStatus, setScanStatus] = useState<string>('');
    const [fingerPrintImage, setFingerprintImage] = useState<string>('');
    const [selectingNewFinger, setSelectingNewFinger] =
        useState<boolean>(false);
    const [deviceInfo, setDeviceInfo] = useState({});
    const fingerprintScanner = FingerprintScanning.init({
        api: 'http://localhost:9907'
    });
    const SDK = GuardianSDK.init({
        url: props.backendURL,
        auth_method: 'Fingerprint'
    });

    useEffect(() => {
        resetFingerprintImage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function processFingerSelection(index: string) {
        setSelectingNewFinger(false);
        props.store.set(FINGER_STORE, index);
        setSelectedFinger(index);
    }

    function changeFingerSelection(index: string): void {
        processFingerSelection(index);
        setFingerprintImage('');
        setScanStatus('');
        setSelectingNewFinger(false);
        resetFingerprintImage();
    }

    function resetFingerprintImage() {
        setFingerprintImage('');
        setScanStatus('progress');
        beginFingerprintScan();
    }

    function buildFingerCaption(fingerType: string): string {
        return props.t(`Fingers.${fingerType}_full`, {
            finger: props.t('Fingers.finger')
        });
    }

    // 1 - 5 Right thumb through right four fingers
    // 6 -10 Left thumb through left four fingers
    // Taken from ISO 19794-4
    function translateFingertype(fingerType: string): number {
        const data: any = {
            right_thumb: 1,
            right_index: 2,
            right_middle: 3,
            right_ring: 4,
            right_little: 5,
            left_thumb: 6,
            left_index: 7,
            left_middle: 8,
            left_ring: 9,
            left_little: 10
        };
        return data[fingerType] || 1;
    }

    function beginRequest(event: any) {
        event.preventDefault();
        setDialogComplete(false);
        setDialogOpen(true);
        setDialogSuccess(false);
        setProcessResultMessage('');
        makeRequest();
    }

    function cancelEkycRequest() {
        if (SDK.cancel) {
            SDK.cancel('User cancelled request because of slow internet');
        }
        setDialogOpen(false);
        setDialogComplete(false);
        setDialogSuccess(false);
        setSlowInternet(false);
    }

    function postBody(): FingerprintEkycBody {
        return getPostBody(
            fingerPrintImage,
            translateFingertype(selectedFinger),
            deviceInfo,
            props.store.get
        );
    }

    // TODO: Break up this method - it's too big
    async function makeRequest(): Promise<void> {
        let slowInternetWarning;
        try {
            slowInternetWarning = setTimeout(() => {
                setSlowInternet(true);
            }, SLOW_INTERNET_THRESHOLD);

            const body: FingerprintEkycBody = postBody();

            const response = await SDK.fetchKyc(
                body,
                props.CONSTANTS.auth_token
            );
            setDialogSuccess(true);
            setDialogComplete(true);
            setProcessResultMessage('');

            handleEkycSuccess(response);
        } catch (errorMessage) {
            console.error('Error -> ' + errorMessage);
            setDialogSuccess(false);
            setDialogComplete(true);
            setProcessResultMessage(errorMessage);
        } finally {
            if (slowInternetWarning) clearTimeout(slowInternetWarning);
        }
    }

    function handleEkycSuccess(personalInfo: any) {
        setTimeout(() => {
            setDialogOpen(false);
            props.store.set('personalInfo', personalInfo);
            props.dispatch({type: FlowDispatchTypes.NEXT});
        }, 1000);
    }

    function buildBase64Template(status: string): string {
        let b64 = in_progress;
        switch (status) {
            case 'failed':
                b64 = failed;
                break;
            case 'success':
                b64 = success;
                break;
            case 'progress':
            default:
                break;
        }
        return b64;
    }

    function createAltText(status: string): string {
        if (status === 'progress') {
            return 'Scan in progress...';
        } else {
            return `Scan finished with status: ${status}!`;
        }
    }

    function beginFingerprintScan(): void {
        if (scanStatus !== 'progress') {
            setScanStatus('progress');
            getImageFromFingerprintScanner();
        }
    }

    function updateFingerprintState(response: any): void {
        const fingerPrintImage: string = response.ImageBase64.replace(
            'data:image/png;base64,',
            ''
        );
        const deviceInfo: any = response;

        delete deviceInfo.ImageBase64;
        delete deviceInfo.Token;

        setScanStatus('success');
        setFingerprintImage(fingerPrintImage);
        setDeviceInfo(deviceInfo);
        setDialogOpen(false);
        setDialogComplete(false);
        setProcessResultMessage('');
    }

    async function getImageFromFingerprintScanner(): Promise<void> {
        try {
            const data: any = await fingerprintScanner.makeDesktopToolRequest(
                'Fingerprint'
            );
            updateFingerprintState(data);
        } catch (e) {
            console.log(e);
            setProcessResultMessage('string' === typeof e ? e : e.message);
        }
    }

    function buildSelectedFingerprint() {
        if (scanStatus) {
            return (
                <div className="fileLoader" onClick={beginFingerprintScan}>
                    <img
                        src={buildBase64Template(scanStatus)}
                        alt={createAltText(scanStatus)}
                        className="SuperImage"
                        data-cy="fp-image"
                    />
                </div>
            );
        } else {
            return <FingerSelectionScreen isReadOnly={true} {...props} />;
        }
    }

    function renderChangeScreen() {
        return (
            <FingerSelectionScreen
                changeFingerSelection={changeFingerSelection}
                {...props}
            />
        );
    }

    function renderScanScreen() {
        return (
            <div className="flex-block">
                <Grid
                    container
                    className="fingerprint"
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    spacing={8}>
                    <Grid item>
                        <Typography
                            component="h2"
                            variant="h6"
                            gutterBottom
                            className="fingerprint-selection">
                            {props.t('FingerprintScan.text.place') + ' '}
                            <strong>
                                {buildFingerCaption(selectedFinger)}
                            </strong>
                            <br />
                            <a
                                data-cy="select-new-finger"
                                onClick={() => setSelectingNewFinger(true)}>
                                {props.t('FingerprintScan.text.useDifferentFinger')}
                            </a>
                            <br />
                        </Typography>
                    </Grid>
                    <Grid item>{buildSelectedFingerprint()}</Grid>
                    <Grid item>
                        <Typography
                            component="h2"
                            variant="h6"
                            className="fingerprint-selection">
                            <a
                                data-cy="recapture-fp"
                                className="enhanced"
                                href="#"
                                onClick={() => resetFingerprintImage()}>
                                {props.t('FingerprintScan.text.recaptureFingerprint')}
                            </a>
                            <br />
                        </Typography>
                    </Grid>
                    <Grid
                        container
                        className=""
                        direction="row"
                        justifyContent="center"
                        alignItems="center">
                        <Grid item>
                            <Button
                                data-cy="fpscan-back"
                                className="back"
                                onClick={() =>
                                    props.dispatch({
                                        type: FlowDispatchTypes.BACK
                                    })
                                }>
                                {`< BACK`}
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                data-cy="fpscan-next"
                                className="next"
                                onClick={(e: any) => beginRequest(e)}>
                                {props.t('Standard.next')}
                            </Button>
                        </Grid>
                    </Grid>
                    {dialogOpen && renderDialog()}
                </Grid>
            </div>
        );
    }

    function renderDialog() {
        return (
            <DialogContainer
                open={dialogOpen}
                clickFunction={setDialogOpen}
                complete={dialogComplete}
                success={dialogSuccess}
                errorMessage={processResultMessage}
                handleCancel={cancelEkycRequest || undefined}
                allowCancel={slowInternet}
                t={props.t}
            />
        );
    }

    if (selectingNewFinger) {
        return renderChangeScreen();
    } else {
        return renderScanScreen();
    }
}
