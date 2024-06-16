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
import CustomModal from "@/components/CustomModal";

const Expenses = () => {
  const { expenseItems, fetchExpenseItems } = useContext(CategoriesContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [timeOption, setTimeOption] = useState(2);
  const [timeOptionLabel, setTimeOptionLabel] = useState("1 tháng gần đây");

  const filteredByTimeOption = () => {
    let filteredItems = [];
    const currDate = new Date();
    const pastDate = new Date();
    switch (timeOption) {
      case 1:
        pastDate.setDate(currDate.getDate() - 7);
        filteredItems = expenseItems.filter(
          (item) => new Date(item.time) > pastDate
        );
        break;
      case 2:
        pastDate.setDate(currDate.getDate() - 30);
        filteredItems = expenseItems.filter(
          (item) => new Date(item.time) > pastDate
        );
        break;
      case 3:
        pastDate.setDate(currDate.getDate() - 120);
        filteredItems = expenseItems.filter(
          (item) => new Date(item.time) > pastDate
        );
        break;
      case 4:
        pastDate.setDate(currDate.getDate() - 365);
        filteredItems = expenseItems.filter(
          (item) => new Date(item.time) > pastDate
        );
        break;
      default:
        filteredItems = expenseItems;
        break;
    }
    // Sort the filtered items by time
    filteredItems.sort((a, b) => new Date(a.time) - new Date(b.time));
    return filteredItems;
  };


  useEffect(() => {
    fetchExpenseItems();
  }, []);

  const totalExpense = () => {
    let total = 0;
    filteredByTimeOption().forEach((item) => {
      if (item.type === "expense") total += item.money;
    });
    return total;
  };

  const totalIncome = () => {
    let total = 0;
    filteredByTimeOption().forEach((item) => {
      if (item.type === "income") total += item.money;
    });
    return total;
  };

  if (!expenseItems) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.timeContainer}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.headerText}>{timeOptionLabel}</Text>
          </TouchableOpacity>
          <CustomModal isOpen={modalVisible} withInput={false}>
            <TouchableOpacity
              style={styles.timeOption}
              onPress={() => {
                setTimeOption(1)
                setModalVisible(false)
                setTimeOptionLabel("7 ngày gần đây")
              }}
            >
              <Text style={styles.timeOptionLabel}>7 ngày gần đây</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.timeOption}
              onPress={() => {
                setTimeOption(2)
                setModalVisible(false)
                setTimeOptionLabel("1 tháng gần đây")
              }}
            >
              <Text style={styles.timeOptionLabel}>1 tháng gần đây</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.timeOption}
              onPress={() => {
                setTimeOption(3)
                setModalVisible(false)
                setTimeOptionLabel("1 quý gần đây")
              }}
            >
              <Text style={styles.timeOptionLabel}>1 quý gần đây</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.timeOption}
              onPress={() => {
                setTimeOption(4)
                setModalVisible(false)
                setTimeOptionLabel("1 năm gần đây")
              }}
            >
              <Text style={styles.timeOptionLabel}>1 năm gần đây</Text>
            </TouchableOpacity>
          </CustomModal>
        </View>
      </View>
      <View style={styles.chartDeck}>
        <View style={styles.compareContainer}>
          <View style={styles.chartContainer}>
            <CompareChart expense={totalExpense()} income={totalIncome()} />
          </View>
          <View style={styles.chartInfoContainer}>
            <Text style={[styles.chartInfoText, { color: Colors.INCOME }]}>
              {totalIncome()}đ
            </Text>
            <Text style={[styles.chartInfoText, { color: Colors.EXPENSE }]}>
              {totalExpense()}đ
            </Text>
            <View style={{ borderTopWidth: 2, paddingTop: 10 }}>
              <Text
                style={[styles.chartInfoText, { color: Colors.categories.b }]}
              >
                {totalIncome() - totalExpense()}đ
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: Colors.INCOME,
              fontFamily: "ab",
              fontSize: 16,
            }}
          >
            Thu vào
          </Text>
          <Text
            style={{
              textAlign: "center",
              color: Colors.EXPENSE,
              fontFamily: "ab",
              fontSize: 16,
            }}
          >
            Chi ra
          </Text>
          <Text
            style={{
              textAlign: "center",
              color: Colors.categories.b,
              fontFamily: "ab",
              fontSize: 16,
            }}
          >
            Chênh lệch
          </Text>
        </View>
      </View>
      <Text
        style={{
          fontSize: 20,
          fontFamily: "ab",
          color: Colors.TEXT,
          marginLeft: 20,
        }}
      >
        Lịch sử
      </Text>
      <ScrollView style={styles.listContainer}>
        <DayList expenseItems={filteredByTimeOption().reverse()} />
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
    fontFamily: "ab",
    fontSize: 20,
  },
  timeContainer: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.PRIMARYB,
  },
  timeOption: {
    height: 40,
    width: 200,
    borderRadius: 10,
    backgroundColor: Colors.categories.b,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  timeOptionLabel: {
    fontSize: 16,
    fontFamily: "ar",
    color: "white",
  },
  btnSelectTimeOption: {
    backgroundColor: Colors.PRIMARYA,
    width: 200,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  btnSelectTimeOptionLabel: {
    fontSize: 16,
    fontFamily: "ar",
    color: "white",
  },
  chartDeck: {
    margin: 20,
    backgroundColor: "white",
    height: 200,
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
