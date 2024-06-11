import { Image, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import DisplayIcon from "../TagDisplayIcon";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import Item from "./Item";
import { CategoriesContext } from "@/context/CategoriesContext";

const DayList = () => {
  const { expenseItems, fetchExpenseItems } = useContext(CategoriesContext);
  const [listItems, setListItems] = useState([]);
  const groupByDate = (data) => {
    return data.reduce((acc, item) => {
      const date = new Date(item.time).toDateString(); // Convert to date string for grouping

      // Find existing group by date
      const existingGroup = acc.find(
        (group) => new Date(group[0].time).toDateString() === date
      );

      if (existingGroup) {
        // If a group for the date already exists, add the item to that group
        existingGroup.push(item);
      } else {
        // If no group exists for the date, create a new group
        acc.push([item]);
      }

      return acc;
    }, []);
  };

  useEffect(() => {
    const fetchAndSetItems = async () => {
      await fetchExpenseItems();
    };

    fetchAndSetItems();
  }, []);

  useEffect(() => {
    if (expenseItems.length > 0) {
      const groupedData = groupByDate(expenseItems);
      setListItems(groupedData);
    }
  }, [expenseItems]);

  return (
    <>
      {listItems.map((group, index) => (
        <View key={index}>
          <Text style={styles.dayContainer}>{new Date(group[0].time).toDateString()}</Text>
          <View style={styles.itemsListContainer}>
            {group.map((item) => (
              <Item key={item.id} {...item} />
            ))}
          </View>
        </View>
      ))}
    </>
  );
};

export default DayList;

const styles = StyleSheet.create({
  dayContainer: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "rr",
  },
  itemsListContainer: {
    margin: 10,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
});
