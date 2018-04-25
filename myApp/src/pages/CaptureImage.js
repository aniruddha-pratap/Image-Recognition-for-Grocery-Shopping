import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import PickImage from '../components/PickImage';
import SideDrawer from '../components/SideDrawer';

export default class CaptureImage extends React.Component {

    state = {
        controls : {
            image: {
                value: null,
                valid: false
            }
        }
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
        console.log("Image Uploaded");
    };

    render() {
        return (
            <View style={styles.container}>
                <SideDrawer/>
                <PickImage onImagePicked={this.imagePickedHandler}/>
                <View>
                    <TouchableOpacity disabled={!this.state.controls.image.valid} onPress={this.uploadImage}>
                        <View style={styles.buttonContainer}>
                            <Icon name="md-cloud-upload" size={70} color='#fff'/>
                            <Text style={styles.buttonText}></Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor:'#455a64',
        justifyContent:'center',
        alignItems: 'center'
    },
    button: {
        width: 200,
        backgroundColor:'#c50e29',
        borderRadius: 25,
        marginVertical: 20
    },
    buttonText: {
        fontSize:16,
        fontWeight:'500',
        color:'#ffffff',
        textAlign:'center'
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center"
    }
});