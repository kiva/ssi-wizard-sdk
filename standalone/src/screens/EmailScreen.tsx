import React, {useState} from 'react';
import toast from 'react-hot-toast';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';

import FlowDispatchTypes from '../enums/FlowDispatchTypes';

import {EmailProps} from '../interfaces/EmailInterfaces';

import '../css/Common.scss';
import '../css/Email.scss';

export default function EmailScreen(props: EmailProps) {
    const [email, setEmail] = useState<string>(props.store.get('email', ''));

    const handleInputChange = () => (e: any) => {
        const email: string = e.target.value;
        props.store.set('email', email);
        setEmail(email);
    };

    const proceed = () => (e: any) => {
        e.preventDefault();
        if (!email) {
            toast.error(props.t('Errors.email.noInput'), {
                duration: 3000
            });
        } else {
            props.dispatch({type: FlowDispatchTypes.NEXT});
        }
    };

    return (
        <div data-cy="standard-search" className="flex-block">
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center">
                <Grid item>
                    <Typography component="h2" variant="h6" gutterBottom>
                        {props.t('Email.text.instructions')}
                    </Typography>
                </Grid>
                <form name="ekycIdForm">
                    <Grid item>
                        <FormControl id="test">
                            <TextField
                                id="email-input"
                                data-cy="email-input"
                                label={email.trim() === '' ? props.t('Email.text.placeHolder') : ''}
                                value={email}
                                onChange={handleInputChange()}
                                inputProps={{'aria-label': 'bare'}}
                                margin="normal"
                                name="inputId"
                            />
                        </FormControl>
                    </Grid>
                    <div className="buttonListNew together loose">
                        <Button
                            className="secondary"
                            id="back"
                            onClick={() =>
                                props.dispatch({
                                    type: FlowDispatchTypes.BACK
                                })
                            }>
                            {props.t('Standard.back')}
                        </Button>
                        <Button
                            type="submit"
                            id="continue"
                            onClick={proceed()}
                            onSubmit={proceed()}>
                            {props.t('Standard.continue')}
                        </Button>
                    </div>
                </form>
            </Grid>
        </div>
    );
}
