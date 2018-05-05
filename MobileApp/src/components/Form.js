import React from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';


export default class Form extends React.Component {

    state = {
        username: null,
        password: null,
        usernameError: null,
        passwordError: null,
        notFound: null
    };

    clicked() {

        if(!this.state.username) {
            this.setState({
                usernameError: "Please provide username"
            })
        }

        if(!this.state.password) {
            this.setState({
                passwordError: "Please provide password"
            })
        }

        if(!!this.state.username && !!this.state.password) {
            if(this.props.type === 'Login') {
                fetch("http://35.162.162.0:3000/signin", {
                    method: "POST",
                    headers : {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        username: this.state.username,
                        password: this.state.password
                    })
                }).then((response) => response.json())
                    .then((responseJson) => {
                        if(responseJson.statusCode === '200') {
                            Actions.captureImage({
                                username: responseJson.username
                            });
                        } else {
                            this.setState({
                                notFound: responseJson.error
                            });
                        }
                    }).catch((error) => {
                    console.error(error);

                });

            } else {
                console.log("Name "+this.props.fullName);
                fetch("http://35.162.162.0:3000/signup", {
                    method: "POST",
                    headers : {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: this.props.fullName,
                        username: this.state.username,
                        password: this.state.password
                    })
                }).then((response) => response.json())
                    .then((responseJson) => {
                        console.log("User created "+responseJson);
                        if(responseJson.statusCode === '200') {
                            Actions.captureImage({
                                username: responseJson.username
                            });
                        } else {
                            this.setState({
                                passwordError: "User already exists"
                            });
                        }
                    }).catch((error) => {
                    console.error(error);
                });
            }
        }

    }

    render() {
        return (
            <View style={styles.container}>
                {!!this.state.notFound && (
                    <Text style={{color: 'red'}}>{this.state.notFound}</Text>
                )}
                <TextInput style={styles.inputBox}
                           underlineColorAndroid='rgba(0,0,0,0)'
                           placeholder="Username"
                           placeholderTextColor = "#ffffff"
                           selectionColor="#fff"
                           onChangeText={(text) => this.setState({username: text})}
                           keyboardType="email-address"
                           value={this.state.username}
                />
                {!!this.state.usernameError && (
                    <Text style={{color: 'red'}}>{this.state.usernameError}</Text>
                )}
                <TextInput style={styles.inputBox}
                           underlineColorAndroid='rgba(0,0,0,0)'
                           placeholder="Password"
                           secureTextEntry={true}
                           onChangeText={(text) => this.setState({password: text})}
                           value={this.state.password}
                           selectionColor="#fff"
                           placeholderTextColor = "#ffffff"
                />
                {!!this.state.passwordError && (
                    <Text style={{color: 'red'}}>{this.state.passwordError}</Text>
                )}
                <TouchableOpacity style={styles.button} onPress={this.clicked.bind(this)}>
                    <Text style={styles.buttonText}>{this.props.type}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        flexGrow: 1,
        justifyContent:'center',
        alignItems: 'center'
    },

    inputBox: {
        width:300,
        backgroundColor:'rgba(255, 255,255,0.2)',
        borderRadius: 25,
        paddingHorizontal:16,
        fontSize:16,
        color:'#ffffff',
        marginVertical: 10
    },
    button: {
        width:300,
        backgroundColor:'#1c313a',
        borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 13
    },
    buttonText: {
        fontSize:16,
        fontWeight:'500',
        color:'#ffffff',
        textAlign:'center'
    }
});
