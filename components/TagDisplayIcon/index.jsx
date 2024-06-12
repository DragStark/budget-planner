import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const DisplayIcon = ({ name, color, otherStyles, tagName, iconSize, showFullName }) => {
  const truncateTagName = (name) => {
    if (name.length > 8) {
      return name.substring(0, 5) + "...";
    }
    return name;
  };
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <View
        style={[
          {
            width: 40,
            height: 40,
            borderColor: Colors.TEXT,
            borderWidth: 0.5,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 5,
          },
          otherStyles,
        ]}
      >
        <Ionicons name={name} size={iconSize ? iconSize : 25} color={color} />
      </View>
      <Text>{tagName ? (showFullName ?  tagName : truncateTagName(tagName)) : ""}</Text>
    </View>
  );
};

export default DisplayIcon;
