interface DialogCommonProps {
    clickFunction(): void;
    allowCancel?: boolean;
    dismissCancel?: () => void;
    errorMessage: string;
    complete: boolean;
    success: boolean;
    rejection?: boolean;
}

export interface DialogContainerProps extends DialogCommonProps {
    open: boolean;
    handleCancel?: () => void;
}

export interface DialogBodyProps extends DialogCommonProps {
    cancel?: () => void;
}
