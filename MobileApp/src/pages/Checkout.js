import React from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import { Container, Content, Form, Item, Input, Header, Icon, Title, Body, Button, Text } from 'native-base';
import { Actions } from 'react-native-router-flux';

export default class Checkout extends React.Component {

    state = {
        price: 0
    };

    componentDidMount() {
        fetch("http://35.162.162.0:3000/cart", {
            method: "GET",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(("Cart "+JSON.stringify(responseJson)));
                let price = 0;
                for(var i=0; i< responseJson.cart.length; i++) {
                    price = price + (Math.round(responseJson.cart[i].price).toFixed(2) * responseJson.cart[i].quantity);
                }
                this.setState({
                    price: Math.floor(price)
                });
            }).catch((error) => {
            console.log(error);
        });

    }

    checkout() {
        Alert.alert(
            'Order Complete',
            'Thank you for shopping with us!',
            [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
        )
    }

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

    render(){
        return (
            <Container style={styles.container}>
                <Header style={{backgroundColor: '#455a64', alignItems: 'center'}}>
                    <Title>Checkout</Title>
                    <Body >
                    <Button small iconLeft rounded
                            style={{alignSelf: 'flex-end', marginBottom: 10, backgroundColor:'transparent'}}
                            onPress={this.logout}>
                        <Icon name="md-exit" style={{paddingHorizontal: 10}} size={30} color='#fff'/>
                    </Button>
                    </Body>
                </Header>
                <Content padder>
                    <Text style={{color: '#ffffff', paddingBottom: 10, marginBottom: 10, marginTop: 10, paddingTop: 10}}>
                        Total amount for this purchase: ${this.state.price}
                    </Text>
                    <Form style={{paddingVertical: 10}}>
                        <Item>
                            <Icon active name='card'/>
                            <Input style={styles.input}
                                   placeholder="CardNumber"
                                   placeholderTextColor = "#ffffff"/>
                        </Item>
                        <Item style={styles.input}>
                            <Icon active name='person'/>
                            <Input style={styles.input}
                                   placeholder="Name On Card"
                                   placeholderTextColor = "#ffffff"/>
                        </Item>
                        <View style={{flexDirection: 'row'}}>
                            <Item last style={{width: '50%', color:'#ffffff'}} >
                                <Icon active name='calendar'/>
                                <Input style={styles.input}
                                       placeholder="MM/YY"
                                       placeholderTextColor = "#ffffff"/>
                            </Item>
                            <Item last style={{width: '50%', color:'#ffffff'}}>
                                <Icon active name='card'/>
                                <Input style={styles.input}
                                       placeholder="CVV"
                                       placeholderTextColor = "#ffffff"/>
                            </Item>
                        </View>
                    </Form>
                    <Form style={{paddingVertical: 10}}>
                        <Item>
                            <Input style={styles.input}
                                   placeholder="Delivery Street Address"
                                   placeholderTextColor = "#ffffff"/>
                        </Item>
                        <Item style={styles.input}>
                            <Input style={styles.input}
                                   placeholder="Delivery Street Address 2"
                                   placeholderTextColor = "#ffffff"/>
                        </Item>
                        <View style={{flexDirection: 'row'}}>
                            <Item last style={{width: '50%', color:'#ffffff'}} >
                                <Input style={styles.input}
                                       placeholder="Zip Code"
                                       placeholderTextColor = "#ffffff"/>
                            </Item>
                            <Item last style={{width: '50%', color:'#ffffff'}}>
                                <Input style={styles.input}
                                       placeholder="Apt"
                                       placeholderTextColor = "#ffffff"/>
                            </Item>
                        </View>
                    </Form>
                    <Text style={{paddingBottom: 10, marginBottom: 10, marginTop: 10, paddingTop: 10}}>
                        {this.state.message}
                    </Text>
                </Content>
                <Button full style={{backgroundColor:'#1c313a'}} onPress={this.checkout}>
                    <Text>Pay</Text>
                </Button>
            </Container>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#455a64'
    },
    input: {
        color:'#ffffff'
    }
});