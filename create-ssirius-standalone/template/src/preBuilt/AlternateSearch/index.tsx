import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import toast from 'react-hot-toast';

import '../../css/Common.scss';
import './css/AlternateSearch.scss';

import {
    AltSearchProps,
    AltSearchErrors,
    AltSearchInputData
} from './interfaces/AltSearchInterfaces';
import FlowDispatchTypes from '../../enums/FlowDispatchTypes';

export default function AlternateSearch(props: AltSearchProps) {
    const [searchParams, setSearchParams] = useState<AltSearchInputData>(
        props.store.get('search', {})
    );

    const [errors, setErrors] = useState<AltSearchErrors>({
        firstName: false,
        lastName: false,
        mothersFirstName: false,
        fathersFirstName: false,
        birthDate: false
    });
    const [rowOne, setRowOne] = useState<boolean>(!!searchParams.birthDate || false);
    const [rowTwo, setRowTwo] = useState<boolean>(!!searchParams.mothersFirstName || !!searchParams.fathersFirstName || false);

    function validateInputs(data: AltSearchInputData): boolean {
        let updatedErrors: any = {};
        for (const input in data) {
            const msg =
                input === 'birthDate'
                    ? validateBirthDate()
                    : validateInputText(input);
            if (msg) {
                updatedErrors[input] = msg;
            }
        }

        if (Object.keys(updatedErrors).length) {
            updatedErrors = Object.assign(errors, updatedErrors);
            setErrors(updatedErrors);
            return false;
        } else {
            return true;
        }
    }

    function validateDataRequirements(inputs: string[]): boolean {
        if (
            inputs.indexOf('firstName') === -1 ||
            inputs.indexOf('lastName') === -1
        ) {
            toast.error(props.t('Errors.input.missingNames'), {
                duration: 3000
            });
            return false;
        }

        if (
            inputs.indexOf('birthDate') > -1 ||
            inputs.indexOf('mothersFirstName') > -1 ||
            inputs.indexOf('fathersFirstName') > -1
        ) {
            return true;
        } else {
            toast.error(props.t('Errors.input.missingFuzzySearchData'), {
                duration: 7000
            });
            return false;
        }
    }

    function validateBirthDate(): any {
        const bday: string | undefined = searchParams.birthDate;
        if (bday && !Date.parse(bday)) {
            return props.t('Errors.input.dateInput');
        }

        // Input is valid
        return false;
    }

    function validateInputText(k: string): any {
        const inputValue: string | undefined = searchParams[k];
        if (!inputValue || inputValue.length <= 0 || inputValue.length > 50) {
            return props.t('Errors.input.inputLength', {
                minimum: 1,
                maximum: 50
            });
        }

        // Input is valid
        return false;
    }

    const processSearchParams = (params: AltSearchInputData) => {
        const filteredParams = deleteEmptyValues(params);
        props.store.set('search', filteredParams);
        setSearchParams(filteredParams);
    }

    const handleFieldChange =
        (filterKey: string) =>
            (event: any): void => {
                event.preventDefault();
                const updatedSearchParams: AltSearchInputData = {
                    ...props.store.get('search', searchParams),
                    [filterKey]: event.target.value
                };

                processSearchParams(updatedSearchParams);
            };

    function deleteEmptyValues(
        searchData: AltSearchInputData
    ): AltSearchInputData {
        const data = searchData;
        for (const k in data) {
            if (!data[k]) {
                delete data[k];
            }
        }
        return data;
    }

    const handleSubmission = () => (event: any) => {
        event.preventDefault();
        const data: AltSearchInputData = deleteEmptyValues(searchParams);
        const keys = Object.keys(data);

        if (validateInputs(data) && validateDataRequirements(keys)) {
            props.store.set('search', data);
            props.dispatch({ type: FlowDispatchTypes.NEXT });
        }
    };

    const handleRowClick = (rowState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]) => (): void => {
        const [row, setRow] = rowState;
        setRow(!row);
    };

    function generateRandomString() {
        const abc = "abcdefghijklmnopqrstuvwxyz";
        const ABC = abc.toUpperCase();
        const nums = "0123456789";
        const allChars = abc + ABC + nums;
        let ret = '';

        for (let i = 0; i < 11; i++) {
            ret += allChars[Math.floor(Math.random() * allChars.length)];
        }

        return ret;
    }

    // TODO:
    //     1) Figure out a way to break out form rows into their own component
    //     2) Add a fixed width to header text, because adding specific linebreaks will get tricky
    //     3) Figure out a scalable way to make the row toggling work i.e. not using specific indices
    return (
        <div data-cy="alternate-search" className="flex-block">
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center">
                <form name="ekycFuzzySearchForm">
                    <Grid item>
                        <Typography
                            id="instructions"
                            component="h2"
                            align="center">
                            {props.t('AlternateSearchScreen.text.fuzzySearchInstructions')}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography
                            component="h2"
                            variant="h6"
                            gutterBottom
                            align="center">
                            {props.t('AlternateSearchScreen.text.enterFirstAndLast', {
                                first: props.t('PII.firstName'),
                                last: props.t('PII.lastName')
                            })}
                        </Typography>
                    </Grid>
                    <Grid
                        container
                        className="alternate-search-row"
                        direction="row"
                        justify="space-around"
                        alignItems="center">
                        <Grid item xs={12} md={5}>
                            <TextField
                                className="inspectletIgnore alternate-search-field required"
                                data-cy="firstname-input"
                                label={props.t('PII.firstName')}
                                value={searchParams.firstName || ''}
                                onChange={handleFieldChange('firstName')}
                                inputProps={{ 'aria-label': 'bare' }}
                                margin="dense"
                                name="inputFirstname"
                                error={!!errors.firstName}
                                helperText={errors.firstName}
                            />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField
                                className="inspectletIgnore alternate-search-field required"
                                data-cy="lastname-input"
                                label={props.t('PII.lastName')}
                                value={searchParams.lastName || ''}
                                onChange={handleFieldChange('lastName')}
                                inputProps={{ 'aria-label': 'bare' }}
                                margin="dense"
                                name="inputLastname"
                                error={!!errors.lastName}
                                helperText={errors.lastName}
                            />
                        </Grid>
                    </Grid>
                    <Grid item onClick={handleRowClick([rowOne, setRowOne])}>
                        <Typography
                            data-cy="dob-row-header"
                            className={classNames({
                                expandable: true,
                                expanded: rowOne
                            })}
                            component="h2"
                            variant="h6"
                            align="center">
                            {props.t('AlternateSearchScreen.text.enterDob')}
                            <AccordionArrow
                                fontSize="large"
                                className={
                                    'accordion-arrow ' +
                                    (rowOne ? 'open' : 'closed')
                                }
                            />
                        </Typography>
                    </Grid>
                    <Grid
                        container
                        className={classNames({
                            'alternate-search-row': true,
                            labelled: true,
                            hidden: !rowOne
                        })}
                        direction="row"
                        justify="space-around"
                        alignItems="center">
                        <Grid item xs={12} md={5}>
                            <TextField
                                className="inspectletIgnore alternate-search-field"
                                data-cy="birthdate-input"
                                label={props.t('PII.birthDate')}
                                type="date"
                                value={searchParams.birthDate || ''}
                                onChange={handleFieldChange('birthDate')}
                                margin="dense"
                                name="inputBirthdate"
                                error={!!errors.birthDate}
                                helperText={errors.birthDate}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid item className="or" onClick={handleRowClick([rowTwo, setRowTwo])}>
                        <Typography
                            data-cy="parents-names-row-header"
                            className={classNames({
                                expandable: true,
                                expanded: rowTwo
                            })}
                            component="h2"
                            variant="h6"
                            align="center">
                            {props.t('AlternateSearchScreen.text.enterParentsNames')}
                            <AccordionArrow
                                fontSize="large"
                                className={
                                    'accordion-arrow ' +
                                    (rowTwo ? 'open' : 'closed')
                                }
                            />
                        </Typography>
                        <h3
                            data-cy="parents-names-subheader"
                            className={classNames({
                                'row-subheader': true,
                                'align-center': true,
                                hidden: !rowTwo
                            })}>
                            ({props.t('AlternateSearchScreen.text.requiredWithoutDob')})
                        </h3>
                    </Grid>
                    <Grid
                        container
                        className={classNames({
                            'alternate-search-row': true,
                            hidden: !rowTwo
                        })}
                        direction="row"
                        justify="space-around"
                        alignItems="center">
                        <Grid item xs={12} md={5}>
                            <TextField
                                className="inspectletIgnore alternate-search-field"
                                data-cy="mothersfirstname-input"
                                label={props.t('PII.motherName')}
                                value={searchParams.mothersFirstName || ''}
                                onChange={handleFieldChange('mothersFirstName')}
                                inputProps={{ 'aria-label': 'bare' }}
                                margin="dense"
                                name="inputMothersFirstName"
                                error={!!errors.mothersFirstName}
                                helperText={errors.mothersFirstName}
                            />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField
                                className="inspectletIgnore alternate-search-field"
                                data-cy="fathersfirstname-input"
                                label={props.t('PII.fatherName')}
                                value={searchParams.fathersFirstName || ''}
                                onChange={handleFieldChange('fathersFirstName')}
                                inputProps={{ 'aria-label': 'bare' }}
                                margin="dense"
                                name="inputFathersFirstName"
                                error={!!errors.fathersFirstName}
                                helperText={errors.fathersFirstName}
                            />
                        </Grid>
                    </Grid>
                    <div className="buttonListNew stack centered">
                        <Button
                            type="submit"
                            id="scan-fingerprint"
                            onClick={handleSubmission()}
                            onSubmit={handleSubmission()}>
                            {props.t('Standard.next')}
                        </Button>
                        <Button
                            className="back"
                            onClick={() => props.toggleSearchType()}>
                            {`< ${props.t('Standard.back')}`}
                        </Button>
                    </div>
                </form>
            </Grid>
        </div>
    );
}

function AccordionArrow(props: any) {
    if (props.className === 'accordion-arrow open') {
        return <ArrowDropUpIcon {...props} />;
    } else {
        return <ArrowDropDownIcon {...props} />;
    }
}
