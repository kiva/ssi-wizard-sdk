/* eslint-disable jsx-a11y/anchor-is-valid */

import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {toast} from 'react-hot-toast';
import AlternateSearch from './AlternateSearch';

import '../css/Common.scss';
import '../css/SearchMenu.scss';

import {
    SearchProps,
    SearchState,
    SearchInputData
} from '../interfaces/SearchInterfaces';

import FlowDispatchContext from '../contexts/FlowDispatchContext';
import FlowDispatchTypes from '../enums/FlowDispatchTypes';

export default class SearchMenu extends React.Component<
    SearchProps,
    SearchState
> {
    static contextType = FlowDispatchContext;
    private dispatch: any;

    constructor(props: SearchProps) {
        super(props);
        this.state = {
            filters: this.props.store.get('filters', {
                type: 'filters',
                value: ''
            }),
            error: false,
            errorReason: '',
            altSearch: false
        };
    }

    componentDidMount() {
        this.dispatch = this.context();
    }

    toggleSearchType = () => {
        const altSearch: boolean = !this.state.altSearch;
        this.setState({altSearch});
    };

    handleFieldChange =
        (filterKey: string) =>
        (event: any): void => {
            event.preventDefault();
            const value = event.target.value;
            this.setState({
                filters: {
                    ...this.state.filters,
                    [filterKey]: value
                }
            });
        };

    switchToAltSearchMenu = () => {
        const filters: SearchInputData = this.state.filters;
        this.props.store.set('filters', filters);
        this.toggleSearchType();
    };

    handleSubmission =
        (stateData: any) =>
        (event: any): void => {
            event.preventDefault();
            const filters: SearchInputData = this.state.filters;
            if (filters.value && filters.value.trim() === '') {
                toast.error('Please enter text in the input field', {
                    duration: 3000
                });
                return;
            }

            const errorState: any = {
                error: true
            };
            if (
                filters.type === 'nationalId' &&
                !this.validateNIN(filters.value)
            ) {
                errorState['errorReason'] = 'Invalid NIN';
            } else if (
                filters.type === 'voterId' &&
                !this.validateVoterID(filters.value)
            ) {
                errorState['errorReason'] = 'Invalid Voter ID';
            }

            if (errorState.errorReason) {
                this.setState(errorState);
            } else {
                this.props.store.set('filters', filters);
                this.dispatch({type: FlowDispatchTypes.NEXT});
            }
        };

    validateVoterID(input: string): boolean {
        const voterIdDigits: string[] = input.split('');

        return (
            voterIdDigits.length === 7 &&
            voterIdDigits.every((n: string) => !isNaN(Number(n)))
        );
    }

    validateNIN(input: string): boolean {
        const parsed = input.match(/[A-Z0-9]/g);

        return !!parsed && parsed.length === 8 && input.length === 8;
    }

    renderSearch() {
        return (
            <div data-cy="standard-search" className="flex-block">
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center">
                    <Grid item>
                        <Typography component="h2" variant="h6" gutterBottom>
                            Please enter a valid ID in the field below
                        </Typography>
                    </Grid>
                    <form name="ekycIdForm">
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center">
                            <Grid item id="id-select-menu">
                                <FormControl variant="outlined">
                                    <Select
                                        value={this.state.filters.type}
                                        onChange={this.handleFieldChange(
                                            'type'
                                        )}
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
                                            ID
                                        </MenuItem>
                                        <MenuItem value={'nationalId'}>
                                            <div className="id-type">NIN</div>
                                        </MenuItem>
                                        <MenuItem value={'voterId'}>
                                            <div className="id-type">
                                                Voter ID
                                            </div>
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl>
                                    <TextField
                                        className="inspectletIgnore"
                                        data-cy="id-input"
                                        label={
                                            this.state.filters.value.trim() ===
                                            ''
                                                ? 'Enter a value'
                                                : ''
                                        }
                                        value={this.state.filters.value}
                                        onChange={this.handleFieldChange(
                                            'value'
                                        )}
                                        inputProps={{'aria-label': 'bare'}}
                                        margin="normal"
                                        name="inputId"
                                        error={!!this.state.error}
                                        helperText={
                                            this.state.errorReason || ''
                                        }
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <div className="buttonListNew stack together loose">
                            <Button
                                type="submit"
                                id="scan-fingerprint"
                                onClick={this.handleSubmission(
                                    this.props.filters
                                )}
                                onSubmit={this.handleSubmission(
                                    this.props.filters
                                )}>
                                Scan
                            </Button>
                            <Button
                                className="secondary"
                                onClick={() =>
                                    this.dispatch({
                                        type: FlowDispatchTypes.BACK
                                    })
                                }>
                                Back
                            </Button>
                            <a
                                id="alternate-search"
                                onClick={() => this.switchToAltSearchMenu()}>
                                Don't know the ID?
                            </a>
                        </div>
                    </form>
                </Grid>
            </div>
        );
    }

    renderAltSearch() {
        return (
            <AlternateSearch
                {...this.props}
                toggleSearchType={this.toggleSearchType}
                search={this.props.store.get('search', {
                    firstName: '',
                    lastName: '',
                    mothersFirstName: '',
                    fathersFirstName: '',
                    birthDate: ''
                })}
            />
        );
    }

    // TODO: Make the credential options configurable (i.e. don't limit to NIN and Voter ID)
    render() {
        console.log(this.state);
        if (this.state.altSearch) {
            return this.renderAltSearch();
        }
        return this.renderSearch();
    }
}
