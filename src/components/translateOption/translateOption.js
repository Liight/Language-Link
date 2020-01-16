import React, { Component } from "react";
import { View, Picker, StyleSheet, TouchableOpacity, Text } from "react-native";

const TranslateOption = props => {
  console.log(props);

  const photoButton = props.selectedLanguage.length > 0 ? 
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        activeOpacity={0.5}
        style={[
          styles.customBtnBG,
          {
            backgroundColor: props.enablePhotoButton
              ? "rgba(0,250,0,0)"
              : "#e4e4e4",
            opacity: props.enablePhotoButton ? 1.0 : 0.4,
            borderColor: props.enablePhotoButton ? "orange" : "#a4a4a4",

          }
        ]}
        onPress={props.pressed}
        disabled={!props.enablePhotoButton}
      >
        <Text style={[styles.customBtnText, { color: props.enablePhotoButton ? "orange" : "#333333" }]}>
          {props.enablePhotoButton
            ? "Take a photo"
            : "Please pick a language"}
        </Text>
      </TouchableOpacity>
    </View>
    : null;

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.pickLanguageContainer,
          {
            borderColor: props.enablePhotoButton ? "#4BB543" : "orange",
            borderRadius: 50,
            // padding: 10,
            height: 75,
            width: 325,
            textAlign: "center",
            marginBottom: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: 'center'
          }
        ]}
      >
      {/* <View style={{flex: 0.35}}></View> */}
        <Picker
          selectedValue={props.selectedLanguage}
          style={[styles.picker, { backgroundColor: "transparent", marginLeft: "14%" }]}
          itemStyle={[styles.itemStyle, {  }]}
          // Picker Items are edited in android/app/src/res : /drawable/mydivider.xml & /values/styles.xml
          onValueChange={(itemValue, itemIndex) => {
            if (itemValue === "unselectable") {
              return;
            }
            props.updateLanguage(itemValue);
          }}
        >
          <Picker.Item
            label="Pick a language"
            value="unselectable"
            color="orange"
          />
          <Picker.Item label="French" value="fr" color="green"/>
          <Picker.Item label="German" value="de" color="green" />
          <Picker.Item label="Spanish" value="es" color="green" />
          
          <Picker.Item label="Samoan" value="sm" color="green" />
          <Picker.Item label="Maori" value="mi" color="green" />
          <Picker.Item label="Russian" value="ru" color="green" />
          <Picker.Item label="Afrikaans" value="af" color="green" />
          <Picker.Item label="Latin" value="la" color="green" />
          {/* <Picker.Item label="Norwegian" value="no" color="green" /> */}
          {/* <Picker.Item label="Punjabi" value="pa" /> */}
          {/* <Picker.Item label="Thai" value="th" /> */}
          {/* <Picker.Item label="Hindi" value="hi" /> */}
          {/* <Picker.Item label="Chinese (Simplified) " value="zh" /> */}
          {/* <Picker.Item label="Japanese" value="ja" /> */}
        </Picker>
      </View>
      {photoButton}
    </View>
  );
};

export default TranslateOption;

const styles = StyleSheet.create({
  wrapper:{
    marginTop: 20,
    marginBottom: 20,
  },
  picker: {
    width: 300,
  },
  itemStyle: {
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
    borderRadius: 0,
    textAlign: 'center'
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
    textTransform: "uppercase",
    borderRadius: 50,
    height: 75,
    width: 325,
    opacity: 0.8,
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
