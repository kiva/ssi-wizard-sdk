export interface PhotoAttach {
    data: string;
    type: string;
    encoding: string;
}

export interface ImageUploadProps {
    handleUploadPhoto: (dataUri: any) => Promise<void>;
}

export interface WebcamCaptureButtonProps {
    onSubmit(): void;

    onClickBack(): void;

    onReset(): void;
}
