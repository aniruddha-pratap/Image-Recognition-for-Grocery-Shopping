import React, { Component } from 'react';
import {View, StyleSheet} from 'react-native';
import {Container,
    Header,
    Content,
    Body,
    Text,
    Button,
    Title
} from 'native-base';
import ItemInCart from '../components/ItemInCart';
import Icon from 'react-native-vector-icons/Ionicons';
import { Actions } from 'react-native-router-flux';

export default class CartScreen extends Component {
    state = {
        products: [],
        price: 0
    };


    componentDidMount() {
        let products = [];
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
                    let obj = {};
                    obj.name = responseJson.cart[i].product;
                    obj.qty = responseJson.cart[i].quantity;
                    obj.price = Math.round(responseJson.cart[i].price).toFixed(2);
                    price = price + (Math.round(responseJson.cart[i].price).toFixed(2) * responseJson.cart[i].quantity);
                    products.push(obj);
                }

                console.log("Product "+products[0].name);
                this.setState({
                    products: this.state.products.concat(products),
                    price: Math.floor(price)
                });
            }).catch((error) => {
            console.log(error);
        });

    }

    totPrice = (count, name) => {
        console.log("Old price "+count+" name "+name);
        const products = this.state.products;

        fetch("http://35.162.162.0:3000/cartRemove", {
            method: "POST",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                product: name,
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("Deleted "+JSON.stringify(responseJson));
                for(var i=0; i<products.length; i++) {
                    if(products[i].name == name) {
                        console.log("Found ");
                        products.splice(i, 1);
                        this.setState({
                            products: products
                        });
                    }
                }
            }).catch((error) => {
            console.log(error);
        });
    };

    deletePersonHandler = (cartIndex) => {
        const products = this.state.products;
        products.splice(cartIndex, 1);
        this.setState({
            products: products
        });
    };

    checkout = () => {
        Actions.checkout();
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

        let products = null;

        if(this.state.products.length > 0) {
            console.log("Products length "+this.state.products.length);

            products = (
                <Content padder>
                    {this.state.products.map((product, index) => {
                        return (
                            <ItemInCart product={product}
                                      key={index}
                                      fecthProcessed={this.totPrice}
                            />
                        )
                    })}
                </Content>
            )
        }

        return (
            <Container style={styles.container}>
                <Header style={{backgroundColor: '#455a64', alignItems: 'center'}} rounded>
                    <Title>Cart</Title>
                    <Body >
                    <Button small iconLeft rounded
                            style={{alignSelf: 'flex-end', marginBottom: 10, backgroundColor:'transparent'}}
                            onPress={this.logout}>
                        <Icon name="md-exit" style={{paddingHorizontal: 10}} size={30} color='#fff'/>
                    </Button>
                    </Body>
                </Header>
                {products}
                <View>
                    <Text style={{textAlign:'center',fontWeight:'700'}}>{this.state.products.length} Items</Text>
                </View>
                <Button full style={{backgroundColor:'#1c313a'}} onPress={this.checkout}><Text>Checkout</Text></Button>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#455a64'
    }
});
