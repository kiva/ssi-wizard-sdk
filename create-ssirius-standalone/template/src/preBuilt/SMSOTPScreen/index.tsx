import * as React from 'react';
import toast from 'react-hot-toast';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css';

import GuardianSDK from '../../dataHelpers/GuardianSDK';
import FlowDispatchTypes from '../../enums/FlowDispatchTypes';

import {
    PhoneScreenProps,
    SMSData,
    SMSProps,
    OTPState,
    PhoneNumberInputProps,
    OTPInputProps,
    SMSStatusProps,
    SMSButtonProps,
    PhoneState,
    OTPInputState,
    OTPScreenProps,
    SMSPostBody
} from './interfaces/SMSOTPInterfaces';
import { ProofRequestProfile } from '../ConfirmationScreen/interfaces/ConfirmationInterfaces';

import './css/SMSOTPScreen.scss';
import '../../css/DialogBody.scss';
import '../../css/Common.scss';

const disabledFunction = () => {
    console.log('Please wait for the request to complete');
    return false;
};

export default class SMSOTPScreen extends React.Component<SMSProps, OTPState> {
    private email: string;
    private profile: ProofRequestProfile;

    public SDK: any = GuardianSDK.init({
        url: this.props.backendURL,
        auth_method: 'SMS'
    });

    constructor(props: SMSProps) {
        super(props);
        this.state = {
            phoneNumber: this.props.store.get('phoneNumber', ''),
            smsSent: this.props.store.get('smsSent', false),
            phoneScreen: this.props.store.get('phoneScreen', 'phoneInput')
        };

        this.email = this.props.store.get('email', '', this.props.email_step);
        this.profile = this.props.store.get(
            'profile',
            {
                comment: '',
                proof_request: {},
                schema_id: ''
            },
            'confirmation'
        );
    }

    setContainerState = (data: SMSData): void => {
        for (const key in data) {
            this.props.store.set(key, data[key]);
        }
        this.setState(data);
    };

    renderPhoneInput() {
        return (
            <PhoneNumberScreen
                phoneNumber={this.state.phoneNumber}
                setContainerState={this.setContainerState}
                smsSent={this.state.smsSent}
                email={this.email}
                profile={this.profile}
                store={this.props.store}
                auth_token={this.props.CONSTANTS.auth_token}
                phoneIntls={this.props.phoneIntls}
                dispatch={this.props.dispatch}
                t={this.props.t}
                SDK={this.SDK}
            />
        );
    }

    renderOTPInput() {
        return (
            <OTPScreen
                phoneNumber={this.state.phoneNumber}
                email={this.email}
                smsSent={this.state.smsSent}
                setContainerState={this.setContainerState}
                profile={this.profile}
                store={this.props.store}
                auth_token={this.props.CONSTANTS.auth_token}
                phoneIntls={this.props.phoneIntls}
                dispatch={this.props.dispatch}
                t={this.props.t}
                SDK={this.SDK}
            />
        );
    }

    renderCurrentScreen() {
        switch (this.state.phoneScreen) {
            case 'phoneInput':
                return this.renderPhoneInput();
            case 'smsInput':
                return this.renderOTPInput();
            default:
                return '';
        }
    }

    otpFlowRender() {
        return (
            <div className="flex-block">
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center">
                    {this.renderCurrentScreen()}
                </Grid>
            </div>
        );
    }

    render() {
        return this.otpFlowRender();
    }
}

class PhoneNumberScreen extends React.Component<PhoneScreenProps, PhoneState> {
    constructor(props: PhoneScreenProps) {
        super(props);
        this.state = {
            phoneNumber: props.phoneNumber,
            error: '',
            requestInProgress: false
        };
    }

    handlePhoneNumberEnter = (keyCode: number): void => {
        if (keyCode === 13) {
            this.beginTwilioRequest();
        }
    };

    handlePhoneNumberChange = (input: string) => {
        this.setState({
            phoneNumber: '+' + input
        });
    };

    setPhoneNumberRequestBody(): SMSPostBody {
        return {
            profile: this.props.profile.schema_id,
            guardianData: {
                pluginType: 'SMS_OTP',
                filters: {
                    externalIds: {
                        companyEmail: this.props.email
                    }
                },
                params: {
                    phoneNumber: this.state.phoneNumber
                }
            },
            device: {}
        };
    }

    beginTwilioRequest = (): void => {
        if (this.state.phoneNumber) {
            const body: SMSPostBody = this.setPhoneNumberRequestBody();
            this.setState(
                {
                    requestInProgress: true
                },
                () => this.sendTwilioRequest(body)
            );
        } else {
            toast.error(this.props.t('Errors.input.missingPhoneNumber'), {
                duration: 3000
            });
        }
    };

    sendTwilioRequest = (body: any): void => {
        this.props.SDK.fetchKyc(body, this.props.auth_token)
            .then(() => {
                this.props.setContainerState({
                    smsSent: true,
                    phoneNumber: this.state.phoneNumber,
                    phoneScreen: 'smsInput'
                });
            })
            .catch((error: any) => {
                this.setState({
                    error,
                    requestInProgress: false
                });
            });
    };

    renderInProgress() {
        return (
            <div>
                <SMSStatus status="progress" t={this.props.t} />
                <SMSScreenButtons
                    onClickBack={() => disabledFunction}
                    onSubmit={() => disabledFunction}
                    t={this.props.t}
                />
            </div>
        );
    }

    renderInputScreen() {
        return (
            <div>
                <PhoneNumberInput
                    phoneNumber={this.state.phoneNumber}
                    handlePhoneNumberChange={this.handlePhoneNumberChange}
                    handleEnter={this.handlePhoneNumberEnter}
                    phoneIntls={this.props.phoneIntls}
                    t={this.props.t}
                />
                <SMSScreenButtons
                    onClickBack={() =>
                        this.props.dispatch({ type: FlowDispatchTypes.BACK })
                    }
                    onSubmit={() => this.beginTwilioRequest()}
                    t={this.props.t}
                />
            </div>
        );
    }

    renderErrorScreen() {
        return (
            <div>
                <SMSStatus status="error" errorText={this.state.error} t={this.props.t} />
                <SMSScreenButtons
                    onClickBack={() => {
                        this.setState({
                            error: ''
                        });
                    }}
                    onSubmit={() => disabledFunction}
                    t={this.props.t}
                />
            </div>
        );
    }

    renderPhoneScreen() {
        if (this.state.error) {
            return this.renderErrorScreen();
        } else if (this.state.requestInProgress) {
            return this.renderInProgress();
        } else {
            return this.renderInputScreen();
        }
    }

    render() {
        return this.renderPhoneScreen();
    }
}

class OTPScreen extends React.Component<OTPScreenProps, OTPInputState> {
    constructor(props: OTPScreenProps) {
        super(props);
        this.state = {
            otp: ['', '', '', '', '', ''],
            requestInProgress: false,
            smsError: '',
            idVerified: false
        };
    }

    getOtpValue = (): number => {
        if (this.hasValidOtp()) {
            return parseInt(this.state.otp.join(''));
        }
        return 0;
    };

    hasValidOtp = (): boolean => {
        return this.state.otp.every((digit: string) => {
            return !!digit.length && !isNaN(Number(digit));
        });
    };

    handleOTPEntry = (index: number, value: string): void => {
        const { otp } = this.state;
        if (index >= 0 && index < 6) {
            otp[index] = value;
        }

        this.setState({ otp });
    };

    handleEkycSuccess = (personalInfo: any) => {
        this.props.store.set('personalInfo', personalInfo);
        setTimeout(() => {
            this.props.dispatch({ type: FlowDispatchTypes.NEXT });
        }, 1000);
    };

    setOTPPostBody(): SMSPostBody {
        return {
            profile: this.props.profile.schema_id,
            guardianData: {
                pluginType: 'SMS_OTP',
                filters: {
                    externalIds: {
                        companyEmail: this.props.email
                    }
                },
                params: {
                    otp: this.getOtpValue()
                }
            },
            device: {}
        };
    }

    beginTwilioRequest = (): void => {
        if (this.hasValidOtp()) {
            const body: SMSPostBody = this.setOTPPostBody();
            this.setState(
                {
                    requestInProgress: true
                },
                () => this.sendTwilioRequest(body)
            );
        } else {
            toast.error(this.props.t('Errors.input.invalidOTP'), {
                duration: 3000
            });
        }
    };

    sendTwilioRequest = async (body: any): Promise<void> => {
        try {
            const data = await this.props.SDK.fetchKyc(body, this.props.auth_token);
            this.setState(
                {
                    requestInProgress: false,
                    idVerified: true
                },
                () => this.handleEkycSuccess(data)
            );
        } catch (smsError: any) {
            this.setState({
                smsError,
                requestInProgress: false
            });
        }
    };

    goToPhoneInput() {
        this.props.setContainerState({
            phoneNumber: this.props.phoneNumber,
            smsSent: true,
            phoneScreen: 'phoneInput'
        });
    }

    handleErrorBack = (): void => {
        if (this.state.smsError === this.props.specificError) {
            this.setState({
                smsError: '',
                requestInProgress: false
            });
        } else {
            this.props.setContainerState({
                phoneNumber: '',
                phoneScreen: 'phoneInput',
                smsSent: false
            });
        }
    };

    renderOTPInputScreen() {
        return (
            <div>
                <Grid item>
                    <Typography
                        component="h2"
                        variant="h6"
                        gutterBottom
                        align="center">
                        {this.props.t('SMSOTP.text.otpEntryInstructions')}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography id="instructions" component="h2" align="center">
                        {this.props.t('SMSOTP.text.messageSentTo')}
                        <br />
                        {`${this.props.phoneNumber}`}
                    </Typography>
                </Grid>
                <OTPInput handleOTPEntry={this.handleOTPEntry} />
                <SMSScreenButtons
                    onClickBack={() => this.goToPhoneInput()}
                    onSubmit={() => this.beginTwilioRequest()}
                    t={this.props.t}
                />
            </div>
        );
    }

    renderOTPErrorScreen() {
        return (
            <div>
                <SMSStatus status="error" errorText={this.state.smsError} t={this.props.t} />
                <SMSScreenButtons
                    onClickBack={() => this.handleErrorBack()}
                    onSubmit={() => disabledFunction}
                    t={this.props.t}
                />
            </div>
        );
    }

    renderInProgress() {
        return (
            <div>
                <SMSStatus status="verifying" t={this.props.t} />
                <SMSScreenButtons
                    onClickBack={() => disabledFunction}
                    onSubmit={() => disabledFunction}
                    t={this.props.t}
                />
            </div>
        );
    }

    renderVerified() {
        return (
            <div>
                <SMSStatus status="success" t={this.props.t} />
                <SMSScreenButtons
                    onClickBack={() => disabledFunction}
                    onSubmit={() => disabledFunction}
                    t={this.props.t}
                />
            </div>
        );
    }

    renderBody() {
        if (this.state.idVerified) {
            return this.renderVerified();
        } else if (this.state.requestInProgress) {
            return this.renderInProgress();
        } else if (this.state.smsError) {
            return this.renderOTPErrorScreen();
        } else {
            return this.renderOTPInputScreen();
        }
    }

    render() {
        return this.renderBody();
    }
}

class SMSScreenButtons extends React.Component<SMSButtonProps> {
    render() {
        return (
            <Grid
                container
                className="smsButtons buttonListNew row"
                direction="row"
                justify="center"
                alignItems="center">
                <Grid item>
                    <Button
                        data-cy="smsotp-back"
                        className="back"
                        onClick={this.props.onClickBack}>
                        {this.props.t('Standard.back')}
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        type="submit"
                        data-cy="fpscan-next"
                        id="sms-scan-verification-button"
                        className="next"
                        onSubmit={this.props.onSubmit}
                        onClick={this.props.onSubmit}>
                        {this.props.t('Standard.verify')}
                    </Button>
                </Grid>
            </Grid>
        );
    }
}

class SMSStatus extends React.Component<SMSStatusProps> {
    // TODO: A lot of this is duplicate code from DialogBody. It would be cool to have a single SOT for lightbox styles and use props for text fields.
    renderInProgress(text: string) {
        return (
            <div
                data-cy="sms-otp-in-progress"
                className="centered status-report">
                <CircularProgress className="dialog-icon verifying" />
                <Typography
                    component="h2"
                    variant="h4"
                    gutterBottom
                    className="status-text">
                    {text}
                </Typography>
            </div>
        );
    }

    renderError() {
        return (
            <div className="centered status-report">
                <ErrorIcon className="dialog-icon error" />
                <Typography
                    id="instructions"
                    component="h2"
                    align="center"
                    className="error-description">
                    {this.props.errorText}
                </Typography>
            </div>
        );
    }

    renderVerified() {
        return (
            <div className="centered status-report">
                <CheckCircleIcon className="dialog-icon verified" />
                <Typography
                    id="instructions"
                    component="h2"
                    align="center"
                    className="status-text">
                    {this.props.t('SMSOTP.text.successMessage')}
                </Typography>
            </div>
        );
    }

    renderBody() {
        const status: string = this.props.status;
        switch (status) {
            case 'progress':
                return this.renderInProgress('Request in progress...');
            case 'verifying':
                return this.renderInProgress('Verifying...');
            case 'error':
                return this.renderError();
            case 'success':
                return this.renderVerified();
            default:
                return '';
        }
    }

    render() {
        return this.renderBody();
    }
}

class OTPInput extends React.Component<OTPInputProps> {
    focusOn = (el: HTMLElement | null) => {
        el && el.focus();
    };

    handleEntry =
        (index: number) =>
            (event: any): void => {
                if (index >= 0 && index < 5) {
                    this.focusOn(document.getElementById('otp-digit-' + (index + 1)))
                } else if (index === 5) {
                    this.focusOn(document.getElementById('sms-scan-verification-button'));
                }
                this.props.handleOTPEntry(index, event.target.value);
            };

    render() {
        return (
            <div>
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center">
                    <FormControl id="otp-row">
                        <TextField
                            autoFocus={true}
                            className="otp-digit-input"
                            label=""
                            variant="outlined"
                            onChange={this.handleEntry(0)}
                            inputProps={{
                                'aria-label': 'bare',
                                id: 'otp-digit-0'
                            }}
                            margin="normal"
                            name="otp-digit-0"
                        />
                        <TextField
                            className="otp-digit-input"
                            label=""
                            variant="outlined"
                            onChange={this.handleEntry(1)}
                            inputProps={{
                                'aria-label': 'bare',
                                id: 'otp-digit-1'
                            }}
                            margin="normal"
                            name="otp-digit-1"
                        />
                        <TextField
                            className="otp-digit-input"
                            label=""
                            variant="outlined"
                            onChange={this.handleEntry(2)}
                            inputProps={{
                                'aria-label': 'bare',
                                id: 'otp-digit-2'
                            }}
                            margin="normal"
                            name="otp-digit-2"
                        />
                        <TextField
                            className="otp-digit-input"
                            label=""
                            variant="outlined"
                            onChange={this.handleEntry(3)}
                            inputProps={{
                                'aria-label': 'bare',
                                id: 'otp-digit-3'
                            }}
                            margin="normal"
                            name="otp-digit-3"
                        />
                        <TextField
                            className="otp-digit-input"
                            label=""
                            variant="outlined"
                            onChange={this.handleEntry(4)}
                            inputProps={{
                                'aria-label': 'bare',
                                id: 'otp-digit-4'
                            }}
                            margin="normal"
                            name="otp-digit-4"
                        />
                        <TextField
                            className="otp-digit-input"
                            label=""
                            variant="outlined"
                            onChange={this.handleEntry(5)}
                            inputProps={{
                                'aria-label': 'bare',
                                id: 'otp-digit-5'
                            }}
                            margin="normal"
                            name="otp-digit-5"
                        />
                    </FormControl>
                </Grid>
            </div>
        );
    }
}

class PhoneNumberInput extends React.Component<PhoneNumberInputProps> {
    render() {
        return (
            <div>
                <Grid item>
                    <Typography
                        component="h2"
                        variant="h6"
                        gutterBottom
                        align="center">
                        {this.props.t('SMSOTP.text.phoneNoEntryInstructions')}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography id="instructions" component="h2" align="center">
                        {this.props.t('SMSOTP.text.smsDetails')}
                    </Typography>
                </Grid>
                <Grid item>
                    <PhoneInput
                        onlyCountries={
                            this.props.phoneIntls!.only
                                ? this.props.phoneIntls!.countries
                                : undefined
                        }
                        preferredCountries={
                            this.props.phoneIntls!.only
                                ? undefined
                                : this.props.phoneIntls!.countries
                        }
                        country={this.props.phoneIntls!.countries[0]}
                        inputClass="phone-number-input"
                        value={this.props.phoneNumber}
                        inputProps={{
                            name: 'phoneNoInput',
                            required: true,
                            autoFocus: true
                        }}
                        onChange={(phone: any) =>
                            this.props.handlePhoneNumberChange(phone)
                        }
                        onKeyDown={(event: any) =>
                            this.props.handleEnter(event.keyCode)
                        }
                    />
                </Grid>
            </div>
        );
    }
}
