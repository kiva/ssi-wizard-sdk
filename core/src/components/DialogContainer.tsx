import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogBody from './DialogBody';
import Slide from '@material-ui/core/Slide';

import {DialogContainerProps} from '../interfaces/DialogInterfaces';

export default class DialogContainer extends React.Component<DialogContainerProps> {
    renderTransition = (props: any) => {
        return <Slide direction="up" {...props} />;
    };

    render() {
        return (
            <Dialog
                data-cy="dialog-container"
                open={this.props.open}
                TransitionComponent={this.renderTransition}
                keepMounted
                disableBackdropClick={!this.props.errorMessage}
                onClose={this.props.clickFunction}>
                <DialogContent id="dialog-box" className="DialogContent">
                    <DialogBody
                        clickFunction={this.props.clickFunction}
                        complete={this.props.complete}
                        success={this.props.success}
                        cancel={this.props.handleCancel || undefined}
                        rejection={this.props.rejection}
                        errorMessage={this.props.errorMessage}
                        allowCancel={this.props.allowCancel}
                        dismissCancel={this.props.dismissCancel}
                    />
                </DialogContent>
            </Dialog>
        );
    }
}
