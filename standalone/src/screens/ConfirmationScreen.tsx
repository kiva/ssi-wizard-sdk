import Grid from '@material-ui/core/Grid';
import * as React from 'react';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import '../css/Common.scss';
import '../css/ConfirmationScreen.scss';

import {
    CredentialKeyFieldsProps,
    CredentialKeyFieldState,
    ConfirmationProps
} from '../interfaces/ConfirmationInterfaces';

import FlowDispatchTypes from '../enums/FlowDispatchTypes';

export default function ConfirmationScreen(props: ConfirmationProps) {
    return (
        <div className="Confirmation screen">
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center">
                <Grid item>
                    <Typography component="h2" variant="h6" gutterBottom>
                        {props.reviewText}
                    </Typography>
                </Grid>
            </Grid>
            <div className="legal-terms-section">
                <div className="legal-terms1">
                    <p>{props.agreement}</p>

                    <p>{props.info_includes}</p>
                </div>
                <PII fields={props.CONSTANTS.credentialKeyMap} />
            </div>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center">
                <Grid item>
                    <Button
                        className="accept"
                        onClick={() =>
                            props.dispatch({
                                type: FlowDispatchTypes.NEXT
                            })
                        }>
                        {props.buttonText}
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}

function PII(props: CredentialKeyFieldsProps) {
    const labels: CredentialKeyFieldState = delegateLabels();

    function delegateLabels(): CredentialKeyFieldState {
        const columnOne: string[] = [];
        const columnTwo: string[] = [];
        const fields = props.fields;

        let i = 0;
        for (const field in fields) {
            const currentArray = i % 2 === 0 ? columnOne : columnTwo;
            currentArray.push(fields[field].name);
            i++;
        }

        return {columnOne, columnTwo};
    }

    return (
        <div className="legal-terms2">
            <ul>
                {labels.columnOne.map(field => {
                    return <li key={field}>{field}</li>;
                })}
            </ul>
            <ul>
                {labels.columnTwo.map(field => {
                    return <li key={field}>{field}</li>;
                })}
            </ul>
        </div>
    );
}
