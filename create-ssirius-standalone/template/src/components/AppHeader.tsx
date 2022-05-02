import React, { useContext, MutableRefObject } from 'react';
import { IConstants } from '@kiva/ssirius-react';
import img from '../images/header.png';
import { Button } from '@material-ui/core';
import TranslationContext from '../contexts/TranslationContext';

export default function AppHeader(props: AppHeaderProps) {
    const t = useContext(TranslationContext);
    const {resetFunction} = props;
    return <div className="AppHeader">
        <div id="branding">
            <img src={img} alt={props.standaloneConf?.alt || ''} />
            <h1>Kiva</h1>
        </div>
        <Button data-cy="restart-ekyc" onClick={() => resetFunction.current && resetFunction.current()}>{t('Standard.restartEkyc')}</Button>
    </div>;
}

interface AppHeaderProps extends IConstants {
    resetFunction: MutableRefObject<any>;
}