import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { CategoriesContext } from "@/context/CategoriesContext";

const CompareChart = () => {
  const [barHeight, setBarHeight] = useState(0);

  const { expenseItems } = useContext(CategoriesContext);

  const totalExpense = () => {
    let total = 0;
    expenseItems.forEach((item) => {
      if (item.type === "expense") total += item.money;
    });
    return total;
  };

  const totalIncome = () => {
    let total = 0;
    expenseItems.forEach((item) => {
      if (item.type === "income") total += item.money;
    });
    return total;
  };

  useEffect(() => {
    const income = totalIncome();
    const expense = totalExpense();
    const percentage = (expense / income) * 100;
    setBarHeight(percentage);
  }, [expenseItems]);

  return (
    <View style={styles.container}>
      <View style={[styles.bar, { height: `${100 - barHeight}%`, backgroundColor: Colors.INCOME }]} />
      <View style={[styles.bar, { height: `${barHeight}%`, backgroundColor: Colors.EXPENSE }]} />
    </View>
  );
};

export default CompareChart;

const styles = StyleSheet.create({
  container: {
    height: 170,
    width: 100,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-end",
    justifyContent: 'center',
  },
  bar: {
    width: 30,
  },
});
