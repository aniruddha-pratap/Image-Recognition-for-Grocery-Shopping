import React from 'react';
import { View, Image, Text, TextInput } from 'react-native';
import {Grid, Row, Col} from 'native-base';
import QtyInput from './QtyInput';

export default class ItemInCart extends React.Component {


    state = {
        price: 0
    };

    calculatePrice = (count) => {

        let price = this.props.product.price * count;

        fetch("http://35.162.162.0:3000/updateTotal", {
            method: "POST",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                quantity: count,
                product: this.props.product.name,
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if(count <= 0) {
                    this.props.fecthProcessed(count, this.props.product.name);
                }
            }).catch((error) => {
            console.log(error);
        });
        this.setState({
            price: price
        });

    };

    render () {
        return (
            <View style={{backgroundColor:"#FFF",marginBottom:5}}>
                <Grid style={{padding:10}}>
                    <Col size={3} style={{justifyContent:"center"}}>
                        <Text>{this.props.product.name}</Text>
                    </Col>
                    <Col size={7} style={{justifyContent:"center"}}>
                        <Row style={{marginTop:10}}>
                            <Col>
                                <Text style={{marginTop:5,fontWeight:'700'}}>${this.props.product.price}</Text>
                            </Col>
                            <Col style={{alignItems:'flex-end'}}>
                                <QtyInput
                                    orientation="horizontal"
                                    initialValue={this.props.product.qty}
                                    styleTextInput={{backgroundColor:"transparent",width:25}}
                                    styleButton={{alignItems:"center",borderRadius:50,padding:10}}
                                    onChangeText={this.calculatePrice}
                                    styleImage={{width:10,height:10}}
                                />
                            </Col>
                        </Row>

                    </Col>

                </Grid>
            </View>
        )
    }
}