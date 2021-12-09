import Grid from '@material-ui/core/Grid';
import React, { useState, useEffect, useContext } from 'react';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { FlowDispatchTypes } from '@kiva/ssirius-react';
import ProofProfileMenu from '../../components/ProofProfileMenu';
import { ConsentCard } from 'kiva-protocol-ui-kit';
import _ from 'lodash';
import '../../css/Common.scss';
import './css/ConfirmationScreen.scss';

import {
    CredentialKeyFieldsProps,
    CredentialKeyMap,
    CredentialKeyFieldState,
    ConfirmationProps
} from './interfaces/ConfirmationInterfaces';
import getDataFrom from '../../helpers/getDataFrom';

import TranslationContext from '../../contexts/TranslationContext';

export default function ConfirmationScreen(props: ConfirmationProps) {
    const t = useContext(TranslationContext);
    const enableProofProfileMenu = !!props.CONSTANTS.proof_profile_url;
    const [credentialKeys, setCredentialKeys] = useState<CredentialKeyMap | null>(enableProofProfileMenu ? getProfileDataIfAvailable() : props.CONSTANTS.credentialKeyMap);

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

    const agreementText = `${t('ConfirmationScreen.text.agreement')}
        ${t('ConfirmationScreen.text.infoShareIncludes')}`;
    return (
        <div className="Confirmation screen">
            {enableProofProfileMenu && <ProofProfileMenu setCredentialKeys={setCredentialKeys} {...props} />}
            <ConsentCard
                title={t('ConfirmationScreen.text.userAgreement')}
                agreement={agreementText}
                acceptBtnHandler={() => props.dispatch({
                    type: FlowDispatchTypes.NEXT
                })}
                acceptBtnContent={t('Standard.accept')}
                pii={_.map(credentialKeys, key => key.name)}
            />
        </div>
    );
}

function PII(props: CredentialKeyFieldsProps) {
    const t = useContext(TranslationContext);
    const labels: CredentialKeyFieldState = delegateLabels();

    function translatePII(key: string) {
        const translationKey = `PII.${key}`;
        const maybeTranslated = t(translationKey);

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

        return { columnOne, columnTwo };
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