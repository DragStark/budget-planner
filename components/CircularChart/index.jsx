import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import PieChart from "react-native-pie-chart";
import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CategoriesContext } from "@/context/CategoriesContext";

const CircularChart = () => {
  const [values, setValues] = useState([1]);
  const [colors, setColors] = useState([Colors.categories.a]);
  const [sliceColor, setSliceColor] = useState([Colors.categories.a]);
  const widthAndHeight = 150;
  const { categoriesList } = useContext(CategoriesContext);

  const updateCircularChart = () => {
    let newValues = [];
    let newColors = [];

    categoriesList.forEach((item, index) => {
      let itemTotalCost = 0;
      item?.CategoryItems?.forEach((element) => {
        itemTotalCost += element.cost;
      });
      if (itemTotalCost !== 0) {
        newValues.push(itemTotalCost);
        newColors.push(item.color);
      }
      itemTotalCost = 0;
    });
    if (newValues.length > 0) {
      setColors(newColors);
      setValues(newValues);
    } else {
      setValues([1]); // Default value to avoid empty chart
      setColors([Colors.categories.a]); // Default color
    }
  };

  const totalEstimate = () => {
    let totalEstimate = 0;
    values.forEach((value) => {
      totalEstimate += value;
    });
    return totalEstimate;
  };

  useEffect(() => {
    updateCircularChart();
  }, [categoriesList]);

  return (
    <View style={styles.container}>
      <View style={{ display: "flex", flexDirection: "row", marginBottom: 20 }}>
        <Text style={{ fontFamily: "ar" }}>Tổng đã chi:</Text>
        <Text style={{ fontFamily: "ab" }}> {totalEstimate()} $ </Text>
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
          <ScrollView style={styles.chartItemList}>
            {categoriesList.length > 0 ? (
              categoriesList.map((category) => (
                <View key={category.id} style={styles.chartItemListContainer}>
                  <Ionicons name="ellipse" size={24} color={category.color} />
                  <Text>{category.name}</Text>
                </View>
              ))
            ) : (
              <>
                <Ionicons
                  name="ellipse"
                  size={24}
                  color={Colors.categories.a}
                />
                <Text>NA</Text>
              </>
            )}
          </ScrollView>
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
  },
  chartItemList: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    height: 180,
  },
  chartItemListContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 5,
  },
});
