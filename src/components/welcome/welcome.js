import React from "react";
import { View, Text, StyleSheet } from "react-native";

const welcome = props => {
  return (
    <View style={styles.welcomeContainer}>
      <Text style={styles.welcome}>Language-Link!</Text>
      <Text style={styles.instructions}>
        To get started, <Text style={styles.bold}>pick a language</Text> and <Text style={styles.bold}>take a photo</Text> of something in your
        environment.
      </Text>
    </View>
  );
};

export default welcome;

const styles = StyleSheet.create({
  welcomeContainer: {
    position: "relative",
    backgroundColor: "#e9e6e8" // new
  },
  welcome: {
    fontSize: 32,
    textAlign: "center",
    marginTop: 10,
    // marginTop: 45,
    paddingTop: 50,
    color: "#333333", 
    fontFamily: "Roboto",
    paddingLeft: "20%",
    paddingRight: "20%"
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    padding: 20,
    paddingLeft: "20%",
    paddingRight: "20%",
    marginBottom: 5,
    fontFamily: "Roboto",
    fontSize: 22
  },
  bold: {
    fontWeight: "bold"
  }
});
