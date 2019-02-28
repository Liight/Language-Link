import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

export default class Table extends Component {
  renderRow(set, indx) {
    return (
      <View style={styles.rows} key={indx}>
        <View style={[styles.cells, {flex: 5, alignItems: "flex-end"}]}><Text style={styles.text}>{set.english}</Text></View>
        <View style={[styles.cells, {flex: 1, alignItems: "center"}]}><Text style={styles.text}>:</Text></View>
        <View style={[styles.cells, {flex: 5, alignItems: "flex-start"}]}><Text style={styles.text}>{set.translated}</Text></View>
      </View>
    );
  }

  render() {
    const words = this.props.wordsAndTranslations;
    // console.log("iterable table object: " , words);
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {
            words.map((pair, index) => {
                // console.log(pair);
                return this.renderRow(pair, index);
                })
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
    rows: {
        flex: 1, 
        alignSelf: "stretch", 
        flexDirection: "row",
        justifyContent: "center"
    },
    cells: {
        alignSelf: "stretch"
    },
    text: {
      fontSize: 20,
      fontFamily: "Roboto"
    }
});