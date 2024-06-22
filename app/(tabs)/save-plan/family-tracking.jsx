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
import { useLocalSearchParams } from "expo-router";
import supabase from "../../../utils/Supabase";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

const Expenses = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [timeOption, setTimeOption] = useState(2);
  const [timeOptionLabel, setTimeOptionLabel] = useState("1 tháng gần đây");
  const { email } = useLocalSearchParams();
  const [expenseItems, setExpenseItems] = useState([]);
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendar2Visible, setCalendar2Visible] = useState(false);

  const onChangeStart = ({ type }, selectedDate) => {
    if (type === "set") {
      setDateStart(selectedDate || dateStart);
    }
  };

  const onChangeEnd = ({ type }, selectedDate) => {
    if (type === "set") {
      setDateEnd(selectedDate || dateEnd);
    }
  };

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
      case 5:
        filteredItems = expenseItems.filter(
          (item) =>
            new Date(item.time) >= dateStart && new Date(item.time) <= dateEnd
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

  const getExpenseItems = async () => {
    try {
      let { data, error } = await supabase
        .from("ExpenseItems")
        .select("*")
        .eq("created_by", email);
      if (error) {
        console.log(error);
      }
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchExpenseItemData = async () => {
      const expenseItemOfUser = await getExpenseItems();
      if (expenseItemOfUser) {
        setExpenseItems(expenseItemOfUser);
      }
    };
    fetchExpenseItemData();
  }, [email]);

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
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={30} color={"white"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.headerText}>{timeOptionLabel}</Text>
          </TouchableOpacity>
          <CustomModal isOpen={modalVisible} withInput={false}>
            <Text>Tùy chọn nhanh</Text>
            <TouchableOpacity
              style={styles.timeOption}
              onPress={() => {
                setTimeOption(1);
                setModalVisible(false);
                setTimeOptionLabel("7 ngày gần đây");
              }}
            >
              <Text style={styles.timeOptionLabel}>7 ngày gần đây</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.timeOption}
              onPress={() => {
                setTimeOption(2);
                setModalVisible(false);
                setTimeOptionLabel("1 tháng gần đây");
              }}
            >
              <Text style={styles.timeOptionLabel}>1 tháng gần đây</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.timeOption}
              onPress={() => {
                setTimeOption(3);
                setModalVisible(false);
                setTimeOptionLabel("1 quý gần đây");
              }}
            >
              <Text style={styles.timeOptionLabel}>1 quý gần đây</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.timeOption}
              onPress={() => {
                setTimeOption(4);
                setModalVisible(false);
                setTimeOptionLabel("1 năm gần đây");
              }}
            >
              <Text style={styles.timeOptionLabel}>1 năm gần đây</Text>
            </TouchableOpacity>
            <Text style={{ marginTop: 20 }}>Tùy chọn khoảng thời gian</Text>
            {/* pick plan start date */}
            <TouchableOpacity
              onPress={() => setCalendarVisible(true)}
              style={styles.datePicker}
            >
              <Text style={styles.datePickerText}>Bắt đầu</Text>
              <Text style={styles.datePickerText}>
                {dateStart.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            <CustomModal isOpen={calendarVisible} withInput={false}>
              <DateTimePicker
                testID="dateTimePicker"
                value={dateStart}
                mode="date"
                display="spinner"
                maximumDate={dateEnd}
                onChange={onChangeStart}
                style={{ backgroundColor: "white" }}
                textColor={Colors.PRIMARYA}
              />
              <TouchableOpacity
                onPress={() => setCalendarVisible(false)}
                style={styles.btnDone}
              >
                <Text style={styles.btnText}>Xong</Text>
              </TouchableOpacity>
            </CustomModal>
            {/* pick plan end date */}
            <TouchableOpacity
              onPress={() => setCalendar2Visible(true)}
              style={styles.datePicker}
            >
              <Text style={styles.datePickerText}>Kết thúc</Text>
              <Text style={styles.datePickerText}>
                {dateEnd.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            <CustomModal isOpen={calendar2Visible} withInput={false}>
              <DateTimePicker
                testID="dateTimePicker"
                value={dateEnd}
                mode="date"
                display="spinner"
                minimumDate={dateStart}
                maximumDate={new Date()}
                onChange={onChangeEnd}
                style={{ backgroundColor: "white" }}
                textColor={Colors.PRIMARYA}
              />
              <TouchableOpacity
                onPress={() => setCalendar2Visible(false)}
                style={styles.btnDone}
              >
                <Text style={styles.btnText}>Xong</Text>
              </TouchableOpacity>
            </CustomModal>
            {/* handle term of time select option done */}
            <TouchableOpacity style={styles.btnConfirmTimeOption}>
              <Text
                style={styles.btnConfirmTimeOptionText}
                onPress={() => {
                  setTimeOption(5);
                  setModalVisible(false);
                  setTimeOptionLabel(
                    dateStart.toLocaleDateString() +
                      " - " +
                      dateEnd.toLocaleDateString()
                  );
                }}
              >
                Xác nhận khoảng thời gian
              </Text>
            </TouchableOpacity>
          </CustomModal>
        </View>
      </View>
      {expenseItems && expenseItems.length > 0 ? (
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
      ) : (
        <Text>Loading...</Text>
      )}
      <Text
        style={{
          fontSize: 20,
          fontFamily: "ab",
          color: Colors.TEXT,
          marginLeft: 20,
          marginTop: 20,
        }}
      >
        Lịch sử
      </Text>
      <ScrollView style={styles.listContainer}>
        { filteredByTimeOption().length ? <DayList
          expenseItems={filteredByTimeOption().reverse()}
          itemDisable={true}
        /> : <Text style={{ margin: 20, fontSize: 20, fontFamily: "asb", color: Colors.categories.c}}> không có mục nào !</Text>}
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
    display: "flex",
    flexDirection: "row",
    paddingLeft: 20,
    gap: 60,
    alignItems: "center",
    backgroundColor: Colors.PRIMARYB,
  },
  timeOption: {
    height: 40,
    width: "100%",
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
    width: "100%",
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
  datePicker: {
    height: 40,
    width: "100%",
    borderRadius: 10,
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: Colors.categories.b,
  },
  datePickerText: {
    fontFamily: "ar",
    fontSize: 16,
    color: "white",
  },
  btnConfirmTimeOption: {
    width: "100%",
    height: 40,
    backgroundColor: Colors.PRIMARYA,
    marginTop: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btnConfirmTimeOptionText: {
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
  btnDone: {
    backgroundColor: Colors.PRIMARYA,
    height: 40,
    width: 200,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  btnText: {
    fontFamily: "ar",
    color: "white",
  },
});
