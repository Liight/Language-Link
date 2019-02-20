import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Button } from "react-native";
import ImagePicker from "react-native-image-picker";

export default class App extends Component {

  state = {
    pickedImage: {},
    analysedImageData: []
  }

  pickImageHandler = () => {
    // Image Picker
    ImagePicker.launchCamera(
      {
        title: "Aim at the thing"
      },
      res => {
        if (res.didCancel) {
          console.log("User cancelled");
        } else if (res.error) {
        } else {
          this.setState((oldState) => {
            return {
              ...oldState,
              pickedImage: { uri: res.uri, base64: res.data }
            }
            
          });
          this.processImageHandler(res.data)
          console.log(
            "base64 encode has been added to state: " +
            this.state.pickedImage.base64
          );
        }
      }
    );
  };

  processImageHandler = (base64EncodedImage) => {
    // Image Processer
    console.log("process image started");
    fetch(
      "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDXe4ULuwFS-NcuXVgqAST6nWwz6S-CxBw",
      {
        // handshake
        method: "POST",
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: "" + base64EncodedImage + ""
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
        this.setState((oldState => {
          return {
            ...oldState,
            analysedImageData: responseJson
          }
          
        }))
      })
      .catch(error => {
        console.error(error);
      });
  };

  returnStateToConsoleHandler = () => {
    console.log(this.state.analysedImageData.responses[0].labelAnnotations)
  };

  render() {
    const instructions = Platform.select({
      ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
      android:
        "Double tap R on your keyboard to reload,\n" +
        "Shake or press menu button for dev menu"
    });

    let results = null;
    if(this.state.analysedImageData.responses) {
      console.log("label annotations is truthy");
      results = (
        this.state.analysedImageData.responses[0].labelAnnotations.map((item, index) => {
          return (<Text key={index} >{item.description}</Text>)
        })
      );
    }

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to Language-Link!</Text>
        <Text style={styles.instructions}>
          To get started, take a photo of something in your environment.
        </Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <Button title="Take photo" onPress={this.pickImageHandler} />
        <View>
          {/* <Button title="Print current state to the console" onPress={this.returnStateToConsoleHandler} /> */}
          {results}
        </View>
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
