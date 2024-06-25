import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import CustomModal from "../CustomModal";
import { CategoriesContext } from "../../context/CategoriesContext";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import supabase from "../../utils/Supabase";
import { router } from "expo-router";

const BudgetPlanList = ({ budgetPlanList }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectItem, setSelectItem] = useState(0);
  const { fetchExpenseItems, fetchBudgetPlans } = useContext(CategoriesContext);
  const [loading, setLoading] = useState(false);

  const handleDeletePlan = (item) => {
    Alert.alert("Are You Sure", "bạn có chắc muốn xóa?", [
      { text: "không", style: "cancel" },
      {
        text: "có",
        style: "destructive",
        onPress: async () => {
          await supabase.from("BudgetPlans").delete().eq("id", item.id);
          await fetchBudgetPlans();
          Alert.alert("Mục đã được xóa");
        },
      },
    ]);
  };

  const handleDonePlan = async (item) => {
    if (item.progress < item.money) {
      Alert.alert("Cảnh báo", "mục này chưa hoàn thành !");
      return false;
    }
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
                money: item.money,
                name: item.name,
                detail: item.detail,
                type: "expense",
                tag_id: item.tagId,
                time: new Date(),
                created_by: user.email,
              })
              .select();
            if (data) {
              await fetchExpenseItems(); // for auto render
              await supabase.from("BudgetPlans").delete().eq("id", item.id);
              await fetchBudgetPlans(); // for auto render
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

  return (
    <View style={styles.container}>
      {budgetPlanList.map((item) => {
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
                <Text style={styles.itemDetail}>{item.detail}</Text>
              </View>
              <View style={styles.rightContainer}>
                <Text style={styles.itemName}>
                  {item.progress}
                </Text>
                <Text style={styles.itemDetail}>
                  {dateStart.toLocaleDateString() +
                    " - " +
                    dateEnd.toLocaleDateString()}
                </Text>
              </View>
            </View>
            {selectItem === item.id && (
              <View style={styles.expandContainer}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/save-plan/plan-tracking",
                      params: {
                        dateStart: item.dateStart,
                        dateEnd: item.dateEnd,
                        name: item.name,
                        detail: item.detail,
                        budget: item.money,
                        progress: item.progress,
                      },
                    })
                  }
                >
                  <Ionicons
                    name="analytics"
                    size={30}
                    color={Colors.categories.a}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDonePlan(item)}>
                  <Ionicons
                    name="checkmark-done"
                    size={30}
                    color={Colors.INCOME}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeletePlan(item)}>
                  <Ionicons name="trash" size={30} color={Colors.EXPENSE} />
                </TouchableOpacity>
              </View>
            )}
            <CustomModal isOpen={modalVisible} withInput={false}>
              <Text style={styles.description}>
                Bấm "xác nhận" để hoàn thành kế hoạch này, việc hoàn thành kế
                hoạch sẽ tạo ra khoản chi với số tiền bằng đúng với số tiền kế
                hoạch đề ra
              </Text>
              <View style={styles.btnGroup}>
                <TouchableOpacity
                  onPress={() => handleDonePlan(item)}
                  style={styles.btnYes}
                >
                  <Text style={styles.btnText}>Xác nhận</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.btnCancel}
                >
                  <Text style={styles.btnText}>Hủy</Text>
                </TouchableOpacity>
              </View>
            </CustomModal>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BudgetPlanList;

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
    width: "50%",
  },
  leftContainer: {
    width: "50%",
  },
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
});
