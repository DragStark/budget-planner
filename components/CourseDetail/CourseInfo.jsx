import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import supabase from "@/utils/Supabase";
import { router } from "expo-router";
import { CategoriesContext } from "@/context/CategoriesContext";
import { client } from "../../utils/KindeConfig";

const CoursInfo = ({ category }) => {
  const [totalCost, setTotalCost] = useState(0);
  const [perc, setPerc] = useState(0);
  const { fetchCategories, fetchExpenseItems } = useContext(CategoriesContext);

  const calcTotalPercent = () => {
    let total = 0;
    category?.CategoryItems?.forEach((item) => {
      total += item.cost;
    });
    // console.log(total);
    setTotalCost(total);
    let percent = (total / category.assigned_budget) * 100;
    if (percent > 100) percent = 100;
    setPerc(percent);
  };

  useEffect(() => {
    category && calcTotalPercent();
  }, [category]);

  const onDeleteCategory = () => {
    Alert.alert("Are You Sure", "Are you sure you want to delete?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          await supabase
            .from("CategoryItems")
            .delete()
            .eq("category_id", data.id);

          await supabase.from("Categories").delete().eq("id", data.id);

          await fetchCategories();
          Alert.alert("Category Deleted");
          router.replace("/");
        },
      },
    ]);
  };

  const onDoneCategory = async () => {
    if (perc < 100) {
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
                money: category.assigned_budget,
                name: category.name,
                detail: category.detail,
                type: "expense",
                tag_id: category.tag_id,
                time: new Date(),
                created_by: user.email,
              })
              .select();
            if (data) {
              await fetchExpenseItems(); // for auto render
              //also delete this category
              await supabase
                .from("CategoryItems")
                .delete()
                .eq("category_id", category.id);

              await supabase.from("Categories").delete().eq("id", category.id);

              await fetchCategories();

              Alert.alert("Success", "hoàn thành kế hoạch", [{ text: "OK" }], {
                cancelable: true,
              });
              router.replace("/")
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
    <View>
      <View style={styles.container}>
        <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
          <Text style={styles.icon}>{category.icon}</Text>
        </View>
        <View style={styles.info}>
          <View>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text>{category.detail}</Text>
            <Text>
              {new Date(category.dateStart).toLocaleDateString()}
              {" - "}
              {new Date(category.dateEnd).toLocaleDateString()}
            </Text>

            <Text style={{ color: Colors.categories.b, fontFamily: "asb" }}>
              {category.CategoryItems ? category.CategoryItems.length : "0"} mục
            </Text>
          </View>
          <TouchableOpacity onPress={() => onDoneCategory()}>
            <Ionicons name="checkmark-done" size={30} color={Colors.INCOME} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onDeleteCategory()}>
            <Ionicons name="trash" size={30} color={Colors.PRIMARYA} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.amountContainer}>
        <Text style={{ fontFamily: "ar" }}>{totalCost}đ</Text>
        <Text style={{ fontFamily: "ar" }}>Tổng: {category.assigned_budget}đ</Text>
      </View>
      <View style={styles.progressBarTotal}>
        <View style={[styles.progressBarPresent, { width: `${perc}%` }]}></View>
      </View>
    </View>
  );
};

export default CoursInfo;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 15,
  },
  icon: {
    fontSize: 30,
    padding: 20,
  },
  info: {
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "70%",
  },
  categoryName: {
    fontFamily: "rsb",
    fontSize: 16,
  },
  amountContainer: {
    marginRight: 20,
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressBarTotal: {
    marginTop: 20,
    width: "95%",
    height: 20,
    backgroundColor: "gray",
    borderRadius: 10,
  },
  progressBarPresent: {
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.SECONDARYA,
  },
});
