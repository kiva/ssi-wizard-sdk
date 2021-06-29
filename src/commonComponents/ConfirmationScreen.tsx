import Grid from '@material-ui/core/Grid';
import * as React from "react";

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import '../css/Common.scss';
import '../css/ConfirmationScreen.scss';

import {CredentialKeyFieldsProps, CredentialKeyFieldState, ConfirmationProps} from '../interfaces/ConfirmationInterfaces';

import FlowDispatchContext from '../contexts/FlowDispatchContext';
import FlowDispatchTypes from '../enums/FlowDispatchTypes';

export default class ConfirmationScreen extends React.Component<ConfirmationProps> {

    static contextType = FlowDispatchContext;

    consent = (): void => {
        const dispatch = this.context();
        const type: string = FlowDispatchTypes.NEXT;
        dispatch({type});
    }

    render() {
        return <div className="Confirmation screen">
            <Grid container
                direction="column"
                justify="center"
                alignItems="center">
                <Grid item>
                    <Typography component="h2" variant="h6" gutterBottom>
                        {this.props.reviewText}
                    </Typography>
                </Grid>
            </Grid>
            <div className="legal-terms-section">
                <div className="legal-terms1">
                    <p>{this.props.agreement}</p>

                    <p>{this.props.info_includes}</p>
                </div>
                <PII fields={this.props.CONSTANTS.credentialKeyMap} />
            </div>
            <Grid container
                direction="row"
                justify="center"
                alignItems="center">
                <Grid item>
                    <Button
                        className="accept"
                        onClick={() => this.consent()}>
                        {this.props.buttonText}
                    </Button>
                </Grid>
            </Grid>
        </div>;
    }
}

class PII extends React.Component<CredentialKeyFieldsProps, CredentialKeyFieldState> {
    constructor(props: any) {
        super(props);
        this.state = this.delegateLabels();
    }

    delegateLabels(): CredentialKeyFieldState {
        const columnOne: string[] = [];
        const columnTwo: string[] = [];
        const fields = this.props.fields;

        let i = 0;
        for (let field in fields) {
            let currentArray = i % 2 === 0 ? columnOne : columnTwo;
            currentArray.push(fields[field].name);
            i++;
        }

        return {columnOne, columnTwo};
    }

    renderFields() {
        return (
            <div className="legal-terms2">
                <ul>{this.state.columnOne.map(field => {
                    return <li key={field}>{field}</li>
                })}</ul>
                <ul>{this.state.columnTwo.map(field => {
                    return <li key={field}>{field}</li>
                })}</ul>
            </div>
        );
    }

    render() {
        return this.renderFields();
    }
}