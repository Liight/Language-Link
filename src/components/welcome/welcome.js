import React from "react";
import { View, Text, StyleSheet } from "react-native";

const welcome = props => {
  return (
    <View style={styles.welcomeContainer}>
      <Text style={styles.welcome}>Language-Link!</Text>
      <View style={styles.instructionContainer}>
        <Text style={styles.newInstructions}>To get started,</Text>
        <Text style={styles.newInstructions}><Text style={styles.bold}>first pick a language</Text></Text>
        <Text style={styles.newInstructions}><Text style={styles.bold}>and then take a photo</Text></Text>
        <Text style={styles.newInstructions}>This app will translate the objects in the photo into the language of your choice!</Text>
      </View>
    </View>
  );
};

export default welcome;

const styles = StyleSheet.create({
  welcomeContainer: {
    position: "relative",
    backgroundColor: "#F9F9F9", // new
    marginBottom: 20,
  },
  welcome: {
    fontSize: 32,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
    // marginTop: 45,
    paddingTop: 50,
    color: "#333333", 
    fontFamily: "Roboto",
    paddingLeft: "20%",
    paddingRight: "20%"
  },
  newInstructions: {
    textAlign: "center",
    color: "#333333",
    // padding: 20,
    paddingLeft: "20%",
    paddingRight: "20%",
    // marginBottom: 5,
    fontFamily: "Roboto",
    fontSize: 22
  },
  bold: {
    fontWeight: "bold"
  }
});
