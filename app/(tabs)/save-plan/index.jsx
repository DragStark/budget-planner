import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";

const SavePlan = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Tạo lập các kế hoạch tiết kiệm</Text>
      </View>
      <View style={styles.contentContainer}>
        <TouchableOpacity style={styles.btn} onPress={()=> router.push("save-plan/budget-plan")}>
          <Text style={styles.btnLabel}>Kế hoạch chi tiêu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={()=> router.push("save-plan/installment")}>
          <Text style={styles.btnLabel}>Sổ tay trả góp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={()=> router.push("save-plan/periodic-invoices")}>
          <Text style={styles.btnLabel}>hóa đơn định kì</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={()=> router.push("save-plan/family-plan")}>
          <Text style={styles.btnLabel}>Sổ chi tiêu gia đình</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SavePlan;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    height: "100%",
  },
  header: {
    display: "flex",
    height: "12%",
    backgroundColor: Colors.PRIMARYA,
    marginBottom: 20,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontFamily: "ab",
    color: "white",
  },
  contentContainer: {
    display: "flex",
    alignItems: "center",
  },
  btn: {
    height: 60,
    width: "90%",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.PRIMARYA,
    marginBottom: 10,
  },
  btnLabel: {
    fontSize: 16,
    fontFamily: "ab",
    color: "white",
  },
});
