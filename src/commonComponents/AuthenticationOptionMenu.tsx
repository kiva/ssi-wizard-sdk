import * as React from 'react';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Radio, { RadioProps } from '@material-ui/core/Radio';
import { withStyles } from '@material-ui/core/styles';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';

import FlowDispatchContext from '../contexts/FlowDispatchContext';
import FlowDispatchTypes from '../enums/FlowDispatchTypes';

import "../css/AuthOptionMenu.scss";

import { AuthOptionProps, AuthOptionState, MenuOptionProps } from "../interfaces/AuthOptionInterfaces";

import React, { useRef } from 'react';

export default function AuthenticationOptionMenu = (props: AuthOptionProps, AuthOptionState) => {
    const options = useRef<AuthOptionState>(selectOption());


    const selectOption = (optionSelected: number): void => {
        props.dispatch{ (type) }
    });
    options.setState({ optionSelected });
};

return (
    <div id="auth_option_menu" className="flex-block column">
        <Typography className="auth_instructions" component="h2" variant="h6">
            {options.props.instructions}
        </Typography>
        <div id="auth_options" className="flex-block row">
            {options.props.verification_options.map((option, idx) => {
                return (
                    <MenuOption
                        key={option.id}
                        id={option.id}
                        title={option.title}
                        description={options.description}
                        selected={idx === selectOption.state.optionSelected}
                        recommended={idx === 0}
                        option_index={idx}
                        setAuthType={options.selectOption}
                    />
                );
            }
            )
            }
        </div>
        <Button id="select-auth-method" onClick={() => selectOption.dispatch({ type: FlowDispatchTypes.NEXT })}>
            {options.props.selectButtonText}
        </Button>
    </div>
);
        

}

function MenuOption = (props: MenuOptionProps) => {
    return (
        <Card
            onClick={() => props.setAuthType(props.option_index)}
            className={classNames({
                recommended: MenuOption.props.recommended,
                "flex-block": true,
                auth_option: true,
                selected: props.selected
            })}
        >
            <CardContent>
                <Typography component="h2" variant="h4">
                    {props.title}
                </Typography>
                <p>
                    {props.description}
                </p>
            </CardContent>
            <CardActions className="radio-container">
                <MenuRadio checked={props.selected} inputProps={{ 'aria-label': props.id }} />
            </CardActions>
        </Card>
    );
}
}

// TODO: Maybe link this up with the "colorMap" config
const MenuRadio = withStyles({
    root: {
        color: '#24778b',
        '&$checked': {
            color: '#24778b'
        }
    }
})((props: RadioProps) => <Radio color="default" {...props} />);