import React from 'react';
import {Router, Stack, Scene} from 'react-native-router-flux';
import {BackHandler} from 'react-native';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import CaptureImage from './pages/CaptureImage';

export default class Routes extends React.Component {
    render() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            try {
                Actions.pop();
                return true;
            }
            catch (err) {
                return true;
            }
        });
        return(
            <Router>
                <Stack key="root" hideNavBar={true}>
                    <Scene key="login" component={Login} title="Login" initial={true}/>
                    <Scene key="signup" component={SignUp} title="Register"/>
                    <Scene key="captureImage" component={CaptureImage} title="CaptureImage"/>
                </Stack>
            </Router>
        )
    }
}

