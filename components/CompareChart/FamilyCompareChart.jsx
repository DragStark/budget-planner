import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { BarChart } from "react-native-gifted-charts";

const FamilyCompareChart = ({ expenseList, incomeList, colorList }) => {
  const [expenseBarData, setExpenseBarData] = useState([]);
  const [incomeBarData, setIncomeBarData] = useState([]);

  useEffect(() => {
    if (expenseList.length && incomeList.length && colorList.length) {
      const expenseData = expenseList.map((expense, index) => ({
        value: expense,
        label: "",
        frontColor: colorList[index],
      }));

      const incomeData = incomeList.map((income, index) => ({
        value: income,
        label: "",
        frontColor: colorList[index],
      }));

      setExpenseBarData(expenseData);
      setIncomeBarData(incomeData);
    }
  }, [expenseList, incomeList, colorList]);

  return (
    <View style={styles.container}>
      <Text style={styles.chartTitle}>Expenses</Text>
      <BarChart
        barWidth={22}
        noOfSections={3}
        barBorderRadius={4}
        frontColor="lightgray"
        data={expenseBarData}
        yAxisThickness={0}
        xAxisThickness={0}
      />
      <Text style={styles.chartTitle}>Incomes</Text>
      <BarChart
        barWidth={22}
        noOfSections={3}
        barBorderRadius={4}
        frontColor="lightgray"
        data={incomeBarData}
        yAxisThickness={0}
        xAxisThickness={0}
      />
    </View>
  );
};

export default FamilyCompareChart;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "90%",
    height: 600,
    margin: 20,
    padding: 10,
    borderRadius: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
