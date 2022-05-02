/* eslint-disable jsx-a11y/anchor-is-valid */

import { useState, useEffect, useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import toast from 'react-hot-toast';
import { FlowDispatchTypes } from '@kiva/ssirius-react';
import '../../css/Common.scss';
import '../../css/RejectionScreen.scss';
import './css/ScanFingerprintScreen.scss';

import FingerSelectionScreen from '../FingerSelectionScreen';
import DialogContainer from '../../components/DialogContainer';

import { FPScanProps, RejectionReport } from './interfaces/ScanFingerprintInterfaces';

import failed from './images/np_fingerprint_failed.png';
import success from './images/np_fingerprint_verified.png';
import in_progress from './images/np_fingerprint_inprogress.png';
import TranslationContext from '../../contexts/TranslationContext';
import RejectionScreen from '../../components/RejectionScreen';

const FINGER_STORE = 'selectedFinger';
const NoRejection: RejectionReport = {
    rejected: false,
    reason: ""
};

export default function ScanFingerprintScreen(props: FPScanProps) {
    const t = useContext(TranslationContext);
    const SLOW_INTERNET_THRESHOLD: number =
        props.CONSTANTS.slowInternetThreshold || (process.env.SLOW_INTERNET_THRESHOLD && parseInt(process.env.SLOW_INTERNET_THRESHOLD)) || 10000;
    const SDK = props.guardianSDK;
    const FPScanner = props.scanner;

    
    const [selectedFinger, setSelectedFinger] = useState<string>(
        props.store.get(FINGER_STORE, props.defaultFinger)
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
    const [rejection, setRejection] = useState<RejectionReport>(NoRejection);

    const resetFingerprintImage = () => {
        console.log('Resetting...')
        setFingerprintImage('');
        setScanStatus('progress');
        beginFingerprintScan();
    };

    useEffect(() => {
        resetFingerprintImage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleScannerFailure = (e: any) => {
        const msg = 'string' === typeof e ? e : e.message;
        setProcessResultMessage(msg);
        if (FPScanner.isErrorPersistent()) {
            setRejection({
                rejected: true,
                reason: msg
            });
        } else {
            updateFingerprintState('', {});
        }
    };

    const getImageFromFingerprintScanner = async (): Promise<void> => {
        if (FPScanner.isScanInProgress()) return notifyScanInProgress();

        try {
            const data: string = await FPScanner.getFingerprint();
            const deviceInfo: any = await FPScanner.getDeviceInfo();

            setRejection(NoRejection);
            updateFingerprintState(data, deviceInfo);
        } catch (e: any) {
            console.log(e);
            handleScannerFailure(e);
        }
    };

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

    function buildFingerCaption(fingerType: string): string {
        return t(`Fingers.${fingerType}_full`, {
            finger: t('Fingers.finger')
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
        if ('failed' === scanStatus) {
            toast.error(t('Errors.fingerprint.fpNotCaptured'), {
                duration: 3000
            });
        } else {
            setDialogComplete(false);
            setDialogOpen(true);
            setDialogSuccess(false);
            setProcessResultMessage('');
            makeRequest();
        }
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

    // TODO: Break up this method - it's too big
    async function makeRequest(): Promise<void> {
        let slowInternetWarning;
        try {
            slowInternetWarning = setTimeout(() => {
                setSlowInternet(true);
            }, SLOW_INTERNET_THRESHOLD);

            const body: any = props.getPostBody(fingerPrintImage, translateFingertype(selectedFinger), deviceInfo, props.store.get);

            const response = await SDK.fetchKyc(
                body,
                props.CONSTANTS.auth_token
            );
            setDialogSuccess(true);
            setDialogComplete(true);
            setProcessResultMessage('');

            handleEkycSuccess(response);
        } catch (errorMessage: any) {
            console.error('Error -> ' + errorMessage);
            setDialogSuccess(false);
            setDialogComplete(true);
            setProcessResultMessage(t('Errors.fingerprint.noCitizenFound'));
        } finally {
            if (slowInternetWarning) {
                clearTimeout(slowInternetWarning);
                setSlowInternet(false);
            }
        }
    }

    function notifyScanInProgress() {
        toast.error(t('Errors.fingerprint.scanInProgress'), {
            duration: 3000
        });
    }

    function handleEkycSuccess(personalInfo: any) {
        setTimeout(() => {
            setDialogOpen(false);
            props.store.set('personalInfo', personalInfo);
            props.dispatch({ type: FlowDispatchTypes.NEXT });
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
        setScanStatus('progress');
        getImageFromFingerprintScanner();
    }

    function updateFingerprintState(fpImage: string, deviceInfo: any): void {
        if (!fpImage) {
            setScanStatus('failed');
            setFingerprintImage('');
        } else {
            setScanStatus('success');
            setFingerprintImage(fpImage);
            setDeviceInfo(deviceInfo);
            setProcessResultMessage('');
            setRejection(NoRejection);
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

    function renderRejectionScreen() {
        return (
            <RejectionScreen
                rejection={rejection}
                scanner={FPScanner}
                closeMethod={() => resetFingerprintImage()}
            />
        );
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
                    alignItems="center">
                    <Grid item>
                        <Typography
                            component="h2"
                            variant="h6"
                            className="fingerprint-selection">
                            {t('FingerprintScan.text.place') + ' '}
                            <strong>
                                {buildFingerCaption(selectedFinger)}
                            </strong>
                            <br />
                        </Typography>
                    </Grid>
                    <Grid item>{buildSelectedFingerprint()}</Grid>
                    <Grid item>
                        <Grid container spacing={4}>
                            <Grid item>
                                <a
                                    data-cy="select-new-finger"
                                    onClick={() => setSelectingNewFinger(true)}>
                                    {t('FingerprintScan.text.useDifferentFinger')}
                                </a>
                            </Grid>
                            <Grid item>
                                <a
                                    data-cy="recapture-fp"
                                    className="enhanced"
                                    href="#"
                                    onClick={() => resetFingerprintImage()}>
                                    {t('FingerprintScan.text.recaptureFingerprint')}
                                </a>
                            </Grid>
                        </Grid>
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
                                {t('Standard.next')}
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
            />
        );
    }

    if (selectingNewFinger) {
        return renderChangeScreen();
    } else if(rejection.rejected) {
        return renderRejectionScreen();
    } else {
        return renderScanScreen();
    }
}
