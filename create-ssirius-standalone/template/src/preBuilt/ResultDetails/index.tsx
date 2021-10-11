import * as React from 'react';
import '../../css/Common.scss';
import './css/ResultDetails.scss';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import classNames from 'classnames';

import { DetailsProps, PhotoAttach } from './interfaces/DetailsInterfaces';

const wideKeys: string[] = [];

export default class ResultDetails extends React.Component<DetailsProps> {
    private personalInfo: any = this.props.store.get(
        'personalInfo',
        {},
        this.props.prevScreen
    );

    componentDidMount() {
        this.props.store.reset();
        this.dispatchEkycComplete();
    }

    dispatchEkycComplete = () => {
        const sendingObject = {
            key: 'kycCompleted',
            detail: this.personalInfo
        };
        console.info('Sending kycCompleted', sendingObject);
        window.parent.postMessage(sendingObject, '*');
    };

    getPIIDisplayString(key: string, val: string) {
        try {
            let piiString = val;
            // The backend no longer gives us data types for the requested_attribute fields they send
            // so this is going to be switched to an heuristic for now.
            // TODO: Create a translation map for data: https://github.com/kiva/ssi-wizard-sdk/issues/18
            if (key.toLowerCase().indexOf('date') > -1) {
                piiString = new Date(Number(val) * 1000).toLocaleDateString(
                    'en-gb',
                    {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }
                );
            }
            return piiString;
        } catch {
            return this.props.t('Errors.results.noData');
        }
    }

    renderFields(title: string, fields: any) {
        const items: any[] = [];
        const wideItemKeys: string[] = ['DID', 'publicKey', ...wideKeys];

        for (const key in fields) {
            if (this.shouldContinue(fields, key)) {
                continue;
            }
            const value = fields[key];
            items.push(
                <div
                    key={key}
                    className={classNames({
                        FieldCard: true,
                        wide: wideItemKeys.indexOf(key) > -1
                    })}>
                    <div className="FieldCardTitle">{key}</div>
                    <div className="FieldCardValue">
                        {this.getPIIDisplayString(key, value)}
                    </div>
                </div>
            );
        }
        return <div className="ProfileItemContainer">{items}</div>;
    }

    shouldContinue(fields: any, key: any) {
        const credentialKeyMap = this.props.store.get('credentialKeyMap', {}, 'confirmation');

        if (!fields.hasOwnProperty(key)
            || (credentialKeyMap.hasOwnProperty(key) && !credentialKeyMap[key].rendered)) {
            return true;
        }

        return false;
    }

    createPhotoData(photoAttach: string): string {
        let ret = '';
        try {
            const photoData: PhotoAttach = JSON.parse(photoAttach);
            const { data, encoding, type } = photoData;
            ret = `data:${type};${encoding},${data}`;
        } catch {
            ret = 'data:image/png;base64,' + photoAttach;
        } finally {
            return ret;
        }
    }

    render() {
        const pictureData: string = this.createPhotoData(
            this.personalInfo['photo~attach']
        );

        return (
            <Paper className="ProfileCardContainer" elevation={1}>
                <div className="ProfileCard">
                    <div className="Column2">
                        <h3>eKYC</h3>
                        <img
                            className="PictureProfile"
                            alt=""
                            src={pictureData}
                        />
                        {this.renderFields(
                            this.props.t('DeployKeys.authAgencyAcronym'),
                            this.personalInfo
                        )}
                        <div className="important-buttons">
                            <Button
                                className="back"
                                onClick={() => {
                                    if (window.opener) {
                                        window.opener.location.href =
                                            'https://pro-cluster-kiva.web.app/';
                                        window.close();
                                    }
                                }}>
                                {this.props.t('Standard.back')}
                            </Button>
                        </div>
                    </div>
                </div>
            </Paper>
        );
    }
}
