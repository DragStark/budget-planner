import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { CategoriesContext } from "@/context/CategoriesContext";



const CompareChart = ({expense, income}) => {
  const [barHeight, setBarHeight] = useState(0);

  useEffect(() => {
    const percentage =
      (expense < income ? expense / income : income / expense) * 100;
    setBarHeight(percentage);
  }, [expense, income]);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.bar,
          {
            height: income === 0 ? 0 : `${expense <= income ? 100 : barHeight}%`,
            backgroundColor: Colors.INCOME,
          },
        ]}
      />
      <View
        style={[
          styles.bar,
          {
            height: expense === 0 ? 0 : `${expense > income ? 100 : barHeight}%`,
            backgroundColor: Colors.EXPENSE,
          },
        ]}
      />
    </View>
  );
};

export default CompareChart;

const styles = StyleSheet.create({
  container: {
    height: 120,
    width: 100,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  bar: {
    width: 30,
    borderRadius: 5,
  },
});
