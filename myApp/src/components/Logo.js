import React from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';

export default class Logo extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Image style={{height: 40, width:70}}
                       source={require('../images/logo.jpg')}/>
                <Text style={styles.logoText}>Welcome to My app.</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        flexGrow: 1,
        justifyContent:'flex-end',
        alignItems: 'center'
    },
    logoText : {
        marginVertical: 15,
        fontSize:18,
        color:'rgba(255, 255, 255, 0.7)'
    }
});
