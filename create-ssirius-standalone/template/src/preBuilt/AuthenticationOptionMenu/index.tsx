import React, { useContext, useState } from 'react';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Radio, { RadioProps } from '@material-ui/core/Radio';
import { withStyles } from '@material-ui/core/styles';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';

import FlowDispatchTypes from '../../enums/FlowDispatchTypes';

import '../../css/Common.scss';
import './css/AuthOptionMenu.scss';

import {
    AuthOptionProps,
    MenuOptionProps
} from './interfaces/AuthOptionInterfaces';
import TranslationContext from '../../contexts/TranslationContext';

export default function AuthenticationOptionMenu(props: AuthOptionProps) {
    const t = useContext(TranslationContext);
    const [optionSelected, setSelectedOption] = useState<number>(
        props.authIndex
    );

    const selectOption = (optionSelected: number): void => {
        props.dispatch({
            type: FlowDispatchTypes.SET_AUTH_METHOD,
            payload: optionSelected
        });
        setSelectedOption(optionSelected);
    };

    return (
        <div id="auth_option_menu" className="flex-block column">
            <Typography
                className="auth_instructions"
                component="h2"
                variant="h6">
                {t('AuthMenu.text.selectVerification')}
            </Typography>
            <div id="auth_options" className="flex-block row">
                {props.CONSTANTS.verification_options.map((option, idx) => {
                    return (
                        <MenuOption
                            key={option.id}
                            id={option.id}
                            title={option.title}
                            description={option.description}
                            selected={idx === optionSelected}
                            recommended={idx === 0}
                            option_index={idx}
                            setAuthType={selectOption}
                            type={option.type}
                        />
                    );
                })}
            </div>
            <Button
                id="select-auth-method"
                onClick={() => props.dispatch({ type: FlowDispatchTypes.NEXT })}>
                {t('Standard.select')}
            </Button>
        </div>
    );
}

function MenuOption(props: MenuOptionProps) {
    return (
        <Card
            onClick={() => props.setAuthType(props.option_index)}
            className={classNames({
                recommended: props.recommended,
                'flex-block': true,
                auth_option: true,
                selected: props.selected,
                [props.type]: true
            })}>
            <CardContent>
                <Typography component="h2" variant="h4">
                    {props.title}
                </Typography>
                <p>{props.description}</p>
            </CardContent>
            <CardActions className="radio-container">
                <MenuRadio
                    checked={props.selected}
                    inputProps={{ 'aria-label': props.id }}
                />
            </CardActions>
        </Card>
    );
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
