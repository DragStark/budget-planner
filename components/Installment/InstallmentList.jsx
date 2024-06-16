import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { CategoriesContext } from "../../context/CategoriesContext";
import supabase from "../../utils/Supabase";
import { client } from "../../utils/KindeConfig";

const InstallmentList = ({ data }) => {
  const [selectItem, setSelectItem] = useState(0);
  const { fetchInstallments, fetchExpenseItems } =
    useContext(CategoriesContext);

  const handleDeleteInstallment = async (item) => {
    Alert.alert("Are You Sure", "bạn có chắc muốn xóa?", [
      { text: "không", style: "cancel" },
      {
        text: "có",
        style: "destructive",
        onPress: async () => {
          await supabase.from("Installments").delete().eq("id", item.id);
          await fetchInstallments();
          Alert.alert("Mục đã được xóa");
        },
      },
    ]);
  };

  const handleDoneInstallments = async (item) => {
    const target = realTotalPaid(
      item.money,
      item.interestRate,
      item.term,
      item.type
    );
    if (item.progress < target) {
      Alert.alert("Cảnh báo", "mục này chưa hoàn thành !");
      return false;
    }
    Alert.alert("Are You Sure", "bạn có chắc muốn hoàn thành trả góp?", [
      { text: "không", style: "cancel" },
      {
        text: "có",
        style: "destructive",
        onPress: async () => {
          try {
            const user = await client.getUserDetails();
            // when complete installment create new expense item about installment
            const { data, error } = await supabase
              .from("ExpenseItems")
              .insert({
                money: target,
                name: item.name,
                detail: item.detail,
                type: "expense",
                tag_id: 23, // other expense
                time: new Date(),
                created_by: user.email,
              })
              .select();
            if (data) {
              await fetchExpenseItems(); //for auto render
              // also delete completed installment
              await supabase.from("Installments").delete().eq("id", item.id);
              await fetchInstallments(); //for auto render
              Alert.alert("Success", "hoàn thành trả góp", [{ text: "OK" }], {
                cancelable: true,
              });
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

  const realTotalPaid = (money, interestRate, term, type) => {
    let totalPaid = 0;
    let monthlyInterestRate = interestRate / 12;
    let monthly_res_money = money;
    let monthly_interest = 0;
    const monthly_base = money / term;

    if (type === 1) {
      for (let index = 0; index < term; index++) {
        monthly_interest = (monthly_res_money * monthlyInterestRate) / 100;
        monthly_res_money -= monthly_base;
        totalPaid += Math.round(monthly_base + monthly_interest);
      }
    } else {
      for (let index = 0; index < term; index++) {
        monthly_interest = (monthly_res_money * monthlyInterestRate) / 100;
        totalPaid += Math.round(monthly_base + monthly_interest);
      }
    }
    return totalPaid;
  };

  return (
    <View>
      {data.map((item) => {
        const dateStart = new Date(item.dateStart);
        const dateEnd = new Date(dateStart);
        dateEnd.setMonth(dateEnd.getMonth() + item.term);
        const percentage =
          (item.progress /
            realTotalPaid(
              item.money,
              item.interestRate,
              item.term,
              item.type
            )) *
          100;
        const roundedPercentage = percentage.toFixed(2);
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.itemContainer}
            onPress={() => setSelectItem(item.id)}
          >
            <View style={styles.subContainer}>
              <View style={styles.leftContainer}>
                <Text style={styles.textBold}>{item.name}</Text>
                <Text style={styles.text}>{item.detail}</Text>
                <Text style={styles.text}>
                  {dateStart.toLocaleDateString() +
                    " - " +
                    dateEnd.toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.rightContainer}>
                <Text style={[styles.textBold, { color: Colors.categories.b }]}>
                  lãi suất: {item.interestRate}%
                </Text>
                <Text style={[styles.textBold, { color: Colors.categories.c }]}>
                  tiến độ:{" "}
                  {roundedPercentage == 100
                    ? Math.round(roundedPercentage)
                    : roundedPercentage}
                  %
                </Text>
                <Text style={[styles.textBold, { color: Colors.PRIMARYA }]}>
                  {item.money}đ
                </Text>
              </View>
            </View>
            {selectItem === item.id && (
              <View style={styles.expandContainer}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/save-plan/installment-tracking",
                      params: {
                        id: item.id,
                        name: item.name,
                        detail: item.detail,
                        dateStart: dateStart,
                        dateEnd: dateEnd,
                        interestRate: item.interestRate,
                        term: item.term,
                        progress: item.progress,
                        money: item.money,
                        type: item.type,
                        monthlyPaidDoneList: item.monthlyPaidDoneList,
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
                <TouchableOpacity onPress={() => handleDoneInstallments(item)}>
                  <Ionicons
                    name="checkmark-done"
                    size={30}
                    color={Colors.INCOME}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteInstallment(item)}>
                  <Ionicons name="trash" size={30} color={Colors.EXPENSE} />
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default InstallmentList;

const styles = StyleSheet.create({
  itemContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "95%",
    padding: 10,
    margin: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
  subContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  leftContainer: {},
  rightContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  expandContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 10,
    borderTopWidth: 1,
    paddingTop: 10,
  },
  text: {
    fontSize: 16,
    fontFamily: "ar",
  },
  textBold: {
    fontSize: 16,
    fontFamily: "asb",
  },
});
