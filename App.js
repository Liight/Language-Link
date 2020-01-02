import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import ImagePicker from "react-native-image-picker";
import Table from "./src/components/table/table";
import Welcome from "./src/components/welcome/welcome";
import TranslateOption from "./src/components/translateOption/translateOption";

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
        title: "Snap the object(s) to be translated",
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
        console.log(responseJson);
        this.setState(
          oldState => {
            return {
              ...oldState,
              translatedData: responseJson
            };
          },
          () => {
            if (responseJson.data === undefined) {
              console.log("undefined response object: ", responseJson);
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

  getWordAssociationArrayHandler = () => {
    waa = [...this.state.wordAssociationArray];
    return waa;
  };

  updateSelectedLanguageHandler = language => {
    this.setState(oldState => {
      return {
        ...oldState,
        selectedLanguage: language,
        enablePhotoButton: true
      };
    });
  };

  render() {
    let loading = null;
    if (this.state.loading) {
      loading = (
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }
    this.state.showPickLanguage && !this.state.loading;

    return (
      <View style={styles.containerBackground}>
        <View style={styles.container}>
          {this.state.showWelcome ? <Welcome /> : null}
          {this.state.showPickLanguage && !this.state.loading ? (
            <TranslateOption
              updateLanguage={this.updateSelectedLanguageHandler}
              selectedLanguage={this.state.selectedLanguage}
              enablePhotoButton={this.state.enablePhotoButton}
              pressed={this.pickImageHandler}
              showButton={this.state.showButton}
              loading={this.state.loading}
              showWelcome={this.state.showWelcome}
            />
          ) : null}
          {loading}
          <View style={[styles.results, {flex: this.state.showWelcome ? 1 : 0}]}>
            {this.state.wordAssociationArray.length > 0 &&
            !this.state.loading ? (
              <Table
                wordsAndTranslations={this.getWordAssociationArrayHandler()}
              />
            ) : null}

            {this.state.pickedImage.uri && !this.state.loading ? (
              <Image
                style={styles.image}
                source={{ uri: this.state.pickedImage.uri }}
              />
            ) : null}

          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: "100%",
    // height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e9e6e8",
    borderColor: "#000000",
    borderWidth: 1,
    borderRadius: 5
  },
  containerBackground: {
    flex: 1,
    backgroundColor: "#000000"
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    marginBottom: 10
  },
  image: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
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
    textAlign: "center",
    width: "100%",
    height: "60%",
    fontFamily: "Roboto",
    fontSize: 18
  },
  loading: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  loadingText: {
    fontSize: 50,
    fontFamily: "Roboto"
  }
});
