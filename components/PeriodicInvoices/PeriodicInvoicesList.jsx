import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import CustomModal from "../CustomModal";
import { CategoriesContext } from "../../context/CategoriesContext";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import supabase from "../../utils/Supabase";
import { router } from "expo-router";
import InputField from "../InputField";
import { client } from "../../utils/KindeConfig";

const PeriodicInvoicesList = ({ periodicInvoices }) => {
  const [modalVisible, setModalVisible] = useState(0);
  const [selectItem, setSelectItem] = useState(0);
  const [money, setMoney] = useState(0);
  const { fetchExpenseItems, fetchPeriodicInvoices } =
    useContext(CategoriesContext);

  const handleDelete = (item) => {
    Alert.alert("Are You Sure", "bạn có chắc muốn xóa?", [
      { text: "không", style: "cancel" },
      {
        text: "có",
        style: "destructive",
        onPress: async () => {
          await supabase.from("PeriodicInvoices").delete().eq("id", item.id);
          await fetchPeriodicInvoices();
          Alert.alert("Mục đã được xóa");
        },
      },
    ]);
  };

  const handleDone = async (item) => {
    Alert.alert("Are You Sure", "bạn có chắc muốn hoàn thành mục này?", [
      { text: "không", style: "cancel" },
      {
        text: "có",
        style: "destructive",
        onPress: async () => {
          try {
            const user = await client.getUserDetails();
            const { data, error } = await supabase
              .from("ExpenseItems")
              .insert({
                money: money,
                name: item.name,
                detail: "",
                type: "expense",
                tag_id: item.tag_id,
                time: new Date(),
                created_by: user.email,
              })
              .select();
            if (data) {
              await fetchExpenseItems(); // for auto render
              //   also delete periodic invoices
              await supabase
                .from("PeriodicInvoices")
                .delete()
                .eq("id", item.id);
              await fetchPeriodicInvoices(); // for auto render
              Alert.alert("Success", "hoàn thành kế hoạch", [{ text: "OK" }], {
                cancelable: true,
              });
              setModalVisible(false);
            }

            if (error) {
              throw error;
            }
          } catch (error) {
            console.error("Error in getCategoriesList:", error);
          }
        },
      },
    ]);
  };

  const displayTime = (item) => {
    let timeStr = "";
    switch (item.period) {
      case "1":
        switch (item.time) {
          case "mon":
            timeStr = "Thứ hai";
            break;
          case "tue":
            timeStr = "Thứ ba";
            break;
          case "wed":
            timeStr = "Thứ tư";
            break;
          case "thu":
            timeStr = "Thứ năm";
            break;
          case "fri":
            timeStr = "Thứ sáu";
            break;
          case "sat":
            timeStr = "Thứ bảy";
            break;
          case "sun":
            timeStr = "Chủ nhật";
            break;
        }
        return timeStr;
      case "2":
        return item.time;
      case "3":
        return item.time;
    }
  };

  return (
    <View style={styles.container}>
      {periodicInvoices.map((item) => {
        const dateStart = new Date(item.dateStart);
        const dateEnd = new Date(item.dateEnd);
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.itemContainer}
            onPress={() => setSelectItem(item.id)}
          >
            <View style={styles.infoContainer}>
              <View style={styles.leftContainer}>
                <Text style={styles.itemName}>{item.name}</Text>
              </View>
              <View style={styles.rightContainer}>
                <Text style={styles.itemName}>{displayTime(item)}</Text>
                <Text style={styles.itemDetail}>
                  {item.period == 1
                    ? "hàng tuần"
                    : item.period == 2
                    ? "hàng tháng"
                    : "hàng năm"}
                </Text>
              </View>
            </View>
            {selectItem === item.id && (
              <View style={styles.expandContainer}>
                <TouchableOpacity onPress={() => {
                  setMoney(0);
                  setModalVisible(true)
                }}>
                  <Ionicons
                    name="checkmark-done"
                    size={30}
                    color={Colors.INCOME}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)}>
                  <Ionicons name="trash" size={30} color={Colors.EXPENSE} />
                </TouchableOpacity>
                <CustomModal isOpen={modalVisible} withInput={true}>
                  <Text style={{ fontSize: 16, fontFamily: "asb", marginBottom: 10, textAlign: "center"}}>Tiền {item.name} bạn đã trả kì này </Text>
                  <InputField
                    title="Money"
                    value={money}
                    handleChangeText={(value) => setMoney(value)}
                    placeholder="0"
                    keyboardType="numeric"
                    otherStyles={{ textAlign: "right", fontSize: 30 }}
                  />
                  <View style={styles.btnGroup}>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={styles.btnAdd}
                    >
                      <Text style={styles.btnAddText}>Hủy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDone(item)}
                      disabled={money === 0}
                      style={styles.btnAdd}
                    >
                      <Text style={styles.btnAddText}>Xong</Text>
                    </TouchableOpacity>
                  </View>
                </CustomModal>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default PeriodicInvoicesList;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    padding: 20,
    gap: 10,
    width: "100%",
  },
  itemContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
  infoContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  expandContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10,
    borderTopWidth: 1,
    paddingTop: 10,
  },
  rightContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  leftContainer: {},
  itemName: {
    fontSize: 20,
    fontFamily: "asb",
    color: Colors.categories.c,
  },
  itemDetail: {
    fontSize: 16,
    fontFamily: "ar",
  },
  description: {
    fontFamily: "ar",
    fontSize: 16,
  },
  btnGroup: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  btnYes: {
    backgroundColor: Colors.categories.a,
    width: "48%",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    borderRadius: 5,
  },
  btnCancel: {
    backgroundColor: Colors.PRIMARYA,
    width: "48%",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    borderRadius: 5,
  },
  btnText: {
    color: "white",
    fontFamily: "asb",
    fontSize: 16,
  },
  btnGroup: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    gap: 10,
  },
  btnAdd: {
    backgroundColor: Colors.PRIMARYA,
    marginTop: 10,
    width: "48%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  btnAddText: {
    fontFamily: "ab",
    fontSize: 20,
    color: "white",
  },
});
