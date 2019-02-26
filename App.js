import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  Picker
} from "react-native";
import ImagePicker from "react-native-image-picker";
import Table from './src/components/table/table';

export default class App extends Component {
  state = {
    showWelcome: true,
    showButton: true,
    loading: false,
    showPickLanguage: true,
    selectedLanguage: "",
    enablePhotoButton: false,
    pickedImage: {},
    analysedImageData: [],
    translatedData: [],
    wordAssociationArray: []
  };

  pickImageHandler = () => {
    if (!this.state.loading) {
      this.toggleLoadingState();
    }
    if (this.state.showWelcome) {
      this.toggleWelcomeScreen();
    }
    ImagePicker.launchCamera(
      {
        title: "Aim at the thing",
        quality: 0.5
      },
      res => {
        if (res.didCancel) {
          console.log("User cancelled");
          if (this.state.loading) {
            this.toggleLoadingState();
          }
          this.toggleWelcomeScreen();
        } else if (res.error) {

        } else {
          this.setState(oldState => {
            return {
              ...oldState,
              pickedImage: { uri: res.uri, base64: res.data }
            };
          });
          this.processImageHandler(res.data);
          // console.log(
          //   "base64 encode has been added to state: " +
          //     this.state.pickedImage.base64
          // );
        }
      }
    );
  };

  toggleWelcomeScreen = () => {
    this.setState(oldState => {
      return {
        ...oldState,
        showWelcome: !this.state.showWelcome
      };
    });
  };

  toggleLoadingState = () => {
    this.setState(oldState => {
      return {
        ...oldState,
        loading: !this.state.loading
      };
    });
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
        // console.log(responseJson);
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
    const target = "&target=" + this.state.selectedLanguage;
    const format = "&format=text";
    fetch("" + baseURL + key + q + source + target + format + "", {
      method: "POST"
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson)
        this.setState(
          oldState => {
            return {
              ...oldState,
              translatedData: responseJson
            };
          },
          () => {
            if (responseJson.data === undefined) {
              console.log("undefined response object: ", responseJson)
              alert("Something went wrong, please try again");
              this.toggleWelcomeScreen();
              this.toggleLoadingState();
              return;
            }
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
    this.toggleLoadingState();
  };

  returnStateToConsoleHandler = () => {
    if (this.state.analysedImageData.responses) {
      console.log(this.state.analysedImageData.responses[0].labelAnnotations);
    }
    console.log(this.state.pickedImage.uri);
  };

  getWordAssociationArrayHandler = () => {
    waa = [...this.state.wordAssociationArray];
    return waa;
  }

  render() {

    let words = null;
    if (this.state.wordAssociationArray.length > 0 && !this.state.loading) {
        words = <Table wordsAndTranslations={this.getWordAssociationArrayHandler()}/>
    };

    // let words = null;
    // if (this.state.wordAssociationArray.length > 0 && !this.state.loading) {
    //   words = [...this.state.wordAssociationArray].map((pair, index) => {
    //     return (
    //       <View key={index} style={styles.textContainer}>
    //         <Text style={styles.text}>
    //           {pair.english} : {pair.translated}
    //         </Text>
    //       </View>
    //     );
    //   });
    // };

    let image = null;
    if (this.state.pickedImage.uri && !this.state.loading) {
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
            To get started, pick a language and take a photo of something in your environment.
          </Text>
        </View>
      );
    }

    let pickLanguage = null;
    if (this.state.showPickLanguage && !this.state.loading) {
      pickLanguage = (
        <View style={styles.pickLanguageContainer}>
          <Picker
            selectedValue={this.state.selectedLanguage}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => {
              if (itemValue === "unselectable") {
                return;
              };
              this.setState(oldState => { return { ...oldState, selectedLanguage: itemValue, enablePhotoButton: true } });
            }}
          >
            <Picker.Item label="Pick a translation language" value="unselectable" />
            <Picker.Item label="French" value="fr" />
            <Picker.Item label="German" value="de" />
            <Picker.Item label="Spanish" value="es" />
            <Picker.Item label="Norwegian" value="no" />
            <Picker.Item label="Samoan" value="sm" />
            <Picker.Item label="Hindi" value="hi" />
            <Picker.Item label="Maori" value="mi" />
            <Picker.Item label="Russian" value="ru" />
          </Picker>
        </View>
      );
    }



    let button = null;
    if (this.state.showButton && !this.state.loading) {
      let titleText = "Take photo to translate objects";
      if (!this.state.showWelcome) {
        titleText = "Take another photo";
      }
      button = (
        <View style={styles.buttonContainer}>
          <Button title={titleText} onPress={this.pickImageHandler} disabled={!this.state.enablePhotoButton} />
        </View>
      );
    }

    let loading = null;
    if (this.state.loading) {
      loading = (
        <View style={styles.loading}>
          <Text>Loading...</Text>
        </View>
      );
    }

    return (
      <View style={styles.containerBackground}>
        <View style={styles.container}>
          {welcome}
          {pickLanguage}
          {button}
          {loading}
          <View style={styles.results}>
            {words}
            {image}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    borderColor: "#000000",
    borderWidth: 1,
    borderRadius: 5
  },
  containerBackground: {
    backgroundColor: "#000000"
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    marginBottom: 10
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
    marginTop: 45,
    color: "#333333",
    fontFamily: "Roboto"
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    padding: 20,
    marginBottom: 5,
    fontFamily: "Roboto",
    fontSize: 15
  },
  image: {
    flex: 1,
    borderColor: "black",
    borderWidth: 1,
    margin: 5
  },
  text: {
    textAlign: "center",
    fontFamily: "Roboto",
    fontSize: 18
  },
  results: {
    // textAlign: "center",
    width: "100%",
    height: 500,
    fontFamily: "Roboto",
    fontSize: 18
  },
  buttonContainer: {
    marginBottom: 10
  },
  pickLanguageContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    fontFamily: "Roboto",
    // backgroundColor: "#fff",
    // borderColor: "#fff",
    // borderWidth: 2,
    marginBottom: 5
  },
  picker: {
    width: 300,
    margin: 5,
    fontFamily: "Roboto"
  },
  pickLanguageText: {
    width: "100%",
    fontSize: 15,
    color: "black",
    textAlign: "center"
  },
  loading: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  }
});
