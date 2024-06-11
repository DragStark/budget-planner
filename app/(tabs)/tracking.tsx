import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import CompareChart from "@/components/CompareChart";
import DayList from "@/components/ExpenseTrackList/DayList";
import { CategoriesContext } from "@/context/CategoriesContext";

const Expenses = () => {
  const { expenseItems } = useContext(CategoriesContext);
  const totalExpense = () => {
    let total = 0;
    expenseItems.map((item) => {
      if (item.type === "expense") total += item.money;
    });
    return total;
  };

  const totalIncome = () => {
    let total = 0;
    expenseItems.map((item) => {
      if (item.type === "income") total += item.money;
    });
    return total;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.timeContainer}>
          <Text style={styles.headerText}>recent 1 month </Text>
        </View>
      </View>
      <View style={styles.chartDeck}>
        <View style={styles.compareContainer}>
          <View style={styles.chartContainer}>
            <CompareChart expense={totalExpense()} income={totalIncome()}/>
          </View>
          <View style={styles.chartInfoContainer}>
            <Text style={[styles.chartInfoText, { color: Colors.INCOME }]}>
              {totalIncome()}$
            </Text>

            <Text style={[styles.chartInfoText, { color: Colors.EXPENSE }]}>
              {totalExpense()}$
            </Text>
            <View style={{ borderTopWidth: 2, paddingTop: 10}}>
              <Text
                style={[styles.chartInfoText, { color: Colors.categories.b }]}
              >
                {+totalIncome() - totalExpense()}$
              </Text>
            </View>
          </View>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', gap: 20,}}>
          <Text style={{ textAlign: "center", color: Colors.INCOME, fontFamily: 'rsb' }}>
              Income
          </Text>
          <Text style={{ textAlign: "center", color: Colors.EXPENSE, fontFamily: 'rsb' }}>
              Expense
          </Text>
          <Text style={{ textAlign: "center", color: Colors.categories.b, fontFamily: 'rsb' }}>
              Compared
          </Text>
        </View>
      </View>
      <Text
        style={{
          fontSize: 20,
          fontFamily: "rb",
          color: Colors.TEXT,
          marginLeft: 20,
          marginBottom: 20,
        }}
      >
        Expense Track
      </Text>
      <ScrollView style={styles.listContainer}>
        <DayList />
      </ScrollView>
    </View>
  );
};

export default Expenses;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  header: {
    height: "12%",
    backgroundColor: Colors.PRIMARYA,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontFamily: "rr",
    fontSize: 20,
  },
  timeContainer: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.PRIMARYB,
    padding: 10,
  },
  chartDeck: {
    margin: 20,
    backgroundColor: "white",
    height: 250,
    padding: 20,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  compareContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 30,
    justifyContent: "space-between",
  },
  chartContainer: {
    height: 100,
  },
  chartInfoContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  chartInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
  },
  chartInfoText: {
    fontSize: 16,
    fontFamily: "rsb",
  },
  listContainer: {},
  addBtnContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "white",
    padding: 0,
    borderRadius: 50,
  },
});
