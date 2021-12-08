import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import ErrorIcon from '@material-ui/icons/Error';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import {ProofProfileProps} from '../interfaces/ConfirmationInterfaces';
import getDataFrom from '../helpers/getDataFrom';

export default function ProofProfileMenu(props: ProofProfileProps) {
    const [verificationRequired, setVerificationRequired] = useState<number>(0);
    const [proofOptions, setProofOptions] = useState<any[]>([]);
    const [proofsLoading, setProofsLoading] = useState<boolean>(true);
    const [proofOptionsError, setProofsOptionsError] = useState<string>('');

    const formatOptions = (data: any): any[] => {
        const ret: Array<any> = [];
        for (const schema_id in data) {
            ret.push({
                schema_id,
                ...data[schema_id]
            });
        }
        return ret;
    };

    useEffect(() => {
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

                props.setCredentialKeys(getDataFrom(proofOptions[0]));
            } catch (e: any) {
                setProofsOptionsError(e.message);
            } finally {
                setProofsLoading(false);
            }
        };

        getProofOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (event: React.ChangeEvent<{value: unknown}>) => {
        const index = Number((event.target as HTMLInputElement).value);
        const option = proofOptions[index];
        props.store.set('profile', option);

        props.setCredentialKeys(getDataFrom(option));
        setVerificationRequired(index);
    };

    if (proofOptionsError) {
        return (
            <div className="centered status-report">
                <ErrorIcon className="dialog-icon error" />
                <Typography
                    component="h2"
                    align="center"
                    className="error-description">
                    <strong>{props.t('Errors.proofs.profileFetchError')}</strong>
                    <br />
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
                    {props.t('ProofProfileMenu.text.loading')}
                </div>
            </div>
        );
    }

    return (
        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center">
            <Grid item>
                <FormControl className="form-control">
                    <InputLabel>{props.t('ProofProfileMenu.text.requirement')}</InputLabel>
                    <Select
                        className="verification-requirement-select"
                        value={verificationRequired}
                        onChange={handleChange}>
                        {proofOptions.map((option, index) => {
                            return (
                                <MenuItem value={index} key={index}>{`${
                                    index + 1
                                } - ${option.comment}`}</MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </Grid>
            
        </Grid>
    );
}