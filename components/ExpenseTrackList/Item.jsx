import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import DisplayIcon from "../TagDisplayIcon";
import { Colors } from "@/constants/Colors";
import { CategoriesContext } from "@/context/CategoriesContext";
import { router } from "expo-router";

const Item = ({
  id,
  money,
  name,
  detail,
  type,
  tagId,
  time,
  isDisable
}) => {
  const [tag, setTag] = useState({
    id: 0,
    name: "",
    iconName: "",
    color: "",
  });
  const { tagsList } = useContext(CategoriesContext);
  useEffect(() => {
    setTag(tagsList.filter((tag) => tag.id == tagId)[0]);
  }, []);
  const getTime = (time) => {
    const date = new Date(time);
    const stringTime =
      (date.getHours() > 12 ? date.getHours() - 12 : date.getHours()) +
      ":" +
      (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
      (date.getHours() > 12
        ? date.getHours() > 18
          ? "tối"
          : "chiều"
        : " sáng");
    return stringTime;
  };

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        router.push({
          pathname: "/edit-delete-item",
          params: {
            itemId: id,
          },
        })
      }
      disabled={isDisable ? true : false}
    >
      <View style={styles.icon}>
        <View>
          <DisplayIcon
            name={tag.iconName}
            color={tag.color}
            tagName={tag.name}
          />
        </View>
      </View>
      <View style={styles.info}>
        <View style={styles.leftInfo}>
          <Text style={{ fontFamily: "asb", fontSize: 16 }}>{name}</Text>
          <Text style={{ fontFamily: "ar", fontSize: 12 }}>{detail}</Text>
        </View>
        <View style={styles.rightInfo}>
          <Text
            style={{
              color: type === "income" ? Colors.INCOME : Colors.EXPENSE,
            }}
          >
            {type === "income" ? "+ " : "- "}
            {money}đ
          </Text>
          <Text style={{ fontFamily: "ar", fontSize: 12 }}>
            {getTime(time)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Item;

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  icon: {},
  info: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "84%",
  },
  leftInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 5,
  },
  rightInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 5,
  },
  timeContainer: {
    display: "flex",
    flexDirection: "row",
  },
});
