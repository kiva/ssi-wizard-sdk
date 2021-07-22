import React, {useState} from 'react';
import {toast} from 'react-hot-toast';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';

import FlowDispatchContext from '../contexts/FlowDispatchContext';
import FlowDispatchTypes from '../enums/FlowDispatchTypes';

import {EmailProps, EmailState} from '../interfaces/EmailInterfaces';

import '../css/Common.scss';
import '../css/Email.scss';

const EmailScreen: React.FC<EmailProps> = (props: EmailProps) => {
    const [email, setEmail] = useState<string>(props.store.get('email', ''));

    const handleInputChange = () => (e: any) => {
        const email: string = e.target.value;
        props.store.set('email', email);
        setEmail(email);
    };

    const proceed = () => (e: any) => {
        e.preventDefault();
        if (!email) {
            toast.error(props.no_input, {
                duration: 3000
            });
        } else {
            props.dispatch({type: FlowDispatchTypes.NEXT});
        }
    };

    return (
        <div data-cy="standard-search" className="flex-block">
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center">
                <Grid item>
                    <Typography component="h2" variant="h6" gutterBottom>
                        {props.instructions}
                    </Typography>
                </Grid>
                <form name="ekycIdForm">
                    <Grid item>
                        <FormControl id="test">
                            <TextField
                                id="email-input"
                                data-cy="email-input"
                                label={
                                    email.trim() === ''
                                        ? 'Email'
                                        : ''
                                }
                                value={email}
                                onChange={handleInputChange()}
                                inputProps={{'aria-label': 'bare'}}
                                margin="normal"
                                name="inputId"
                            />
                        </FormControl>
                    </Grid>
                    <div className="buttonListNew together loose">
                        <Button
                            className="secondary"
                            id="back"
                            onClick={() =>
                                props.dispatch({
                                    type: FlowDispatchTypes.BACK
                                })
                            }>
                            {props.back_text}
                        </Button>
                        <Button
                            type="submit"
                            id="continue"
                            onClick={proceed()}
                            onSubmit={proceed()}>
                            {props.continue}
                        </Button>
                    </div>
                </form>
            </Grid>
        </div>
    );
};

// export default class EmailScreen extends React.Component<
//     EmailProps,
//     EmailState
// > {
//     static contextType = FlowDispatchContext;
//     private dispatch: any;

//     constructor(props: EmailProps) {
//         super(props);
//         this.state = {
//             email: this.props.store.get('email', '')
//         };
//     }

//     componentDidMount() {
//         this.dispatch = this.context();
//     }

//     handleInputChange = () => (e: any) => {
//         const email: string = e.target.value;
//         this.props.store.set('email', email);
//         this.setState({email});
//     };

//     continue = () => (e: any) => {
//         e.preventDefault();
//         if (!this.state.email) {
//             toast.error(this.props.no_input, {
//                 duration: 3000
//             });
//         } else {
//             this.dispatch({type: FlowDispatchTypes.NEXT});
//         }
//     };

//     render() {
//         return (
//             <div data-cy="standard-search" className="flex-block">
//                 <Grid
//                     container
//                     direction="column"
//                     justify="center"
//                     alignItems="center">
//                     <Grid item>
//                         <Typography component="h2" variant="h6" gutterBottom>
//                             {this.props.instructions}
//                         </Typography>
//                     </Grid>
//                     <form name="ekycIdForm">
//                         <Grid item>
//                             <FormControl id="test">
//                                 <TextField
//                                     id="email-input"
//                                     data-cy="email-input"
//                                     label={
//                                         this.state.email.trim() === ''
//                                             ? 'Email'
//                                             : ''
//                                     }
//                                     value={this.state.email}
//                                     onChange={this.handleInputChange()}
//                                     inputProps={{'aria-label': 'bare'}}
//                                     margin="normal"
//                                     name="inputId"
//                                 />
//                             </FormControl>
//                         </Grid>
//                         <div className="buttonListNew together loose">
//                             <Button
//                                 className="secondary"
//                                 id="back"
//                                 onClick={() =>
//                                     this.dispatch({
//                                         type: FlowDispatchTypes.BACK
//                                     })
//                                 }>
//                                 {this.props.back_text}
//                             </Button>
//                             <Button
//                                 type="submit"
//                                 id="continue"
//                                 onClick={this.continue()}
//                                 onSubmit={this.continue()}>
//                                 {this.props.continue}
//                             </Button>
//                         </div>
//                     </form>
//                 </Grid>
//             </div>
//         );
//     }
// }
