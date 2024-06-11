import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const DisplayIcon = ({ name, color, otherStyles, }) => {
  return (
    <View
      style={[
        {
          width: 50,
          height: 50,
          borderColor: Colors.TEXT,
          borderWidth: 1,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
        },
        otherStyles,
      ]}
    >
      <Ionicons name={name} size={30} color={color} />
    </View>
  );
};

export default DisplayIcon;
