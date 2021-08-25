import React, {useRef} from 'react';
import {DataGrid, GridColDef} from '@material-ui/data-grid';
import {CredentialKeyMap} from '../interfaces/ConfirmationInterfaces';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ICommonProps from '../interfaces/ICommonProps';
import FlowDispatchTypes from '../enums/FlowDispatchTypes';

interface Row {
    id: number;
    key: string;
}

export default function RegistrationUserTable(props: ICommonProps) {
    const tableData = useRef(createRows());

    function createRows() {
        const CredentialData: CredentialKeyMap =
            props.CONSTANTS.credentialKeyMap;
        const rows: Row[] = [];
        const columns: GridColDef[] = [];
        const numRows = 4;

        Object.keys(CredentialData).forEach((key: string) => {
            columns.push({
                field: key,
                headerName: CredentialData[key].name,
                width: 130
            });
            for (let i = 0; i < numRows; i++) {
                const nextRow = {
                    id: i,
                    key
                };
                rows.push(nextRow);
            }
        });

        return {rows, columns};
    }

    return (
        <Grid container justifyContent="center">
            <div style={{width: '90%'}}>
                <Grid container justifyContent="space-between">
                    <Typography
                        component="h2"
                        variant="h4"
                        style={{display: 'inline-block'}}>
                        {props.t('RegistrationTable.buttons.entries')}
                    </Typography>
                    <Button
                        className="accept"
                        onClick={() =>
                            props.dispatch({type: FlowDispatchTypes.RESTART})
                        }>
                        + {props.t('RegistrationTable.buttons.registerNewEntry')}
                    </Button>
                </Grid>
                <div style={{height: 400, width: '100%'}}>
                    <DataGrid
                        rows={tableData.current.rows}
                        columns={tableData.current.columns}
                        pageSize={5}
                    />
                </div>
            </div>
        </Grid>
    );
}
