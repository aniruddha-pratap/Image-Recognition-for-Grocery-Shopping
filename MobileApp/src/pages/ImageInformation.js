import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Header, Title, Body, Container, Label, Button, Form, Text} from 'native-base';

import { Actions } from 'react-native-router-flux';

export default class ImageInformation extends React.Component {

    state = {
        nutrition: {}
    };

    addToCart = () => {
        fetch("http://35.162.162.0:3000/cart", {
            method: "POST",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                product: this.props.productName
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("Response "+responseJson.statusCode);
                Actions.cart();
            }).catch((error) => {
            console.error(error);
        });
        //Actions.cart();
        //this.httpClient.get('https://api.nal.usda.gov/ndb/nutrients/?format=json&api_key=vOcJ8s9IouIwURA4ldBwnF6C66gGxkETIWMq1LvY&nutrients=205&nutrients=204&nutrients=208&nutrients=269&ndbno='+ndbno+'');
    };


    componentDidMount() {
        console.log("Product Name "+this.props.productName);
        fetch('https://api.nal.usda.gov/ndb/search/?ds=Standard%20Reference&format=json&q='+this.props.productName+'+raw&sort=n&max=2&offset=0&api_key=vOcJ8s9IouIwURA4ldBwnF6C66gGxkETIWMq1LvY&fg=0900', {
            method: "GET",
            headers: {
                "Accept": 'application/json'
            }
        }).then((response) => response.json())
            .then((responseJson) => {
               console.log("Ndbno "+JSON.stringify(responseJson));
               if(responseJson.errors) {
                   this.nutrientsID();
               } else {
                   let ndbno = responseJson.list.item[0].ndbno;
                   this.nutrientsData(ndbno);
               }
               //  if(responseJson.list.item[0].ndbno) {
               //      let ndbno = responseJson.list.item[0].ndbno;
               //      this.nutrientsData(ndbno);
               //  } else {
               //      this.nutrientsID(name);
               //  }
            }).catch((error) => {
                console.log("In error "+error);
        })
    };

    nutrientsData(ndbno) {
        fetch('https://api.nal.usda.gov/ndb/nutrients/?format=json&api_key=vOcJ8s9IouIwURA4ldBwnF6C66gGxkETIWMq1LvY&nutrients=205&nutrients=204&nutrients=208&nutrients=269&ndbno='+ndbno+'', {
            method: "GET",
            headers: {
                "Accept": 'application/json'
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("Nutrient Info  "+JSON.stringify(responseJson));

                let energy = responseJson["report"].foods[0].nutrients[0].value + " kCal per cup";
                let sugars = responseJson["report"].foods[0].nutrients[1].value + " gms per cup";
                let fat = responseJson["report"].foods[0].nutrients[2].value + " gms per cup";
                let carbs = responseJson["report"].foods[0].nutrients[3].value + " gms per cup";
                //console.log("Nutrients "+responseJson["report"].foods[0].nutrients);

                this.setState({
                    nutrition : {
                        energy: energy,
                        sugar: sugars,
                        fat: fat,
                        carbs: carbs
                    }
                });
            }).catch((error) => {
            console.log("In error "+error);
        })
    }

    nutrientsID() {
        fetch('https://api.nal.usda.gov/ndb/search/?ds=Standard%20Reference&format=json&q='+this.props.productName+'+raw&sort=n&max=2&offset=0&api_key=vOcJ8s9IouIwURA4ldBwnF6C66gGxkETIWMq1LvY&fg=1100', {
            method: "GET",
            headers: {
                "Accept": 'application/json'
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("In nutrients id");
                if(responseJson["list"].item[0].ndbno){
                    var ndbno = responseJson["list"].item[0].ndbno;
                    this.nutrientsData(ndbno);
                }
            }).catch((error) => {
            console.log("In error "+error);
        });
    }



    render() {
        return (
          <Container style={styles.container}>
              <View style={styles.placeholder}>
                  <Image source={{uri: this.props.image}} style={{height: '100%', width:'100%'}}
                  />
              </View>
              <View>
                  <Form style={{paddingVertical: 5}}>
                      <View style={{flexDirection: 'row',
                                    marginVertical: 5,
                                    paddingVertical: 10,
                                    backgroundColor:'rgba(255, 255,255,0.2)',
                                    borderRadius: 25,
                                    borderWidth: 0.5,
                                    borderColor: '#1c313a'
                                     }}>
                          <Label style={styles.text}>
                              Name:
                          </Label>
                          <Text style={styles.text}>{this.props.productName}</Text>
                      </View>
                      <View style={{flexDirection: 'row',
                          marginVertical: 5,
                          paddingVertical: 10,
                          backgroundColor:'rgba(255, 255,255,0.2)',
                          borderRadius: 25,
                          borderWidth: 0.5,
                          borderColor: '#1c313a'
                      }}>
                          <Label style={styles.text}>
                              Condition:
                          </Label>
                          <Text style={styles.text}>{this.props.condition}</Text>
                      </View>
                      <View style={{flexDirection: 'row',
                          marginVertical: 5,
                          paddingVertical: 10,
                          backgroundColor:'rgba(255, 255,255,0.2)',
                          borderRadius: 25,
                          borderWidth: 0.5,
                          borderColor: '#1c313a'
                      }}>
                          <Label style={styles.text}>
                              Energy:
                          </Label>
                          <Text style={styles.text}>{this.state.nutrition.energy}</Text>
                      </View>
                      <View style={{flexDirection: 'row',
                          marginVertical: 5,
                          paddingVertical: 10,
                          backgroundColor:'rgba(255, 255,255,0.2)',
                          borderRadius: 25,
                          borderWidth: 0.5,
                          borderColor: '#1c313a'
                      }}>
                          <Label style={styles.text}>
                              Sugar:
                          </Label>
                          <Text style={styles.text}>{this.state.nutrition.sugar}</Text>
                      </View>
                      <View style={{flexDirection: 'row',
                          marginVertical: 5,
                          paddingVertical: 10,
                          backgroundColor:'rgba(255, 255,255,0.2)',
                          borderRadius: 25,
                          borderWidth: 0.5,
                          borderColor: '#1c313a'
                      }}>
                          <Label style={styles.text}>
                              Fat:
                          </Label>
                          <Text style={styles.text}>{this.state.nutrition.fat}</Text>
                      </View>
                      <View style={{flexDirection: 'row',
                          marginVertical: 5,
                          paddingVertical: 10,
                          width: 300,
                          backgroundColor:'rgba(255, 255,255,0.2)',
                          borderRadius: 25,
                          borderWidth: 0.5,
                          borderColor: '#1c313a'
                      }}>
                          <Label style={styles.text}>
                              Carbs:
                          </Label>
                          <Text style={styles.text}>{this.state.nutrition.carbs}</Text>
                      </View>
                  </Form>
              </View>
              <Button full style={{backgroundColor:'#1c313a', position: 'absolute', bottom: 0, width: '100%'}} onPress={this.addToCart}>
                  <Text>Add To Cart</Text>
              </Button>
          </Container>
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
        ...StyleSheet.absoluteFillObject,
        top: 20,
        left: 140,
        width: 100,
        height: 100
    },
    inputBox: {
        width:300,
        backgroundColor:'rgba(255, 255,255,0.2)',
        borderRadius: 25,
        paddingHorizontal:16,
        fontSize:20,
        fontWeight: 'bold',
        color:'#ffffff',
        marginVertical: 10
    },
    text: {
        paddingLeft: 20,
        fontSize:16,
        fontWeight:'800',
        color:'#ffffff',
        textAlign:'right'
    },
    label: {
        fontSize:20,
        fontWeight: '700',
        color: '#1c313a'
    }

});