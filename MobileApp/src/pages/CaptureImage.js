import React from 'react';
import { StyleSheet, Text, ActivityIndicator } from 'react-native';

import { Container, Body, Button, Header, Title } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import PickImage from '../components/PickImage';
import { Actions } from 'react-native-router-flux';

export default class CaptureImage extends React.Component {

    state = {
        controls : {
            image: {
                value: null,
                valid: false
            }
        },
        uploaded: false
    };

    imagePickedHandler = image => {
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    image: {
                        value: image,
                        valid: true
                    }
                }
            }
        });
    };

    uploadImage = () => {

        const data = new FormData();
       // data.append('image', 'testName');
        data.append('image', {
            uri: this.state.controls.image.value.uri,
            type: this.state.controls.image.value.type,
            name: this.state.controls.image.value.fileName
        });
        this.setState({
            uploaded: true
        });
        fetch("http://18.236.87.78:5000/", {
            method: "POST",
            headers: {
                "Accept": "text/html"
            },
            body: data
        }).then((response) => response.text())
            .then((responseJson) => {
                let stringParts = responseJson.split('\n');
                console.log(responseJson);
                this.setState({
                    uploaded: false
                });
                Actions.imageInformation({
                    image: this.state.controls.image.value.uri,
                    productName: stringParts[0].split('=')[1],
                    condition: stringParts[1].split('=')[1]
                })
            }).catch((error) => {
            console.error(error);
            this.setState({
                uploaded: false
            });
        });

    };

    logout() {
        fetch("http://35.162.162.0:3000/logout", {
            method: "POST",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("Logout "+JSON.stringify(responseJson));
                if(responseJson.statusCode === '200') {
                    Actions.login();
                }
            }).catch((error) => {
            console.error(error);
        });
    }

    render() {
        if (this.state.uploaded) {
            return (
                <Container style={styles.container}>
                    <Header style={{backgroundColor: '#455a64', alignItems: 'center'}} rounded>
                        <Title>Capture Image</Title>
                        <Body >
                        <Button small iconLeft rounded
                                style={{alignSelf: 'flex-end', marginBottom: 10, backgroundColor:'transparent'}}
                                onPress={this.logout}>
                            <Icon name="md-exit" style={{paddingHorizontal: 10}} size={30} color='#fff'/>
                        </Button>
                        </Body>
                    </Header>
                    <ActivityIndicator
                        animating={true}
                        style={styles.indicator}
                        color="#ffffff"
                        size = "large"
                    />
                </Container>
            );
        }

        return (
            <Container style={styles.container}>
                <Header style={{backgroundColor: '#455a64', alignItems: 'center'}} rounded>
                    <Title>Capture Image</Title>
                    <Body >
                        <Button small iconLeft rounded
                                style={{alignSelf: 'flex-end', marginBottom: 10, backgroundColor:'transparent'}}
                                onPress={this.logout}>
                            <Icon name="md-exit" style={{paddingHorizontal: 10}} size={30} color='#fff'/>
                        </Button>
                    </Body>
                </Header>
                <PickImage onImagePicked={this.imagePickedHandler}/>
                <Button full iconLeft style={{backgroundColor: '#1c313a'}} disabled={!this.state.controls.image.valid}
                        onPress={() => this.uploadImage()}>
                    <Icon name="md-cloud-upload" style={{paddingHorizontal: 10}} size={20} color='#fff'/>
                    <Text style={styles.buttonText}>Check Details</Text>
                </Button>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor:'#455a64'
    },
    buttonText: {
        fontSize:16,
        fontWeight:'500',
        color:'#ffffff',
        textAlign:'center'
    },
    indicator: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
});