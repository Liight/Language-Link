import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ScrollView
} from "react-native";
import ImagePicker from "react-native-image-picker";

export default class App extends Component {
  state = {
    showWelcome: true,
    showButton: true,
    loading: false,
    pickedImage: {},
    analysedImageData: [],
    translatedData: [],
    wordAssociationArray: []
  };

  pickImageHandler = () => {
    ImagePicker.launchCamera(
      {
        title: "Aim at the thing"
      },
      res => {
        if (res.didCancel) {
          console.log("User cancelled");
        } else if (res.error) {
        } else {
          this.setState(oldState => {
            return {
              ...oldState,
              pickedImage: { uri: res.uri, base64: res.data }
            };
          });
          this.processImageHandler(res.data);
          console.log(
            "base64 encode has been added to state: " +
              this.state.pickedImage.base64
          );
        }
      }
    );
  };

  processImageHandler = base64EncodedImage => {
    console.log("process image started");
    fetch(
      "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDXe4ULuwFS-NcuXVgqAST6nWwz6S-CxBw",
      {
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
                  maxResults: 7
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
        this.setState(oldState => {
          return {
            ...oldState,
            analysedImageData: responseJson
          };
        }, this.translateWordsHandler(responseJson));
      })
      .catch(error => {
        console.error(error);
      });
  };

  translateWordsHandler = wordsResponse => {
    // Translation processor
    let wordsList = [];
    wordsList = wordsResponse.responses[0].labelAnnotations.map(
      (item, index) => {
        return item.description;
      }
    );
    wordsList = wordsList.join();
    // API Call
    const baseURL = "https://translation.googleapis.com/language/translate/v2";
    const key = "?key=AIzaSyDXe4ULuwFS-NcuXVgqAST6nWwz6S-CxBw";
    const q = "&q=" + wordsList;
    const source = "&source=en";
    const target = "&target=fr";
    const format = "&format=text";
    fetch("" + baseURL + key + q + source + target + format + "", {
      method: "POST"
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          oldState => {
            return {
              ...oldState,
              translatedData: responseJson
            };
          },
          () => {
            this.associateWordsHandler();
          }
        );
      })
      .catch(error => {
        console.error(error);
      });
  };

  associateWordsHandler = () => {
    // Set english words for integration
    englishWords = [
      ...this.state.analysedImageData.responses[0].labelAnnotations
    ];
    englishWords = englishWords.map((item, index) => {
      return item.description;
    });
    // Set translated words for integration
    translatedWords = this.state.translatedData.data.translations[0].translatedText.split(
      ","
    );
    // Integrate the association of english and translated text
    integratedWordsList = englishWords.map((item, index) => {
      return {
        english: item,
        translated: translatedWords[index]
      };
    });
    this.setState(oldState => {
      return {
        ...oldState,
        wordAssociationArray: integratedWordsList
      };
    });
  };

  returnStateToConsoleHandler = () => {
    if (this.state.analysedImageData.responses) {
      console.log(this.state.analysedImageData.responses[0].labelAnnotations);
    }
    console.log(this.state.pickedImage.uri);
  };

  render() {

    let words = null;
    if (this.state.wordAssociationArray.length > 0) {
      words = [...this.state.wordAssociationArray].map((pair, index) => {
        return (
          <View key={index}>
            <Text style={styles.text}>
              {pair.english} : {pair.translated}
            </Text>
          </View>
        );
      });
    }

    let image = null;
    if (this.state.pickedImage.uri) {
      image = (
        <Image
          style={styles.image}
          source={{ uri: this.state.pickedImage.uri }}
        />
      );
    }

    let welcome = null;
    if (this.state.showWelcome) {
      welcome = (
        <View>
          <Text style={styles.welcome}>Welcome to Language-Link!</Text>
          <Text style={styles.instructions}>
            To get started, take a photo of something in your environment.
          </Text>
        </View>
      );
    }

    let button = null;
    if(this.state.showButton){
      let titleText = "Take photo";
      if(!this.state.showWelcome){
        titleText = "Take another photo"
      }
      button = (
        <View>
          <Button title={titleText} onPress={this.pickImageHandler} />
        </View>
      );
    }

    let loading = null;
    if(this.state.loading){
      loading = (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
      {welcome}
      {button}
      {loading}
        <View style={styles.results}>
          {words}
          {image}
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
  },
  image: {
    flex: 1,
    borderColor: "black",
    borderWidth: 1
  },
  text: {
    textAlign: "center"
  },
  results: {
    textAlign: "center",
    width: "100%",
    height: 500
  }
});
