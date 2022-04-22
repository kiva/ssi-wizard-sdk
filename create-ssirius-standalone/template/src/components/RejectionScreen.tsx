import {useContext, useState} from "react";

import Button from '@material-ui/core/Button';

import { RejectionProps } from "../preBuilt/ScanFingerprintScreen/interfaces/ScanFingerprintInterfaces";
import TranslationContext from '../contexts/TranslationContext';

import toast from "react-hot-toast";
import DialogContainer from "./DialogContainer";

export default function RejectionScreen(props: RejectionProps) {
    const t = useContext(TranslationContext);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const {reason} = props.rejection;
    const FPScanner = props.scanner;

    const handleButtonClick = async () => {
        await FPScanner.getDeviceInfo().then(response => {
            console.log(response);
            return props.closeMethod();
        }).catch(e => {
            console.log('Aloha');
            console.log(e);
            return dialogOpen ? renderToast() : setDialogOpen(true);
        });
    };

    function renderDialog() {
        return <DialogContainer
            open={dialogOpen}
            clickFunction={handleButtonClick}
            errorMessage={t('Errors.fingerprint.readerUndetected')}
            complete={!dialogOpen}
            success={!dialogOpen}
        />;
    }

    function renderToast() {
        toast.error(t('Errors.fingerprint.readerStillUndetected'), {
            duration: 5000
        });
    }

    return <div className="extraterrestrialLayer">
        <div id="error-text">
            {reason}
        </div>
        {dialogOpen && renderDialog()}
        <Button
            data-cy="restart-button"
            onClick={handleButtonClick}>
            {t('Standard.startAgain')}
        </Button>
    </div>;
}