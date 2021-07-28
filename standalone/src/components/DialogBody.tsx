import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import '../css/Common.scss';
import '../css/DialogBody.scss';

import {DialogBodyProps} from '../interfaces/DialogInterfaces';

export default function DialogBody(props: DialogBodyProps) {
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
                    {props.verifyingText}
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
                    {props.slowInternetWarning}
                </div>
                <div className="buttonListNew row tight">
                    <Button
                        onClick={props.cancel}
                        id="cancel-request"
                        data-cy="cancel">
                        {props.tryAgainText}
                    </Button>
                    <Button
                        onClick={() => setShowCancelDialog(false)}
                        data-cy="continue"
                        id="continue-request">
                        {props.continueText}
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
                    {props.verificationNotice}
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
                    <div
                        dangerouslySetInnerHTML={{
                            __html: props.errorMessage || ''
                        }}
                    />
                </div>
                <Button
                    onClick={() => props.clickFunction(false)}
                    data-cy="dialog-button"
                    className="error">
                    {buttonText || props.continueText}
                </Button>
            </div>
        );
    }

    if (props.errorMessage) {
        return renderError(props.tryAgainText);
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