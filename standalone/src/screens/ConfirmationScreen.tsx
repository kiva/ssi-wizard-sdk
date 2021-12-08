import Grid from '@material-ui/core/Grid';
import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { ConsentCard } from 'kiva-protocol-ui-kit';
import '../css/Common.scss';
import '../css/ConfirmationScreen.scss';

import {
    CredentialKeyFieldsProps,
    CredentialKeyMap,
    CredentialKeyFieldState,
    ConfirmationProps
} from '../interfaces/ConfirmationInterfaces';
import getDataFrom from '../helpers/getDataFrom';

import FlowDispatchTypes from '../enums/FlowDispatchTypes';

export default function ConfirmationScreen(props: ConfirmationProps) {
    console.log(props.t('Definitely does not exist'));
    const enableProofProfileMenu = !!props.CONSTANTS.proof_profile_url;
    const [credentialKeys] = useState<CredentialKeyMap | null>(enableProofProfileMenu ? getProfileDataIfAvailable() : props.CONSTANTS.credentialKeyMap);

    useEffect(() => {
        props.store.set('credentialKeyMap', credentialKeys);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [credentialKeys]);

    function getProfileDataIfAvailable() {
        const profile = props.store.get('profile', false);
        if (profile) {
            return getDataFrom(profile);
        }

        return null;
    }
    const agreementText = `${props.t('ConfirmationScreen.text.agreement')}
        ${props.t('ConfirmationScreen.text.infoShareIncludes')}`;

    return (
        <div className="Confirmation screen">
            <ConsentCard
                title="User Agreement"
                agreement={agreementText}
                acceptBtnHandler={() => props.dispatch({
                    type: FlowDispatchTypes.NEXT
                })}
                acceptBtnContent="Accept"
                pii={credentialKeys && <PII t={props.t} fields={credentialKeys} />}
            />
        </div>
    );
}

function PII(props: CredentialKeyFieldsProps) {
    const labels: CredentialKeyFieldState = delegateLabels();

    function translatePII(key: string) {
        const translationKey = `PII.${key}`;
        const maybeTranslated = props.t(translationKey);

        if (maybeTranslated === translationKey) {
            return key;
        }

        return maybeTranslated;
    }

    function delegateLabels(): CredentialKeyFieldState {
        const columnOne: string[] = [];
        const columnTwo: string[] = [];
        const fields = props.fields;

        let i = 0;
        for (const field in fields) {
            const currentArray = i % 2 === 0 ? columnOne : columnTwo;
            const name = translatePII(fields[field].name);
            currentArray.push(name);
            i++;
        }

        return {columnOne, columnTwo};
    }

    return (
        <div className="legal-terms2">
            <ul>
                {labels.columnOne.map(field => {
                    return <li key={field}>{field}</li>;
                })}
            </ul>
            <ul>
                {labels.columnTwo.map(field => {
                    return <li key={field}>{field}</li>;
                })}
            </ul>
        </div>
    );
}