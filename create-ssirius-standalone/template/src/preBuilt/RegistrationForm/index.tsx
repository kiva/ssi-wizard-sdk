import React, { useContext, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import PhoneInput from 'react-phone-input-2';

import { CredentialKeyMap } from '../ConfirmationScreen/interfaces/ConfirmationInterfaces';
import {
    InputProps,
    RegistrationFormProps,
    ButtonProps
} from './interfaces/RegistrationFormInterfaces';

import FlowDispatchTypes from '../../enums/FlowDispatchTypes';

import '../../css/Common.scss';
import './css/RegistrationForm.scss';
import 'react-phone-input-2/lib/high-res.css';
import TranslationContext from '../../contexts/TranslationContext';

const REGISTRATION_STORE_KEY = 'registrationFormData';

export default function RegistrationForm(props: RegistrationFormProps) {
    const t = useContext(TranslationContext);
    const [credentialState, setCredentialState] = useState(
        props.store.get(REGISTRATION_STORE_KEY, {})
    );
    const CredentialKeys: CredentialKeyMap = props.CONSTANTS.credentialKeyMap;

    const setCredentialData = (data: any) => {
        const credentialCreationData = props.store.get(
            REGISTRATION_STORE_KEY,
            {}
        );
        props.store.set(REGISTRATION_STORE_KEY, {
            ...credentialCreationData,
            ...data
        });
        setCredentialState(props.store.get(REGISTRATION_STORE_KEY));
    };

    const handleInputChange = (inputField: any) => {
        const data: any = { ...props.store.get(REGISTRATION_STORE_KEY, {}) };
        data[inputField.currentTarget.id] =
            inputField.currentTarget.dataset.value ||
            inputField.currentTarget.value;
        setCredentialData(data);
    };

    const handleStringInput = (input: string, key: string, prefix?: string) => {
        const data: any = {};
        data[key] = `${prefix || ''}${input}`;
        setCredentialData(data);
    };

    const onPopulateForm = () => {
        const dataToInput = {
            firstName: 'First Name',
            lastName: 'Last Name',
            companyEmail: 'testEmail@kiva.org',
            phoneNumber: '+12345678909',
            currentTitle: 'Current Title',
            team: 'Team',
            hireDate: '1990-01-17',
            officeLocation: 'Office Location',
            type: 'Intern',
            endDate: '1990-01-17'
        };
        setCredentialData(dataToInput);
    };

    const formatCredentialData = () => {
        const data = props.store.get(REGISTRATION_STORE_KEY, {});
        const dates: any = {};
        for (const key in CredentialKeys) {
            if ('date' === CredentialKeys[key].dataType) {
                dates[key] = String(Math.round(Date.parse(data[key]) / 1000));
            }

            if ('NaN' === dates[key]) {
                dates[key] = `${dates[key]} -> (${t('Errors.formData.invalidDate')})`;
            }
        }
        setCredentialData(dates);
    };

    const handleSubmit = (event: any): boolean | undefined => {
        for (const key in CredentialKeys) {
            if ('photo~attach' === key || credentialState.hasOwnProperty(key)) {
                continue;
            }
            return false;
        }
        formatCredentialData();
        event.preventDefault();
        props.dispatch({ type: FlowDispatchTypes.NEXT });
    };

    return (
        <FormControl>
            <div data-cy="registration-form" className="registrationForm">
                <Grid
                    style={{
                        paddingTop: '30px'
                    }}
                    container
                    direction="row"
                    justify="space-around">
                    <Grid container justify="space-around">
                        <Typography component="h4" variant="h6">
                            {t('RegistrationForm.text.instructionsHeader')}
                        </Typography>
                    </Grid>
                    <Grid container justify="space-around">
                        {t('RegistrationForm.text.instructions')}
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container direction="row" justify="space-between">
                            {Object.keys(CredentialKeys).map(
                                (field: any, idx: any) => {
                                    if (
                                        CredentialKeys[field] &&
                                        CredentialKeys[field].dataType &&
                                        CredentialKeys[field].dataType !==
                                        'image/jpeg;base64'
                                    ) {
                                        return (
                                            <RegistrationInputField
                                                CredentialKeys={CredentialKeys}
                                                dataType={
                                                    CredentialKeys[field]
                                                        .dataType
                                                }
                                                name={
                                                    CredentialKeys[field].name
                                                }
                                                key={idx}
                                                setCredentialCreationData={
                                                    setCredentialData
                                                }
                                                handleInputChange={
                                                    handleInputChange
                                                }
                                                handleStringInput={
                                                    handleStringInput
                                                }
                                                inputField={field}
                                                dispatch={props.dispatch}
                                                store={props.store}
                                                phoneIntls={props.phoneIntls}
                                            />
                                        );
                                    } else {
                                        return '';
                                    }
                                }
                            )}
                        </Grid>
                    </Grid>
                </Grid>
                <RegistrationFormButtons
                    onClickBack={() =>
                        props.dispatch({ type: FlowDispatchTypes.BACK })
                    }
                    onPopulateForm={() => onPopulateForm()}
                    t={t}
                    onSubmit={(e: any) =>
                        handleSubmit(e)
                    }></RegistrationFormButtons>
            </div>
        </FormControl>
    );
}

function RegistrationInputField(props: InputProps) {
    const CredentialData: any = props.store.get(REGISTRATION_STORE_KEY, {});
    if (props.dataType === 'selection') {
        const renderMenuItems = () => {
            return props.CredentialKeys[props.inputField].options!.map(
                (option: string) => {
                    return (
                        <MenuItem
                            key={props.inputField}
                            value={option}
                            id={props.inputField}>
                            {option}
                        </MenuItem>
                    );
                }
            );
        };

        return (
            <Grid
                item
                xs={6}
                md={5}
                style={{
                    paddingTop: '30px'
                }}>
                <InputLabel htmlFor={props.inputField}>{props.name}</InputLabel>
                <Select
                    name={props.inputField}
                    key={props.inputField}
                    value={CredentialData[props.inputField] ?? ''}
                    fullWidth
                    onChange={(inputField: any) =>
                        props.handleInputChange(inputField)
                    }
                    id={`container-${props.inputField}`}
                    inputProps={{
                        id: props.inputField,
                        native: true
                    }}>
                    {renderMenuItems()}
                </Select>
            </Grid>
        );
    } else if (props.dataType === 'phoneNumber') {
        return (
            <Grid
                item
                xs={6}
                md={5}
                style={{
                    paddingTop: '30px'
                }}>
                <label htmlFor={props.inputField} id="phone-label">
                    {props.name}
                </label>
                <PhoneInput
                    onlyCountries={
                        props.phoneIntls.only
                            ? props.phoneIntls.countries
                            : undefined
                    }
                    preferredCountries={
                        props.phoneIntls.only
                            ? undefined
                            : props.phoneIntls.countries
                    }
                    country={props.phoneIntls.countries[0]}
                    inputClass="phone-number-input"
                    value={CredentialData[props.inputField] ?? ''}
                    inputProps={{
                        name: props.inputField,
                        id: props.inputField,
                        required: true
                    }}
                    onChange={(input: any) =>
                        props.handleStringInput(input, props.inputField, '+')
                    }
                />
            </Grid>
        );
    } else {
        return (
            <Grid
                item
                xs={6}
                md={5}
                style={{
                    paddingTop: '30px'
                }}>
                <label htmlFor={props.inputField}>
                    {props.CredentialKeys[props.inputField].name}
                </label>
                <TextField
                    type={props.dataType}
                    fullWidth
                    onChange={(inputField: any) =>
                        props.handleInputChange(inputField)
                    }
                    name={props.inputField}
                    id={props.inputField}
                    value={CredentialData[props.inputField] ?? ''}
                    required
                />
            </Grid>
        );
    }
}

function RegistrationFormButtons(props: ButtonProps) {
    const t = useContext(TranslationContext);
    return (
        <Grid
            id="dialog-box"
            container
            style={{
                paddingTop: '45px'
            }}
            direction="row"
            justify="space-around">
            <Grid item xs={6}>
                <Grid container direction="row" justify="space-around">
                    <Grid item>
                        <Button
                            data-cy="qr-back"
                            className="back"
                            onClick={props.onClickBack}>
                            {t('Standard.back')}
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            data-cy="populate-form"
                            className="back"
                            onClick={props.onPopulateForm}>
                            {t('RegistrationForm.buttons.populate')}
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            onClick={props.onSubmit}
                            onSubmit={props.onSubmit}
                            type="submit"
                            className="next">
                            {t('Standard.continue')}
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
