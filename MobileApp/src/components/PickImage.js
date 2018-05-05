import React from 'react';
import {View, Image, TouchableOpacity, Text, StyleSheet, Platform} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';

export default class PickImage extends React.Component {

    state = {
        pickedImage: null
    };

    pickImageHandler = () => {
        ImagePicker.showImagePicker({
            title: "Pick an Image"
        }, res => {
            if(res.didCancel) {
                console.log("User hit cancel");
            } else if (res.error) {
                console.log(res.error)
            } else {
                this.setState({
                    pickedImage: {uri: res.uri}
                });
                this.props.onImagePicked({
                    uri: res.uri,
                    type: res.type,
                    fileName: res.fileName
                });
            }
        });
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.placeholder}>
                    <Image source={this.state.pickedImage} style={{height: '100%', width:'100%'}}
                            />
                </View>
                <View >
                    <TouchableOpacity onPress={this.pickImageHandler}>
                        <View style={styles.buttonContainer}>
                            <Icon name="md-aperture" size={70} color='#fff'/>
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
    placeholder: {
        borderWidth: 1,
        borderColor: '#FFF',
        backgroundColor: '#e5e5d8',
        width: 250,
        height: 250
    },
    button: {
        width: 200,
        backgroundColor:'#1c313a',
        borderRadius: 25,
        marginVertical: 20
    },
    buttonText: {
        fontSize:16,
        fontWeight:'500',
        color:'#ffffff',
        //textAlign:'center'
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 20
    }
});