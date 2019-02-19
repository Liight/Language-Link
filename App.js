/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button } from 'react-native';

import ImagePicker from 'react-native-image-picker';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});



export default class App extends Component {

  state = {
    pickedImage: null
  }


  pickImageHandler = () => {
    ImagePicker.showImagePicker({
      // Same code as in above section!
      title: "Pick an image"
    },
      res => {
        if (res.didCancel) {
          console.log("User cancelled")
        } else if (res.error) {
        } else {
          this.setState({
            pickedImage: { uri: res.uri, base64: res.data }
          });
          console.log(this.state.pickedImage)
        }
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to Language-Link!</Text>
        <Text style={styles.instructions}>To get started, take a photo of something in your environment.</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <Button title="Pick Image" onPress={this.pickImageHandler} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
