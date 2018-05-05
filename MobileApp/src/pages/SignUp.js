import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';

import Logo from '../components/Logo';
import Form from '../components/Form';

export default class SignUp extends React.Component {
    state = {
        fullName: ''
    };

    signin() {
        Actions.pop();
    }

    render() {
        return (
            <View style={styles.container}>
                <Logo/>
                <TextInput style={styles.inputBox}
                           underlineColorAndroid='rgba(0,0,0,0)'
                           placeholder="Name"
                           placeholderTextColor = "#ffffff"
                           selectionColor="#fff"
                           onChangeText={(text) => this.setState({fullName: text})}
                           keyboardType="email-address"
                           value={this.state.fullName}
                />
                <Form type="SignUp"
                      fullName ={this.state.fullName}  />
                <View style={styles.signupTextCont}>
                    <Text style={styles.signupText}>Already have an account?</Text>
                    <TouchableOpacity onPress={this.signin}>
                        <Text style={styles.signupButton}> SignIn</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        backgroundColor:'#455a64',
        flex: 1,
        alignItems:'center',
        justifyContent :'center'
    },
    signupTextCont : {
        flexGrow: 1,
        alignItems:'flex-end',
        justifyContent :'center',
        paddingVertical:16,
        flexDirection:'row'
    },
    signupText: {
        color:'rgba(255,255,255,0.6)',
        fontSize:16
    },
    signupButton: {
        color:'#ffffff',
        fontSize:16,
        fontWeight:'500'
    },
    inputBox: {
        width:300,
        backgroundColor:'rgba(255, 255,255,0.2)',
        borderRadius: 25,
        paddingHorizontal:16,
        fontSize:16,
        color:'#ffffff',
        marginBottom: -20
    }
});
