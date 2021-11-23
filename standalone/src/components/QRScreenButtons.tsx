import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

export interface QRButtonProps {
    onClickBack(): void;
    backText: string;
}

export function QRScreenButtons(props: QRButtonProps) {
    return (
        <Grid
            container
            className="qrButtons buttonListNew row"
            direction="row"
            justifyContent="center"
            alignItems="center">
            <Grid item>
                <Button
                    data-cy="qr-back"
                    className="back"
                    onClick={props.onClickBack}>
                    {props.backText}
                </Button>
            </Grid>
        </Grid>
    );
}
