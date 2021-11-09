interface DialogCommonProps {
    clickFunction(open: boolean): void;
    allowCancel?: boolean;
    errorMessage: string;
    complete: boolean;
    success: boolean;
}

export interface DialogContainerProps
    extends DialogCommonProps,
    DialogTextElements {
    open: boolean;
    handleCancel?: () => void;
}

export interface DialogBodyProps extends DialogCommonProps, DialogTextElements {
    cancel?: () => void;
}

interface DialogTextElements { }
