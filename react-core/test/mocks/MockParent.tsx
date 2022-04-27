import React, { cloneElement, useRef } from 'react';

export default function MockParent(props: any) {
    const resetFunction = useRef<any>(null);

    return (
        <div id="mock-parent">
            {props.hasResetFunction ? cloneElement(props.children, {resetFunction}) : props.children}
            <button data-testid="parent-reset-button" onClick={() => resetFunction.current && resetFunction.current()}>Do The Reset</button>
        </div>
    );
}