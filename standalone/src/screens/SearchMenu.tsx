import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {toast} from 'react-hot-toast';

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
    const [filters, setFilters] = useState<SearchInputData>(
        props.store.get('filters', {
            type: Object.keys(props.dropdownConfig)[0],
            value: ''
        })
    );
    const [error, setError] = useState(false);
    const [errorReason, setErrorReason] = useState<string>('');
    const [searchType, setSearchType] = useState<string>('filters');

    const handleFieldChange =
        (filterKey: string) =>
        (event: any): void => {
            event.preventDefault();
            const value = event.target.value;
            const updatedFilters: SearchInputData = {
                ...props.store.get('filters', filters),
                [filterKey]: value
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
            toast.error('Please fill out the field', {
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
            props.dropdownConfig[filters.type];

        if (filterConfig.validation(filters.value)) {
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
                            {props.instructions}
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
                                        value={filters.type}
                                        onChange={handleFieldChange('type')}
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
                                            Select ID Type
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
                                            filters.value.trim() === ''
                                                ? props.placeholder
                                                : ''
                                        }
                                        value={filters.value}
                                        onChange={handleFieldChange('value')}
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
                                {props.nextText}
                            </Button>
                            <Button
                                className="secondary"
                                onClick={() => {
                                    console.log('Hello');
                                    props.dispatch({
                                        type: FlowDispatchTypes.BACK
                                    });
                                }}>
                                {props.backText}
                            </Button>
                            <a
                                id="alternate-search"
                                onClick={() => toggleSearchType()}>
                                {props.alternateSearchInstructions}
                            </a>
                        </div>
                    </form>
                </Grid>
            </div>
        );
    }

    return <AlternateSearch toggleSearchType={toggleSearchType} {...props} />;
}
