import React, { Component } from "react";
import { View, Picker, StyleSheet, TouchableOpacity, Text } from "react-native";

const TranslateOption = props => {
  console.log(props);

  return (
    <View>
      <View style={[styles.pickLanguageContainer, {
          borderColor: props.enablePhotoButton ? "#4BB543" : "#FF7F50"
      }]}>
        <Picker
          selectedValue={props.selectedLanguage}
          style={styles.picker}
          // mode="dropdown"
          onValueChange={(itemValue, itemIndex) => {
            if (itemValue === "unselectable") {
              return;
            }
            props.updateLanguage(itemValue);
          }}
        >
          <Picker.Item
            label="Pick a translation language"
            value="unselectable"
          />
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity
            activeOpacity={0.5}
            style={[
            styles.customBtnBG,
            {
                backgroundColor: props.enablePhotoButton ? "#FF7F50" : "#e4e4e4",
                opacity: props.enablePhotoButton ? 1.0 : 0.3,
                borderColor: props.enablePhotoButton ? "#FF7F50" : "#a4a4a4",
            }
            ]}
            onPress={props.pressed}
            disabled={!props.enablePhotoButton}
        >
            <Text style={styles.customBtnText}>
            {props.enablePhotoButton
                ? "Take a photo to translate objects"
                : "Please pick a language"}
            </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TranslateOption;

const styles = StyleSheet.create({
  picker: {
    width: 300,
    margin: 5,
    padding: 20,
    fontFamily: "Roboto",
    fontSize: 20,
    transform: [{ scaleX: 1.0 }, { scaleY: 1.0 }]
  },
  pickLanguageContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    fontFamily: "Roboto",
    marginBottom: 5,
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: 20,
    borderWidth: 3,
    borderColor: "#FF7F50",
    borderRadius: 50
  },
  pickLanguageText: {
    width: "100%",
    fontSize: 15,
    color: "black",
    textAlign: "center"
  },
  buttonContainer: {
    marginBottom: 10
  },
  buttonContainer: {
      marginLeft: "auto",
      marginRight: "auto"
  },
  customBtnBG: {
    color: "#333333",
    textTransform: "uppercase",
    backgroundColor: "#FF7F50",
    padding: 15,
    borderRadius: 50,
    width: "100%",
    opacity: 0.8,
    borderColor: "#a4a4a4",
    borderWidth: 3
  },
  customBtnText: {
    fontFamily: "Roboto",
    fontSize: 20,
    fontWeight: "bold",
    color: "#332211"
  }
});
