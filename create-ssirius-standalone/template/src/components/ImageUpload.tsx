import React from 'react';
import '../css/ImageUpload.scss';
import { ImageUploadProps } from '../preBuilt/WebcamCaptureTool/interfaces/PhotoCaptureInterfaces';

export default function ImageUpload(props: ImageUploadProps) {
    async function convertBase64(file: File) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = error => {
                reject(error);
            };
        });
    }

    // TODO: Add error handling if "convertBase64" returns a rejected Promise
    async function onChangeHandler(event: any) {
        const file = event.target.files[0];
        const base64 = await convertBase64(file);
        props.handleUploadPhoto(base64);
    }

    return (
        <form method="post" action="#" id="#">
            Upload Your File
            <div className="form-group files">
                <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={onChangeHandler}
                />
            </div>
        </form>
    );
}
