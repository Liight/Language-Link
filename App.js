/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Button } from "react-native";

import ImagePicker from "react-native-image-picker";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

export default class App extends Component {
  state = {
    pickedImage: null,
    data: []
  };

  callGoogleMachineLearningAPIHandler = () => {
    if (this.state.pickedImage.base64) {
      console.log("proceed checks out");
      fetch(
        "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDXe4ULuwFS-NcuXVgqAST6nWwz6S-CxBw",
        {
          // handshake
          method: "POST",
          body: JSON.stringify({
            requests: [
              {
                image: {
                  content: "" + this.state.pickedImage.base64 + ""
                },
                features: [
                  {
                    type: "LABEL_DETECTION",
                    maxResults: 3
                  }
                ], // features
                imageContext: {}
              }
            ] // requests
          }) // body
        }
      )
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          this.setState((oldState) => {
            return {
              ...oldState,
                data: responseJson
              }
          });
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      return;
    }
    console.log("received data: " + this.state.data[0])
  };

  pickImageHandler = () => {
    ImagePicker.showImagePicker(
      {
        // Same code as in above section!
        title: "Pick an image"
      },
      res => {
        if (res.didCancel) {
          console.log("User cancelled");
        } else if (res.error) {
        } else {
          this.setState({
            pickedImage: { uri: res.uri, base64: res.data }
          });
          console.log("base64 encode has been added to state: "+ this.state.pickedImage.base64);
          this.callGoogleMachineLearningAPIHandler();
        }
      }
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to Language-Link!</Text>
        <Text style={styles.instructions}>
          To get started, take a photo of something in your environment.
        </Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <Button title="Pick Image" onPress={this.pickImageHandler} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
