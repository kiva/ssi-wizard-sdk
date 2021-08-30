import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogBody from './DialogBody';
import Slide from '@material-ui/core/Slide';

import {DialogContainerProps} from '../interfaces/DialogInterfaces';

export default function DialogContainer(props: DialogContainerProps) {
    function renderTransition(props: any): any {
        return <Slide direction="up" {...props} />;
    }

    return (
        <Dialog
            data-cy="dialog-container"
            open={props.open}
            TransitionComponent={renderTransition}
            keepMounted
            disableBackdropClick={!props.errorMessage}
            onClose={props.clickFunction}>
            <DialogContent id="dialog-box" className="DialogContent">
                <DialogBody
                    clickFunction={props.clickFunction}
                    complete={props.complete}
                    success={props.success}
                    cancel={props.handleCancel || undefined}
                    errorMessage={props.errorMessage}
                    allowCancel={props.allowCancel}
                    t={props.t}
                />
            </DialogContent>
        </Dialog>
    );
}
