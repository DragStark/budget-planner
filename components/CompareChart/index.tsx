import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { CategoriesContext } from "@/context/CategoriesContext";

type PROPS = {
  expense: number,
  income: number
}

const CompareChart = ({expense, income} : PROPS) => {
  const [barHeight, setBarHeight] = useState(0);

  const { expenseItems } = useContext(CategoriesContext);




  useEffect(() => {
    const percentage =
      (expense < income ? expense / income : income / expense) * 100;
    setBarHeight(percentage);
  }, [expenseItems]);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.bar,
          {
            height: `${expense < income ? 100 : barHeight}%`,
            backgroundColor: Colors.INCOME,
          },
        ]}
      />
      <View
        style={[
          styles.bar,
          {
            height: `${expense >= income ? 100 : barHeight}%`,
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
