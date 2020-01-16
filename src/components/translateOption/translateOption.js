import React, { Component } from "react";
import { View, Picker, StyleSheet, TouchableOpacity, Text } from "react-native";

const TranslateOption = props => {
  console.log(props);

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.pickLanguageContainer,
          {
            borderColor: props.enablePhotoButton ? "#4BB543" : "#4cb6fe",
            borderRadius: 50,
            // padding: 10,
            height: 75,
            width: 325,
            textAlign: "center",
            marginBottom: 10
          }
        ]}
      >
        <Picker
          selectedValue={props.selectedLanguage}
          style={[styles.picker, {  }]}
          // placeholder={{ backgroundColor: "#F5F5F5", }}
          // Picker Items are edited in android/app/src/res : /drawable/mydivider.xml & /values/styles.xml
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
          {/* <Picker.Item label="Hindi" value="hi" /> */}
          <Picker.Item label="Maori" value="mi" />
          <Picker.Item label="Russian" value="ru" />
          <Picker.Item label="Afrikaans" value="af" />
          {/* <Picker.Item label="Chinese (Simplified) " value="zh" /> */}
          {/* <Picker.Item label="Japanese" value="ja" /> */}
          <Picker.Item label="Latin" value="la" />
          {/* <Picker.Item label="Punjabi" value="pa" /> */}
          {/* <Picker.Item label="Thai" value="th" /> */}
        </Picker>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={[
            styles.customBtnBG,
            {
              backgroundColor: props.enablePhotoButton
                ? "#29abe2"
                : "#e4e4e4",
              opacity: props.enablePhotoButton ? 1.0 : 0.4,
              borderColor: props.enablePhotoButton ? "#29abe2" : "#a4a4a4",
              
            }
          ]}
          onPress={props.pressed}
          disabled={!props.enablePhotoButton}
        >
          <Text style={[styles.customBtnText, { color: props.enablePhotoButton ? "#FFFFFF" : "#333333" }]}>
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
  wrapper:{
    marginTop: 20,
    marginBottom: 0,
  },
  picker: {
    width: 300,
    margin: 0,
    padding: 0,
    fontFamily: "Roboto",
    // fontSize: 30,
    backgroundColor: "#F5F5F5",
    borderRadius: 50,
    textAlign: "center",
    transform: [{ scaleX: 1.0 }, { scaleY: 1.0 }],
    borderRadius: 50
  },
  pickerItems: {
    backgroundColor: "#F5F5F5",
    textAlign: "center",
    fontSize: 20,
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
    borderColor: "#F5F5F5",
    borderRadius: 0
  },
  pickLanguageText: {
    width: "100%",
    fontSize: 22,
    padding: 10,
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
    flex: 0,
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    // color: "#333333",
    textTransform: "uppercase",
    // backgroundColor: "#FF7F50",
    // padding: 15,
    borderRadius: 50,
    height: 75,
    width: 325,
    opacity: 0.8,
    // borderColor: "#a4a4a4",
    borderWidth: 3,
  },
  customBtnText: {
    fontFamily: "Roboto",
    fontSize: 20,
    fontWeight: "bold",
    color: "#332211",
    textAlign: "center"
  }
});
