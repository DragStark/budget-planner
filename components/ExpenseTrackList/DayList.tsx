import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Item from "./Item";

type ExpenseItem = {
  id: number;
  created_at: Date;
  money: number;
  name: string;
  detail: string;
  tag_id: number;
  type: string;
  time: string;
  created_by: string;
};

type Props = {
  expenseItems: ExpenseItem[];
};

const DayList = ({ expenseItems }: Props) => {
  const [listItems, setListItems] = useState<ExpenseItem[][]>([]);

  const groupByDate = (data: ExpenseItem[]): ExpenseItem[][] => {
    return data.reduce((acc: ExpenseItem[][], item) => {
      const date = new Date(item.time).toDateString(); // Convert to date string for grouping
      const existingGroup = acc.find(
        (group) => new Date(group[0].time).toDateString() === date
      );

      if (existingGroup) {
        existingGroup.push(item);
      } else {
        acc.push([item]);
      }

      return acc;
    }, []);
  };

  useEffect(() => {
    if (expenseItems.length > 0) {
      const groupedData = groupByDate(expenseItems);
      setListItems(groupedData);
    }
  }, [expenseItems]);

  const convertDateToVietnamese = (date: string) => {
    const dateTime = new Date(date);
    const dayInWeek = dateTime.getDay();
    let stringDate = "";

    switch (dayInWeek) {
      case 1:
        stringDate += "Thứ hai, ";
        break;
      case 2:
        stringDate += "Thứ ba, ";
        break;
      case 3:
        stringDate += "Thứ tư, ";
        break;
      case 4:
        stringDate += "Thứ năm, ";
        break;
      case 5:
        stringDate += "Thứ sáu, ";
        break;
      case 6:
        stringDate += "Thứ bảy, ";
        break;
      case 0: // Sunday
        stringDate += "Chủ nhật, ";
        break;
      default:
        break;
    }
    stringDate += dateTime.toLocaleDateString();
    return stringDate;
  };

  if (!listItems.length) {
    return <Text>No items available</Text>;
  }

  return (
    <>
      {listItems.map((group, index) => (
        <View key={index}>
          <Text style={styles.dayContainer}>
            {convertDateToVietnamese(group[0].time)}
          </Text>
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
    padding: 10,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
});
