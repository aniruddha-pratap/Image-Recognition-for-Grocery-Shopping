import React from 'react';
import {Actions, Router, Stack, Scene} from 'react-native-router-flux';
import {BackHandler} from 'react-native';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import CaptureImage from './pages/CaptureImage';
import ImageInformation from './pages/ImageInformation';
import CartScreen from "./pages/Cart"
import Checkout from "./pages/Checkout";

export default class Routes extends React.Component {
    render() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            try {
                Actions.pop();
                return false;
            }
            catch (err) {
                return true;
            }
        });
        return(
            <Router>
                <Stack key="root" hideNavBar={true}>
                    <Scene key="login" component={Login} title="Login" initial={true} />
                    <Scene key="signup" component={SignUp} title="Register"/>
                    <Scene key="captureImage" component={CaptureImage} title="CaptureImage"/>
                    <Scene key="imageInformation" component={ImageInformation} title="ImageInformation"/>
                    <Scene key="cart" component={CartScreen} title="CartScreen"/>
                    <Scene key="checkout" component={Checkout} title="Checkout"/>
                </Stack>
            </Router>
        )
    }
}

