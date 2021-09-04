/* eslint-disable jsx-a11y/anchor-is-valid */

import React, {useState, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import toast from 'react-hot-toast';

import '../css/Common.scss';
import '../css/SearchMenu.scss';

import AlternateSearch from './AlternateSearch';
import {
    DropdownConfigDefinition,
    SearchProps,
    SearchInputData
} from '../interfaces/SearchInterfaces';
import FlowDispatchTypes from '../enums/FlowDispatchTypes';

export default function SearchMenu(props: SearchProps) {
    const [externalId, setExternalId] = useState<string>(Object.keys(props.dropdownConfig)[0]);
    const [filters, setFilters] = useState<SearchInputData>(
        props.store.get('filters', {
            [externalId]: '',
        })
    );
    const [error, setError] = useState(false);
    const [errorReason, setErrorReason] = useState<string>('');
    const [searchType, setSearchType] = useState<string>(props.store.get('searchType', 'filters'));

    useEffect(() => {
        props.store.set('searchType', searchType);
    }, [searchType, props.store]);

    const handleInputChange = (event: any): void => {
            event.preventDefault();
            const value = event.target.value;
            const updatedFilters: SearchInputData = {
                ...props.store.get('filters', filters),
                [externalId]: value
            };
            setFilters(updatedFilters);
            props.store.set('filters', updatedFilters);
        };

    const toggleSearchType = () => {
        const type: string = props.store.get('searchType', searchType);
        if ('filters' === type) {
            props.store.set('filters', filters);
            setSearchType('search');
        } else if ('search' === type) {
            setSearchType('filters');
        }
    };

    const inputIsEmpty = (value: string) => {
        if (value && '' === value.trim()) {
            toast.error(props.t('Errors.input.emptyField'), {
                duration: 3000
            });
            return false;
        }
        return true;
    };

    const handleSubmission = (event: any): void => {
        event.preventDefault();

        if (!inputIsEmpty(filters.value)) return;

        const filterConfig: DropdownConfigDefinition =
            props.dropdownConfig[externalId];

        if (filterConfig.validation(filters[externalId])) {
            props.store.set('filters', filters);
            props.dispatch({type: FlowDispatchTypes.NEXT});
        } else {
            setError(true);
            setErrorReason(filterConfig.errorMsg);
        }
    };

    if ('filters' === searchType) {
        return (
            <div data-cy="standard-search" className="flex-block">
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center">
                    <Grid item>
                        <Typography component="h2" variant="h6" gutterBottom>
                            {props.t('SearchMenu.text.instructions')}
                        </Typography>
                    </Grid>
                    <form name="ekycIdForm">
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center">
                            <Grid item id="id-select-menu">
                                <FormControl variant="outlined">
                                    <Select
                                        value={externalId}
                                        onChange={(e: any) => setExternalId(e.target.value)}
                                        id="select-searchId"
                                        displayEmpty
                                        input={
                                            <OutlinedInput
                                                labelWidth={100}
                                                name="searchId"
                                                id="outlined-search-id"
                                            />
                                        }>
                                        <MenuItem value="none" disabled>
                                            {props.t('SearchMenu.text.selectID')}
                                        </MenuItem>
                                        {Object.entries(
                                            props.dropdownConfig
                                        ).map(config => {
                                            return (
                                                <MenuItem
                                                    key={config[0]}
                                                    value={config[0]}>
                                                    {config[1].name}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl>
                                    <TextField
                                        className="inspectletIgnore"
                                        id="id-input"
                                        data-cy="id-input"
                                        autoFocus={true}
                                        label={
                                            filters[externalId].trim() === ''
                                                ? props.t('SearchMenu.text.placeholder')
                                                : ''
                                        }
                                        value={filters.value}
                                        onChange={handleInputChange}
                                        inputProps={{'aria-label': 'bare'}}
                                        margin="normal"
                                        name="inputId"
                                        error={error}
                                        helperText={errorReason || ''}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <div className="buttonListNew stack together loose">
                            <Button
                                type="submit"
                                id="scan-fingerprint"
                                onClick={(e: any) => handleSubmission(e)}
                                onSubmit={(e: any) => handleSubmission(e)}>
                                {props.t('Standard.next')}
                            </Button>
                            <Button
                                className="secondary"
                                onClick={() => {
                                    props.dispatch({
                                        type: FlowDispatchTypes.BACK
                                    });
                                }}>
                                {props.t('Standard.back')}
                            </Button>
                            <a
                                id="alternate-search"
                                onClick={() => toggleSearchType()}>
                                {props.t('SearchMenu.text.alternateSearchInstructions')}
                            </a>
                        </div>
                    </form>
                </Grid>
            </div>
        );
    }

    return <AlternateSearch toggleSearchType={toggleSearchType} {...props} />;
}
