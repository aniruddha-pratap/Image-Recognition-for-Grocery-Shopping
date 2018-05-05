import React from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';

export default class Logo extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Image style={{height: 90, width:90}}
                       source={require('../images/cart.jpeg')}/>
                <Text style={styles.logoText}>Welcome to Clicked!</Text>
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
