import Grid from '@material-ui/core/Grid';
import * as React from "react";

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import '../css/Common.scss';
import '../css/ConfirmationScreen.scss';

import { CredentialKeyFieldsProps, CredentialKeyFieldState, ConfirmationProps } from '../interfaces/ConfirmationInterfaces';

import FlowDispatchContext from '../contexts/FlowDispatchContext';
import FlowDispatchTypes from '../enums/FlowDispatchTypes';

import React, { useState, useRef } from 'react';

export default function ConfirmationScreen = (props: ConfirmationProps) => {
    const consent = (): void => {
        const type: string = FlowDispatchTypes.NEXT;
        props.dispatch({ type });
    };

    return (
        <div className="Confirmation screen">
            <Grid container
                direction="column"
                justify="center"
                alignItems="center">
                <Grid item>
                    <Typography component="h2" variant="h6" gutterBottom>
                        {consent.props.reviewText}
                    </Typography>
                </Grid>
            </Grid>
            <div className="legal-terms-section">
                <div className="legal-terms1">
                    <p>{consent.props.agreement}</p>

                    <p>{consent.props.info_includes}</p>
                </div>
                <PII fields={consent.props.CONSTANTS.credentialKeyMap} />
            </div>
            <Grid container
                direction="row"
                justify="center"
                alignItems="center">
                <Grid item>
                    <Button
                        className="accept"
                        onClick={() => consent()}>
                        {consent.props.buttonText}
                    </Button>
                </Grid>
            </Grid>
        </div>;
    );


    function PII = (props: CredentialKeyFieldProps, CredentialKeyFieldState) => {
        const labels = useRef<CredentialKeyFieldState>(delegateLabels());

        function delegateLabels(): CredentialKeyFieldState {
            const columnOne: string[] = [];
            const columnTwo: string[] = [];
            let i = 0;
            for (let field in fields) {
                let currentArray = i % 2 === 0 ? columnOne : columnTwo;
                currentArray.push(fields[field].name);
                i++;
                return { columnOne, columnTwo };
            };

            return (
                <div className="legal-terms2">
                    <ul>{labels.current.columnOne.map(field => {
                        return <li key={field}>{field}</li>
                    })}</ul>
                    <ul>{labels.current.columnTwo.map(field => {
                        return <li key={field}>{field}</li>
                    })}</ul>
                </div>
            );
        }
    }