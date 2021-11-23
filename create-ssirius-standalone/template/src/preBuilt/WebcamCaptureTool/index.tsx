import Grid from '@material-ui/core/Grid';
import React, { useContext, useState } from 'react';
import Camera from 'react-html5-camera-photo';
import Button from '@material-ui/core/Button';
import 'react-html5-camera-photo/build/css/index.css';
import ImageUpload from '../../components/ImageUpload';
import Typography from '@material-ui/core/Typography';

import '../../css/Common.scss';

import {
    PhotoAttach,
    WebcamCaptureButtonProps
} from './interfaces/PhotoCaptureInterfaces';
import { ICommonProps, FlowDispatchTypes } from '@kiva/ssirius-react';
import TranslationContext from '../../contexts/TranslationContext';

const PHOTO_WIDTH = 250;
const PHOTO_HEIGHT = 180;

export default function WebcamCaptureTool(props: ICommonProps) {
    const t = useContext(TranslationContext);
    const [photoAttach, setPhotoAttach] = useState<PhotoAttach | undefined>(
        getInitialPhotoAttach()
    );
    const [showValidations, setShowValidations] = useState<boolean>(false);

    function photoIncluded() {
        return !!photoAttach;
    }

    function getInitialPhotoAttach() {
        let initialPhotoData: PhotoAttach | undefined;
        try {
            initialPhotoData = JSON.parse(props.store.get('photo~attach'));
        } catch {
            console.log(
                'Failed to parse the photo~attach data in our component store. Printing the current output of it...'
            );
            console.log(
                props.store.get(
                    'photo~attach',
                    'No photo has been captured yet'
                )
            );
        } finally {
            return initialPhotoData;
        }
    }

    function saveCredentialCreationData() {
        setShowValidations(true);
        if (photoIncluded()) {
            props.store.set('photo~attach', JSON.stringify(photoAttach));
            props.dispatch({ type: FlowDispatchTypes.NEXT });
        }
    }

    function onReset() {
        setPhotoAttach(undefined);
        props.store.set('photo~attach', '');
    }

    function determinePhotoType(dataUri: any): PhotoAttach {
        const parts: string[] = dataUri.split(',', 2);
        const type: string = parts[0].split(':')[1].split(';')[0];
        return {
            data: parts[1],
            type,
            encoding: 'base64'
        };
    }

    // Takes a data URI and returns the Data URI corresponding to the resized image at the wanted size.
    async function resizeDataURL(datas: PhotoAttach) {
        return new Promise(async (resolve, reject) => {
            const img = document.createElement('img');
            img.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx: any = canvas.getContext('2d');
                canvas.width = PHOTO_WIDTH;
                canvas.height = PHOTO_HEIGHT;
                try {
                    ctx.drawImage(this, 0, 0, PHOTO_WIDTH, PHOTO_HEIGHT);
                    const dataURI = canvas.toDataURL();
                    resolve(dataURI);
                } catch {
                    reject();
                }
            };
            img.src = `data:${datas.type};${datas.encoding},${datas.data}`;
        });
    }

    const savePhoto = async (dataUri: string) => {
        let photo: PhotoAttach = {
            data: dataUri,
            encoding: 'base64',
            type: 'image/png'
        };

        try {
            photo = determinePhotoType(dataUri);
        } catch (e) {
            console.error(
                "Couldn't parse the dataUri string to determine encoding type. Moving forward with the assumption that it is a PNG base64 string..."
            );
        } finally {
            const resizedPhoto = await resizeDataURL(photo);
            setPhotoAttach(determinePhotoType(resizedPhoto));
        }
    };

    function renderPageButtons() {
        return (
            <WebcamCaptureToolButtons
                onClickBack={() =>
                    props.dispatch({ type: FlowDispatchTypes.BACK })
                }
                onSubmit={() => saveCredentialCreationData()}
                onReset={() => onReset()}></WebcamCaptureToolButtons>
        );
    }

    function renderError() {
        if (!photoIncluded() && showValidations) {
            return (
                <Typography
                    component="h2"
                    variant="h6"
                    data-cy="image-capture-error-message"
                    style={{
                        color: 'red',
                        marginTop: '20px'
                    }}>
                    {t('Errors.webcamCapture.noPhoto')}
                </Typography>
            );
        } else {
            return;
        }
    }

    // This condition will rely on base64 encoding for the image
    if (photoAttach) {
        return (
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                direction="column">
                <img
                    id="credential-image"
                    src={`data:${photoAttach.type};${photoAttach.encoding},${photoAttach.data}`}
                    alt={t('WebcamCapture.text.photoAlt')}></img>
                {renderPageButtons()}
            </Grid>
        );
    } else {
        return (
            <Grid
                container
                direction="row"
                justifyContent="space-around"
                data-cy="image-selection">
                <Grid item xs={8}>
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-around"
                        data-cy="image-upload">
                        <Grid item xs={6} md={5}>
                            <ImageUpload
                                handleUploadPhoto={savePhoto}></ImageUpload>
                        </Grid>
                        <Grid item xs={6} md={5}>
                            <div className="camera-container">
                                Or take a photo
                                <Camera
                                    isFullscreen={false}
                                    onTakePhoto={(dataUri: any) => {
                                        savePhoto(dataUri);
                                    }}
                                />
                            </div>
                        </Grid>
                        {renderError()}
                        {renderPageButtons()}
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

function WebcamCaptureToolButtons(props: WebcamCaptureButtonProps) {
    const t = useContext(TranslationContext);
    return (
        <Grid
            id="dialog-box"
            container
            style={{
                paddingTop: '45px'
            }}
            direction="row"
            justifyContent="space-around">
            <Grid container direction="row" justifyContent="space-around">
                <Grid item>
                    <Button
                        data-cy="image-select-back"
                        className="back"
                        onClick={props.onClickBack}>
                        {t('Standard.back')}
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        data-cy="reset-flow"
                        className="back"
                        onClick={props.onReset}>
                        {t('WebcamCapture.buttons.reset')}
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        type="submit"
                        data-cy="image-select-continue"
                        className="next"
                        onSubmit={props.onSubmit}
                        onClick={props.onSubmit}>
                        {t('Standard.continue')}
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
}
