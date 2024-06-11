import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import DisplayIcon from "../TagDisplayIcon";
import { Colors } from "@/constants/Colors";
import { CategoriesContext } from "@/context/CategoriesContext";
import { router } from "expo-router";

const Item = (props) => {
  const [tag, setTag] = useState({});
  const { tagsList } = useContext(CategoriesContext);
  useEffect(() => {
    setTag(tagsList.filter((tag) => tag.id == props.tag_id)[0]);
  }, []);
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        router.push({
          pathname: "/edit-delete-item",
          params: {
            itemId: props.id,
          },
        })
      }
    >
      <View>
        <DisplayIcon name={tag.iconName} color={tag.color} otherStyles={{}} />
      </View>
      <View style={styles.itemInfo}>
        <View>
          <Text style={{ fontFamily: "rsb", fontSize: 16 }}>{props.name}</Text>
          <Text>{tag.name}</Text>
        </View>
        <View>
          <Text
            style={{
              color: props.type === "income" ? Colors.INCOME : Colors.EXPENSE,
            }}
          >
            {props.money}$
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Item;

const styles = StyleSheet.create({
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  itemInfo: {
    display: "flex",
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
