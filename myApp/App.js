import React from 'react';
import { StyleSheet, StatusBar, View } from 'react-native';

import Routes from './src/Routes';

export default class App extends React.Component {
  render() {
    return (
      <Routes/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#455a64',
      alignItems: 'center',
      justifyContent: 'center'
  },
});
