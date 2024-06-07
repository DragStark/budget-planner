import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import supabase from "@/utils/Supabase";
import { router } from "expo-router";
import { CategoriesContext } from "@/context/CategoriesContext";

const CoursInfo = ({ data }) => {
  const [totalCost, setTotalCost] = useState(0);
  const [perc, setPerc] = useState(0);
  const { fetchCategories } = useContext(CategoriesContext);

  const calcTotalPercent = () => {
    let total = 0;
    data?.CategoryItems?.forEach((item) => {
      total += item.cost;
    });
    // console.log(total);
    setTotalCost(total);
    let percent = (total / data.assigned_budget) * 100;
    if (percent > 100) percent = 100;
    setPerc(percent);
  };

  useEffect(() => {
    data && calcTotalPercent();
  }, [data]);

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
          Alert.alert('Category Deleted');
          router.replace("/");
        },
      },
    ]);
  };

  return (
    <View>
      <View style={styles.container}>
        <View style={[styles.iconContainer, { backgroundColor: data.color }]}>
          <Text style={styles.icon}>{data.icon}</Text>
        </View>
        <View style={styles.info}>
          <View>
            <Text style={styles.categoryName}>{data.name}</Text>
            <Text>
              {data.CategoryItems ? data.CategoryItems.length : "0"} Items
            </Text>
          </View>
          <TouchableOpacity onPress={() => onDeleteCategory()}>
            <Ionicons name="trash" size={30} color={Colors.PRIMARYA} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.amountContainer}>
        <Text>{totalCost} $</Text>
        <Text>Total budget: {data.assigned_budget} $</Text>
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
    fontSize: 20,
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
