import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ScrollView,
} from "react-native";
import ImagePicker from "react-native-image-picker";

export default class App extends Component {
  state = {
    pickedImage: {},
    analysedImageData: [],
    translatedData: [],
    wordAssociationArray: []
  };

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
        }
          , this.translateWordsHandler(responseJson));
      })
      .catch(error => {
        console.error(error);
      });

  };

  translateWordsHandler = (wordsResponse) => {
    // Translation processor
    let wordsList = [];
    wordsList = wordsResponse.responses[0].labelAnnotations.map((item, index) => {
      return item.description
    });
    wordsList = wordsList.join();
    // console.log("words list : ", wordsList);
    // API Call
    const baseURL = "https://translation.googleapis.com/language/translate/v2";
    const key = "?key=AIzaSyDXe4ULuwFS-NcuXVgqAST6nWwz6S-CxBw";
    const q = "&q=" + wordsList;
    const source = "&source=en";
    const target = "&target=fr";
    const format = "&format=text";
    fetch(
      "" + baseURL + key + q + source + target + format + "",
      {
        method: "POST"
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        //console.log(responseJson);
        this.setState(oldState => {
          return {
            ...oldState,
            translatedData: responseJson
          };
        }
          , () => {
            this.associateWordsHandler();
          });
      })
      .catch(error => {
        console.error(error);
      });
  };

  associateWordsHandler = () => {
    // Set english words for integration
    englishWords = [...this.state.analysedImageData.responses[0].labelAnnotations];
    englishWords = englishWords.map((item, index) => {
      return item.description
    });
    // console.log("englishWords: ", englishWords)
    // Set translated words for integration
    translatedWords = this.state.translatedData.data.translations[0].translatedText.split(",");
    // console.log("translated words : ", translatedWords)
    // Integrate the association of english and translated text
    integratedWordsList = englishWords.map((item, index) => {
      return {
        "english": item,
        "translated": translatedWords[index]
      }
    });
    // console.log("integratedWordsList: ", integratedWordsList)
    this.setState((oldState) => {
      return {
        ...oldState,
        wordAssociationArray: integratedWordsList
      }
    });
  };


  returnStateToConsoleHandler = () => {
    if (this.state.analysedImageData.responses) {
      console.log(this.state.analysedImageData.responses[0].labelAnnotations);
    }
    console.log(this.state.pickedImage.uri);
  };

  render() {
    // const instructions = Platform.select({
    //   ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
    //   android:
    //     "Double tap R on your keyboard to reload,\n" +
    //     "Shake or press menu button for dev menu"
    // });

    let words = null;
    if (this.state.wordAssociationArray.length > 0) {
      //console.log("wordAssociationArray has objects: ", this.state.wordAssociationArray);

      words = [...this.state.wordAssociationArray].map((pair, index) => {
        //console.log("pair - english: ", pair.english);
        //console.log("pair - translated: ", pair.translated);
        return (
          <View key={index}>
            <Text style={styles.text}>{pair.english} : {pair.translated}</Text>
          </View>
        );
      });

      // words = this.state.analysedImageData.responses[0].labelAnnotations.map(
      //   (item, index) => {
      //     if (item.score > 0.85) {
      //       // console.log("confident")
      //       return <Text key={index} style={styles.text}>{item.description}</Text>;
      //     } // else { console.log("not confident: ", item.score) }

      //   }
      // );
    };

    let image = null;
    if (this.state.pickedImage.uri) {
      image = (
        <Image
          style={styles.image}
          source={{ uri: this.state.pickedImage.uri }}
        />
      );
    }

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to Language-Link!</Text>
        <Text style={styles.instructions}>
          To get started, take a photo of something in your environment.
          </Text>
        {/* <Text style={styles.instructions}>{instructions}</Text> */}
        <Button title="Take photo" onPress={this.pickImageHandler} />
        {/* <Button title="Print current state to the console" onPress={this.returnStateToConsoleHandler} /> */}
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
