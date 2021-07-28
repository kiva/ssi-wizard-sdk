import Grid from '@material-ui/core/Grid';
import React, {useState} from 'react';

import Button from '@material-ui/core/Button';

import '../css/Common.scss';
import '../css/FingerSelectionScreen.scss';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import {FingerSelectProps} from '../interfaces/FingerSelectionInterfaces';
import Fingers from '../globals/fingerMap';

const FINGER_STORE = 'selectedFinger';

export default function FingerSelectionScreen(props: FingerSelectProps) {
    const [selectedFinger, setSelectedFinger] = useState<string>(
        props.store.get(FINGER_STORE, 'right_thumb')
    );

    function getFingerCaption(code: string) {
        return Fingers[code] || '';
    }

    function confirmSelection() {
        props.store.set(FINGER_STORE, selectedFinger);
        props.changeFingerSelection &&
            props.changeFingerSelection(selectedFinger);
    }

    function renderRadioMenu() {
        return (
            <div className="flex-block">
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center">
                    <div className="FingerContainer">
                        <RadioGroup
                            aria-label="FingerSelection"
                            name="finger"
                            className="RadioGroup"
                            value={selectedFinger}>
                            {props.isReadOnly
                                ? renderReadOnlyRadioButtons()
                                : renderEditableRadioButtons()}
                        </RadioGroup>
                    </div>
                </Grid>
                {props.isReadOnly && renderFingerSelectionButton()}
            </div>
        );
    }

    function renderFingerSelectionButton() {
        return (
            <Button
                data-cy="back"
                className="finger-select"
                onClick={() => confirmSelection()}>
                {selectedFinger !== props.store.get(FINGER_STORE, '') ? (
                    <span>
                        Use <strong>{getFingerCaption(selectedFinger)}</strong>
                    </span>
                ) : (
                    'Go Back'
                )}
            </Button>
        );
    }

    function renderReadOnlyRadioButtons() {
        return Object.keys(Fingers).map((key: string) => {
            const isChecked = key === selectedFinger;
            if (!isChecked) {
                return null;
            }
            return (
                <FormControlLabel
                    key={key}
                    style={{
                        ...radioButtonStyles[key],
                        position: 'absolute'
                    }}
                    value={key}
                    control={
                        <Radio
                            disableRipple
                            disabled={!isChecked}
                            checked={isChecked}
                            color="primary"
                        />
                    }
                    label={''}
                />
            );
        });
    }

    function renderEditableRadioButtons() {
        return Object.keys(Fingers).map((key: string) => {
            const isChecked = key === selectedFinger;
            return (
                <FormControlLabel
                    key={key}
                    style={{
                        ...radioButtonStyles[key],
                        position: 'absolute'
                    }}
                    value={key}
                    control={
                        <Radio
                            disableRipple
                            checked={isChecked}
                            color="primary"
                        />
                    }
                    label={''}
                    onClick={() => {
                        setSelectedFinger(key);
                    }}
                />
            );
        });
    }

    return renderRadioMenu();
}

const radioButtonStyles: any = {
    right_thumb: {
        top: 108,
        left: 221
    },
    right_index: {
        top: 41,
        left: 248
    },
    right_middle: {
        top: 28,
        left: 291
    },
    right_ring: {
        top: 42,
        left: 332
    },
    right_little: {
        top: 76,
        left: 367
    },
    left_thumb: {
        top: 108,
        left: 163
    },
    left_index: {
        top: 41,
        left: 137
    },
    left_middle: {
        top: 28,
        left: 94
    },
    left_ring: {
        top: 42,
        left: 52
    },
    left_little: {
        top: 76,
        left: 18
    }
};
