import * as React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import '../css/Common.scss';
import '../css/DialogBody.scss';

import {DialogBodyProps} from '../interfaces/DialogInterfaces';

export default class DialogBody extends React.Component<DialogBodyProps> {
    renderInProgress() {
        return (
            <div className="DialogBody">
                <Typography
                    component="h2"
                    variant="h4"
                    gutterBottom
                    className="dialog-title">
                    Verifying...
                </Typography>
                <div>
                    <CircularProgress className="dialog-icon verifying" />
                </div>
            </div>
        );
    }

    renderCancel() {
        return (
            <div className="DialogBody">
                <ErrorIcon className="dialog-icon warning" />
                <div className="DialogBodyErrorMessage">
                    Your internet connection appears to be slow. You can
                    continue to wait, or cancel and try again.
                </div>
                <div className="buttonListNew row tight">
                    <Button
                        onClick={this.props.cancel}
                        id="cancel-request"
                        data-cy="cancel">
                        Try Again
                    </Button>
                    <Button
                        onClick={this.props.dismissCancel}
                        data-cy="continue"
                        id="continue-request">
                        Continue
                    </Button>
                </div>
            </div>
        );
    }

    renderSuccess() {
        return (
            <div className="DialogBody">
                <Typography
                    component="h2"
                    variant="h4"
                    gutterBottom
                    className="dialog-title">
                    ID Verified
                </Typography>
                <CheckCircleIcon className="dialog-icon verified" />
            </div>
        );
    }

    renderError(buttonText?: string) {
        return (
            <div className="DialogBody">
                <ErrorIcon className="dialog-icon error" />
                <div className="DialogBodyErrorMessage">
                    <div
                        dangerouslySetInnerHTML={{
                            __html: this.props.errorMessage || ''
                        }}
                    />
                </div>
                <Button
                    onClick={this.props.clickFunction}
                    data-cy="dialog-button"
                    className="error">
                    {buttonText || 'Continue'}
                </Button>
            </div>
        );
    }

    render() {
        if (this.props.rejection && this.props.errorMessage) {
            return this.renderError('Please try again');
        }
        if (!this.props.complete) {
            if (this.props.allowCancel) {
                return this.renderCancel();
            } else {
                return this.renderInProgress();
            }
        } else {
            if (this.props.success) {
                return this.renderSuccess();
            } else {
                return this.renderError();
            }
        }
    }
}
