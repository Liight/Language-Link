import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const welcome = (props) => {

    return (
        <View style={styles.welcomeContainer}>
            <Text style={styles.welcome}>Welcome to Language-Link!</Text>
            <Text style={styles.instructions}>
            To get started, pick a language and take a photo of something in
            your environment.
            </Text>
      </View>
    );

};

export default welcome;

const styles = StyleSheet.create({
    welcomeContainer: {
        position: "relative",

    },
    welcome: {
        fontSize: 32,
        textAlign: "center",
        margin: 10,
        // marginTop: 45,
        // paddingTop: 50,
        color: "#333333",
        fontFamily: "Roboto",
        paddingLeft: "20%",
        paddingRight: "20%",
    
      },
      instructions: {
        textAlign: "center",
        color: "#333333",
        padding: 20,
        paddingLeft: "20%",
        paddingRight: "20%",
        marginBottom: 5,
        fontFamily: "Roboto",
        fontSize: 22,
      },
});