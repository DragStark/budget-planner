import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import CompareChart from "@/components/CompareChart";
import DayList from "@/components/ExpenseTrackList/DayList";
import { CategoriesContext } from "@/context/CategoriesContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import ProgressBar from "../../../components/ProgressBar";

const PlanTracking = () => {
  const { expenseItems, fetchExpenseItems } = useContext(CategoriesContext);
  const { dateStart, dateEnd, name, budget, progress, detail } =
    useLocalSearchParams();

  const filteredByTimeOption = () => {
    let filteredItems = [];
    filteredItems = expenseItems.filter((item) => {
      return (
        new Date(item.time) >= new Date(dateStart) &&
        new Date(item.time) <= new Date(dateEnd)
      );
    });

    // Sort the filtered items by time
    filteredItems.sort((a, b) => new Date(a.time) - new Date(b.time));
    return filteredItems;
  };

  useEffect(() => {
    fetchExpenseItems();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{ marginRight: 60 }}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={30} color={"white"} />
        </TouchableOpacity>
        <View
          style={{
            width: "50%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.headerText}>{name}</Text>
        </View>
      </View>
      <View style={styles.chartDeck}>
        <View style={{ height: 60}}>
          <Text style={{ fontFamily: "ar", fontSize: 16 }}>
            <Text style={{ fontFamily: "ab", fontSize: 16 }}>Ghi chú :</Text>{" "}
            {detail}
          </Text>
          <Text style={{ fontFamily: "ar", fontSize: 16 }}>
            <Text style={{ fontFamily: "ab", fontSize: 16 }}>Thời gian :</Text>{" "}
            {new Date(dateStart).toLocaleDateString()} -{" "}
            {new Date(dateEnd).toLocaleDateString()}
          </Text>
        </View>
        <ProgressBar budget={budget} progress={progress} />
      </View>
      <Text
        style={{
          fontSize: 20,
          fontFamily: "ab",
          color: Colors.TEXT,
          marginLeft: 20,
          marginBottom: 10,
        }}
      >
        Theo dõi thu chi
      </Text>
      <ScrollView style={styles.listContainer}>
        <DayList expenseItems={filteredByTimeOption().reverse()} itemDisable={true}/>
      </ScrollView>
    </View>
  );
};

export default PlanTracking;

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
    alignItems: "flex-end",
    flexDirection: "row",
    paddingBottom: 20,
    paddingLeft: 20,
  },
  headerText: {
    color: "white",
    fontFamily: "ab",
    fontSize: 20,
  },
  chartDeck: {
    margin: 20,
    backgroundColor: "white",
    width: "90%",
    height: 160,
    padding: 20,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    gap: 10,
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
