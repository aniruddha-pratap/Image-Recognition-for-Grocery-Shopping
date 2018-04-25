import React from 'react';
import {View, Text, Dimensions, StyleSheet, TouchableOpacity} from 'react-native';

export default class SideDrawer extends React.Component {

    render () {
        return (
            <View style={[
                styles.container,
                { width: Dimensions.get("window").width * 0.8 }
            ]}>
                <TouchableOpacity>
                    <View style={styles.drawerItem}>
                        <Text>Sign Out</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 22,
        backgroundColor: 'white',
        flex: 1
    },
    drawerItem: {
        flexDirection: "row",
        alignItems: 'center'
    }
});