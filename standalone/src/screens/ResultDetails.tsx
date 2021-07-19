import * as React from 'react';
import '../css/ResultDetails.scss';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import classNames from 'classnames';

import _ from 'lodash';
import {DetailsProps, PhotoAttach} from '../interfaces/DetailsInterfaces';
import {CredentialKeyMap} from '../interfaces/ConfirmationInterfaces';

const CredentialKeys: CredentialKeyMap = CONSTANTS.credentialKeyMap;

const wideKeys: string[] = [];
const itemList: any = {};

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
            return this.props.no_data;
        }
    }

    renderFields(title: string, fields: any) {
        const items: any[] = [];
        const wideItemKeys: string[] = ['DID', 'publicKey', ...wideKeys];

        for (var key in fields) {
            if (!fields.hasOwnProperty(key)) {
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

    createPhotoData(photoAttach: string): string {
        let ret: string = '';
        try {
            const photoData: PhotoAttach = JSON.parse(photoAttach);
            const {data, encoding, type} = photoData;
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
                        <h3>{this.props.record_type}</h3>
                        <img
                            className="PictureProfile"
                            alt=""
                            src={pictureData}
                        />
                        {this.renderFields(
                            this.props.authority_body,
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
                                Back
                            </Button>
                        </div>
                    </div>
                </div>
            </Paper>
        );
    }
}
