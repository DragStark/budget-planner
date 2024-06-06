import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import PieChart from "react-native-pie-chart";
import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

const CircularChart = () => {
  const [values, setValues] = useState([1]);
  const [colors, setcolors] = useState([Colors.categories.a]);
  const widthAndHeight = 150;

  return (
    <View style={styles.container}>
      <View style={{ display: "flex", flexDirection: "row", marginBottom: 20 }}>
        <Text style={{fontFamily: 'rr'}}>Total Estimate:</Text>
        <Text style={{ fontFamily: 'rb' }}> 0$ </Text>
      </View>
      <View style={styles.subContainer}>
        <PieChart
          widthAndHeight={widthAndHeight}
          series={values}
          sliceColor={colors}
          coverRadius={0.65}
          coverFill={"#FFF"}
        />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
          }}
        >
          <Ionicons name="ellipse" size={24} color={Colors.categories.a} />
          <Text>NA</Text>
        </View>
      </View>
    </View>
  );
};

export default CircularChart;

const styles = StyleSheet.create({
  container: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: -50,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    shadowOpacity: 0.3,
    elevation: 1,
  },
  subContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 40,
  }
});
