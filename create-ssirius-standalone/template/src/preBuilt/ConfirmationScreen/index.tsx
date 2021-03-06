import Grid from '@material-ui/core/Grid';
import React, { useState, useEffect, useContext } from 'react';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { FlowDispatchTypes } from '@kiva/ssirius-react';
import ProofProfileMenu from '../../components/ProofProfileMenu';

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

    return (
        <div className="Confirmation screen">
            {enableProofProfileMenu && <ProofProfileMenu setCredentialKeys={setCredentialKeys} {...props} />}
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center">
                <Grid item>
                    <Typography component="h2" variant="h6" gutterBottom>
                        {t('ConfirmationScreen.text.pleaseReview')}
                    </Typography>
                </Grid>
            </Grid>
            <div className="legal-terms-section">
                <div className="legal-terms1">
                    <p>{t('ConfirmationScreen.text.agreement')}</p>

                    <p>{t('ConfirmationScreen.text.infoShareIncludes')}</p>
                </div>
                {credentialKeys && <PII fields={credentialKeys} />}
            </div>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center">
                <Grid item>
                    <Button
                        className="accept"
                        onClick={() =>
                            props.dispatch({
                                type: FlowDispatchTypes.NEXT
                            })
                        }>
                        {t('Standard.accept')}
                    </Button>
                </Grid>
            </Grid>
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