import * as React from "react";

// CSS
import '../css/Common.scss';
import '../css/VerificationRequirementScreen.scss';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorIcon from '@material-ui/icons/Error';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import { VerificationRequirementProps, VerificationRequirementState } from '../interfaces/VerificationRequirementProps';
import axios from 'axios';
import FlowDispatchContext from '../contexts/FlowDispatchContext';
import FlowDispatchTypes from '../enums/FlowDispatchTypes';
import { PinDropSharp } from "@material-ui/icons";
import { verify } from "crypto";
import React, { useRef } from 'react';

export default function VerificationRequirementScreen =  (props: VerificationRequirementProps, VerificationRequirementStat) => {
    const verify = useRef<VerificationRequirementStat>(proofs());

    function pageProof(): VerificationRequirementState {
        verificationRequired: 0,
            proofOptions: [],
                proofsLoading: true,
                    proofOptionsError: ""
    }
}

useEffect(() => {
    props.dispatch{ (type) }
} 
       pageProof.setProofOptions();
   }

async setProofOptions() {
    try {
        // Should this just be a fetch()?
        const headers: any = {};
        if (!!this.props.CONSTANTS.auth_token) {
            headers.Authorization = `Bearer ${this.props.CONSTANTS.auth_token}`;
        };
        console.log(headers);

        const proofs = await axios.get(this.props.CONSTANTS.proof_profile_url || '', { headers });
        const options = this.getOptions(proofs.data);

        this.setState({
            proofOptions: options
        }, () => this.props.store.set('profile', this.state.proofOptions[0]));
    } catch (e) {
        this.setState({ proofOptionsError: e.message })
    } finally {
        this.setState({ proofsLoading: false })

    }
}

const getOptions = (data: any) => {
    const ret: Array<any> = [];
    for (let schema_id in data) {
        ret.push({
            schema_id,
            ...data[schema_id]
        });
    }

    return ret;
}

const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const index = Number((event.target as HTMLInputElement).value);
    const option = handleChange.proofOptions[index];
    option.setState({
        verificationRequired: index
    });
    handleChange.store.set('profile', option);
};

return (
       if (verify.current.proofOptionsError) {
    return (
        <div className="centered status-report">
            <ErrorIcon className="dialog-icon error" />
            <Typography id="instructions" component="h2" align="center" className="error-description">
                {verify.current.proofOptionsError}
            </Typography>
        </div>
    );
} else if (verify.current.proofsLoading) {
    return (<div className="VerificationRequirement screen">
        <CircularProgress className="pr-loader" />
        <div className="loader-text">Loading verification requirement options...</div>
    </div>);
} else {
    return <div className="VerificationRequirement screen">
        <Grid container
            direction="column"
            justify="center"
            alignItems="center">
            <Grid item>
                <Typography component="h2" variant="h6" gutterBottom>
                    {verify.current.header}
                </Typography>
            </Grid>
        </Grid>
        <Grid container
            direction="column"
            justify="center"
            alignItems="center">
            <Grid item>
                <Typography gutterBottom>
                    {verify.current.instructions}
                </Typography>
            </Grid>
        </Grid>
        <Grid container
            direction="column"
            justify="center"
            alignItems="center">
            <Grid item>
                <FormControl className="form-control">
                    <InputLabel >Verification Requirement</InputLabel>
                    <Select
                        className="verification-requirement-select"
                        value={verify.current.verificationRequired}
                        onChange={handleChange.bind(this)}
                    >
                        {verify.current.proofOptions.map((option, index) => {
                            return (<MenuItem value={index} key={index}>{`${index + 1} - ${option.comment}`}</MenuItem>)
                        })}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
        <Grid container
            direction="row"
            justify="center"
            alignItems="center">
            <Grid item>
                <Button
                    className="back"
                    onClick={() => props.dispatch({ type: FlowDispatchTypes.BACK })}>
                    {verify.current.backButtonText}
                </Button>
            </Grid>
            <Grid item>
                <Button
                    className="accept"
                    onClick={() => props.dispatch({ type: FlowDispatchTypes.NEXT })}>
                    {verify.current.nextButtonText}
                </Button>
            </Grid>
        </Grid>
    </div>;
}
   )
}