import { StyleSheet, Text, View, Alert, TouchableOpacity } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import supabase from "../utils/Supabase";
import { client } from "../utils/KindeConfig";
import { CategoriesContext } from "../context/CategoriesContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "../constants/Colors";

const notifications = () => {
  const [expand, setExpand] = useState(-1);

  const { notifications, fetchNotifications } = useContext(CategoriesContext);
  useEffect(() => {
    console.log(notifications);
  }, []);

  return (
    <View style={styles.container}>
      {notifications.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.itemContainer}
          onPress={() => setExpand(index)}
        >
          <View style={styles.aboveContainer}>
            <Text style={{ fontFamily: "asb", fontSize: 20, color: Colors.INCOME}} >{item.name}</Text>
            <Text>{item.detail}</Text>
          </View>
          {index === expand ? (
            <View style={styles.expandContainer}>
              <TouchableOpacity onPress={()=> router.replace(`save-plan/${item.ref}`)}>
                <Text style={{ fontFamily: "asb", fontSize: 16, color: Colors.categories.b}}>Kiểm tra</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <></>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default notifications;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  itemContainer: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  expandContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  }
});
