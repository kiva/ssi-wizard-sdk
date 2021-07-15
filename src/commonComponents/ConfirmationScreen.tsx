import Grid from '@material-ui/core/Grid';
import React, {useState, useRef, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ErrorIcon from '@material-ui/icons/Error';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import '../css/Common.scss';
import '../css/ConfirmationScreen.scss';
import {
    CredentialKeyFieldsProps,
    CredentialKeyMap,
    CredentialKeyFieldState,
    ConfirmationProps, 
    ProofRequestProfile,
    RequestedAttributes
    
} from '../interfaces/ConfirmationInterfaces';
import axios from 'axios';
import FlowDispatchTypes from '../enums/FlowDispatchTypes';

export default function ConfirmationScreen(props: ConfirmationProps) {
    const [verificationRequired, setVerificationRequired] = useState<number>(0);
    const [proofOptions, setProofOptions] = useState<any[]>([]);
    const [proofsLoading, setProofsLoading] = useState<boolean>(true);
    const [proofOptionsError, setProofsOptionsError] = useState<string>('');
    let credentialInfo;

    const formatOptions = (data: any): any[] => {
        const ret: Array<any> = [];
        for (const schema_id in data) {
            ret.push({
                schema_id,
                ...data[schema_id]
            });
        }
        return ret;
    }
    const getProofOptions = async () => {
        try {
            const headers: any = {};
            if (!!props.CONSTANTS.auth_token) {
                headers.Authorization = `Bearer ${props.CONSTANTS.auth_token}`;
            }
            const proofs = await axios.get(
                props.CONSTANTS.proof_profile_url || '',
                {headers}
            );
            const proofOptions: any[] = formatOptions(proofs.data);
            props.store.set('profile', proofOptions[0]);

            setProofOptions(proofOptions);
            console.log(proofOptions);
        } catch (e) {
            setProofsOptionsError(e.message);
        } finally {
            setProofsLoading(false);
        }
    }

    useEffect(() => {
        credentialInfo = getDataFrom(proofOptions[verificationRequired]);
     },
    [proofOptions, verificationRequired]
    );

    const handleChange = (event: React.ChangeEvent<{value: unknown}>) => {
        const index = Number((event.target as HTMLInputElement).value);
        const option = proofOptions[index];
        props.store.set('profile', option);
        setVerificationRequired(index);
    }
    if (proofOptionsError) {
        return (
            <div className="centered status-report">
                <ErrorIcon className="dialog-icon error" />
                <Typography
                    id="instructions"
                    component="h2"
                    align="center"
                    className="error-description">
                    {proofOptionsError}
                </Typography>
            </div>
        );
    }
    if (proofsLoading) {
        return (
            <div className="VerificationRequirement screen">
                <CircularProgress className="pr-loader" />
                <div className="loader-text">
                    Loading verification requirement options...
                </div>
            </div>
        );
    }
    console.log(proofOptions[verificationRequired]);
    return (
        <div className="Confirmation screen">
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center">
                <Grid item>
                    <FormControl className="form-control">
                        <InputLabel>
                            Verification Requirement
                        </InputLabel>
                        <Select
                            className="verification-requirement-select"
                            value={verificationRequired}
                            onChange={handleChange}>
                            {proofOptions.map(
                                (option, index) => {
                                    return (
                                        <MenuItem
                                            value={index}
                                            key={index}>{`${
                                            index + 1
                                        } - ${
                                            option.comment
                                        }`}</MenuItem>
                                    );
                                }
                            )}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid
                container
                direction="column"
                justify="center"
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
                <PII fields={credentialInfo} />
            </div>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center">
                <Grid item>
                    <Button
                        className="accept"
                        onClick={() => props.dispatch({type: FlowDispatchTypes.NEXT})}>
                        {props.buttonText}
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
    function getDataFrom(info: ProofRequestProfile){
        console.log(info);
        const attributes: RequestedAttributes = info.proof_request.requested_attributes;
          let ret: CredentialKeyMap = {};
          for (let key in attributes) {
              ret[key] = {
                  name: attributes[key].name,
              }
          }
          return ret;
      }
}

function PII(props: CredentialKeyFieldsProps) {
    const labels = useRef<CredentialKeyFieldState>(delegateLabels());

    function delegateLabels(): CredentialKeyFieldState {
        const columnOne: string[] = [];
        const columnTwo: string[] = [];
        let i = 0;
        for (let field in props.fields) {
            let currentArray = i % 2 === 0 ? columnOne : columnTwo;
            currentArray.push(props.fields[field].name);
            i++;
        };
        return { columnOne, columnTwo };
    }

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
