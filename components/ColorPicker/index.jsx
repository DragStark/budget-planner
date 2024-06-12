import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";

const ColorPicker = ({ selectedColor, onSelectColor }) => {
  return (
    <View style={styles.container}>
      {Colors.list.map((color, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.colorCircle,
            { backgroundColor: color },
            selectedColor === color && styles.selectedCircle,
          ]}
          onPress={() => onSelectColor(color)}
        />
      ))}
    </View>
  );
};

export default ColorPicker;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // Arrange the color circles in a row
    flexWrap: "wrap", // Wrap to the next line if necessary
    padding: 10, // Add some padding around the container
  },
  colorCircle: {
    height: 30,
    width: 30,
    borderRadius: 15, // Adjusted to 15 to make it a perfect circle
    margin: 5, // Add some margin around each circle
  },
  selectedCircle: {
    borderWidth: 4,
    borderColor: "black",
  },
});
