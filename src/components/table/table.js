import React, { Component } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import Tts from 'react-native-tts';

export default class Table extends Component {

  saySpeech = (text, sl) => {
    console.log("text : "+text)
    Tts.getInitStatus().then(() => {
      Tts.setDefaultLanguage(sl);
      Tts.setDefaultRate(0.6);
      Tts.setDefaultPitch(1.0);
      Tts.voices().then(voices => console.log(voices));
      Tts.speak(text);
      // Tts.stop();
    }).catch((err) => {console.log(err)});
  }

  renderRow(set, indx) {
    const button2 = (
      <TouchableOpacity style={styles.button} onPress={() => this.saySpeech(set.translated, this.props.selectedLanguage)}>
        <View style={styles.buttonTextWrapper}>
          <Text style={styles.buttonText}>Click to say aloud</Text>
        </View>
      </TouchableOpacity>
    );
    const button = (set.english.length > 0 && set.translated.length > 0) ? <Button title="Say Aloud" style={styles.button} onPress={() => this.saySpeech(set.translated, this.props.selectedLanguage)} /> : null;
    return (
        <View style={styles.rows} key={indx}>
          <View style={[styles.cells, { alignItems: "center" }]}>
            <Text style={styles.text}>{set.english}</Text>
          </View>
          {/* <View style={[styles.cells, {flex: 1, alignItems: "center"}]}><Text style={styles.text}>:</Text></View> */}
          <View style={[styles.cells, { alignItems: "center" }]}>
            <Text style={styles.text}>{set.translated}</Text>
          </View>
          {button2}
        </View>
    );
  }

  render() {
    const words = this.props.wordsAndTranslations;
    // console.log("iterable table object: " , words);
    return (
      <View
        style={[
          { flex: 0, flexDirection: "column", alignItems: "center", justifyContent: "center" },
          styles.table
        ]}
      >
        <Text style={styles.tableHeadingText}>Results</Text>
        {words.map((pair, index) => {
          // console.log(pair);
          return this.renderRow(pair, index);
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rows: {
    flex: 1,
    // alignSelf: "stretch",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    overflow: "hidden",
    height: 99,
    width: "100%",
    borderTopColor: "#E5E5E5",
    borderTopWidth: 0.5
  },
  'rows:first-child':{
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: 1
  },
  cells: {
    height: 33
  },
  text: {
    fontSize: 20,
    fontFamily: "Roboto"
  },
  tableHeadingText: {
    flex: 1, 
    width: "100%",
    flexDirection: "column",
    // height: "100%",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 24,
    padding: 0,
    textAlign: "center"
  },
  button: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 33,
    padding: 5,
    margin: 0,
  },
  buttonTextWrapper: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "auto",
    height: "auto",
    paddingLeft: 5,
    paddingRight: 5,
    margin: 0,
    borderColor: "orange",
    borderRadius: 20,
    borderWidth: 1,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 20,
    color: "orange"
  }
});
