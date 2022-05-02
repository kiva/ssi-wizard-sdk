import React, { useContext, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import '../css/Common.scss';
import '../css/DialogBody.scss';

import { DialogBodyProps } from '../interfaces/DialogInterfaces';
import TranslationContext from '../contexts/TranslationContext';

export default function DialogBody(props: DialogBodyProps) {
    const t = useContext(TranslationContext);
    const [showCancelDialog, setShowCancelDialog] = useState<
        boolean | undefined
    >(props.allowCancel);

    useEffect(() => {
        setShowCancelDialog(props.allowCancel);
    }, [props.allowCancel]);

    function renderInProgress() {
        return (
            <div className="DialogBody">
                <Typography
                    component="h2"
                    variant="h4"
                    gutterBottom
                    className="dialog-title">
                    {t('Standard.verifying')}
                </Typography>
                <div>
                    <CircularProgress className="dialog-icon verifying" />
                </div>
            </div>
        );
    }

    function renderCancel() {
        return (
            <div className="DialogBody">
                <ErrorIcon className="dialog-icon warning" />
                <div className="DialogBodyErrorMessage">
                    {t('Dialog.text.slowInternetWarning')}
                </div>
                <div className="buttonListNew row tight">
                    <Button
                        onClick={props.cancel}
                        id="cancel-request"
                        data-cy="cancel">
                        {t('Dialog.buttons.tryAgain')}
                    </Button>
                    <Button
                        onClick={() => setShowCancelDialog(false)}
                        data-cy="continue"
                        id="continue-request">
                        {t('Standard.continue')}
                    </Button>
                </div>
            </div>
        );
    }

    function renderSuccess() {
        return (
            <div className="DialogBody">
                <Typography
                    component="h2"
                    variant="h4"
                    gutterBottom
                    className="dialog-title">
                    {t('Dialog.text.idVerified')}
                </Typography>
                <CheckCircleIcon className="dialog-icon verified" />
            </div>
        );
    }

    function renderError(buttonText?: string) {
        return (
            <div className="DialogBody">
                <ErrorIcon className="dialog-icon error" />
                <div className="DialogBodyErrorMessage">
                    {props.errorMessage}
                </div>
                <Button
                    onClick={() => props.clickFunction(false)}
                    data-cy="dialog-button"
                    className="error">
                    {buttonText || t('Standard.continue')}
                </Button>
            </div>
        );
    }

    if (props.errorMessage) {
        return renderError(t('Dialog.buttons.tryAgain'));
    }
    if (!props.complete) {
        if (showCancelDialog) {
            return renderCancel();
        } else {
            return renderInProgress();
        }
    } else {
        if (props.success) {
            return renderSuccess();
        } else {
            return renderError();
        }
    }
}
