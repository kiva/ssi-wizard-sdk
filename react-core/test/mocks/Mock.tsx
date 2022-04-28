import React from 'react';
import { ICommonProps } from '../../src/interfaces/ICommonProps';
import FlowDispatchTypes from '../../src/enums/FlowDispatchTypes';

export default function Mock(props: ICommonProps) {

    const handleInputChange = (e: any) => {
        e.preventDefault();
        const input = e.currentTarget.value;

        props.store.set('inputValue', input);
    };

    return (
        <div className="TestComponent">
            <p data-testid="prevScreen">prevScreen: {props.prevScreen}</p>
            <p data-testid="authIndex">authIndex: {props.authIndex}</p>
            <input data-testid="mockInput" onChange={handleInputChange} value={props.store.get('inputValue', '')} />
            <p data-testid="CONSTANTS">{JSON.stringify(props.CONSTANTS)}</p>
            {renderAdditionalProps(props)}
            <button data-testid="next" onClick={() => props.dispatch({
                type: FlowDispatchTypes.NEXT
            })}>NEXT</button>
            <button data-testid="back" onClick={() => props.dispatch({
                type: FlowDispatchTypes.BACK
            })}>BACK</button>
            <button data-testid="set-method" onClick={() => props.dispatch({
                type: FlowDispatchTypes.SET_AUTH_METHOD,
                payload: getNextMethod(props.authIndex, props.CONSTANTS.verification_options.length)
            })}>GO TO NEXT METHOD</button>
            <button data-testid="reset" onClick={() => props.dispatch({
                type: FlowDispatchTypes.RESTART
            })}>RESET</button>
        </div>
    );
}

function getNextMethod(index: number, numOptions: number) {
    const nextIndex = index + 1;
    return nextIndex >= numOptions ? 0 : nextIndex;
}

function renderAdditionalProps(props: ICommonProps) {
    const exclude = ['dispatch', 'CONSTANTS', 'store', 'prevScreen', 'authIndex'];
    return Object.entries(props).map((entry, index) => {
        if (exclude.indexOf(entry[0]) === -1) {
            return <p data-testid={entry[0]} key={index}>{`${entry[0]}: ${entry[1]}`}</p>
        }
        return null;
    });
}