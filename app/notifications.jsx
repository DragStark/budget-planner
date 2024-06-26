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

  const { notifications, fetchNotifications, fetchFamilyPlan } = useContext(CategoriesContext);
  useEffect(() => {
    fetchNotifications();
  }, []);

  const getEmailAndRole = (detail) => {
    const emailMatch = detail.match(/Người dùng (\S+@\S+\.\S+)/);
    const roleMatch = detail.match(/vai trò là (\S+)/);

    const email = emailMatch ? emailMatch[1] : null;
    const role = roleMatch ? roleMatch[1] : null;

    return { email, role };
  };

  const deleteNotification = async (item) => {
    try {
      const { error } = await supabase
        .from("Notifications")
        .delete()
        .eq("id", item.id);
      fetchNotifications();
      if (error) { console.error(error)};
    } catch (error) {}
  };

  const onAgree = async (item) => {
    try {
      const { email, role } = getEmailAndRole(item.detail);
      if (!email || !role) {
        throw new Error("Không tìm thấy email hoặc vai trò trong chuỗi.");
      }

      const user = await client.getUserDetails();
      const { data, error } = await supabase
        .from("FamilyPlans")
        .insert([
          {
            owner: email,
            member: user.email,
            role: role,
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      fetchFamilyPlan();
      //also delete notification
      await deleteNotification(item);
      Alert.alert(
        "Thành công",
        `Bạn đã trở thành thành viên trong sổ chi tiêu gia đình của ${email}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  const onReject = (item) => {

    Alert.alert("Are You Sure", "bạn có chắc muốn xóa?", [
      { text: "không", style: "cancel" },
      {
        text: "có",
        style: "destructive",
        onPress: async () => {
          await deleteNotification(item);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {notifications.map((item, index) =>
        item.ref === "family-plan" ? (
          <View key={index} style={styles.itemContainer}>
            <View style={styles.aboveContainer}>
              <Text
                style={{
                  fontFamily: "asb",
                  fontSize: 20,
                  color: Colors.INCOME,
                }}
              >
                {item.name}
              </Text>
              <Text>{item.detail}</Text>
            </View>
            <View style={styles.expandContainer}>
              <TouchableOpacity onPress={() => onAgree(item)}>
                <Text
                  style={{
                    fontFamily: "asb",
                    fontSize: 16,
                    color: Colors.categories.b,
                  }}
                >
                  Đồng ý
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onReject(item)}>
                <Text
                  style={{
                    fontFamily: "asb",
                    fontSize: 16,
                    color: Colors.PRIMARYA,
                  }}
                >
                  Từ chối
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            key={index}
            style={styles.itemContainer}
            onPress={() => setExpand(index)}
          >
            <View style={styles.aboveContainer}>
              <Text
                style={{
                  fontFamily: "asb",
                  fontSize: 20,
                  color: Colors.INCOME,
                }}
              >
                {item.name}
              </Text>
              <Text>{item.detail}</Text>
            </View>
            {index === expand ? (
              <View style={styles.expandContainer}>
                <TouchableOpacity
                  onPress={() => router.replace(`save-plan/${item.ref}`)}
                >
                  <Text
                    style={{
                      fontFamily: "asb",
                      fontSize: 16,
                      color: Colors.categories.b,
                    }}
                  >
                    Kiểm tra
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <></>
            )}
          </TouchableOpacity>
        )
      )}
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
  },
});
