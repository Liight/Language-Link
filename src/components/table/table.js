import React, { Component } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
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
          {button}
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
    height: 80,
    width: "100%",
    borderTopColor: "#E5E5E5",
    borderTopWidth: 0.5
  },
  'rows:first-child':{
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: 1
  },
  cells: {},
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
    width: "80%",
    color: "orange",
    padding: 0,
  }
});
