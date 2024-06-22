import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { CategoriesContext } from "../../context/CategoriesContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "../../constants/Colors";
import defaultAvatar from "../../assets/images/default-avatar.jpg";
import supabase from "../../utils/Supabase";
import { client } from "../../utils/KindeConfig";

const MembersList = ({ familyPlan }) => {
  const { usersList, fetchFamilyPlan } = useContext(CategoriesContext);

  const handleDeleteMember = (item) => {
    Alert.alert("Are You Sure", "bạn có chắc muốn xóa?", [
      { text: "không", style: "cancel" },
      {
        text: "có",
        style: "destructive",
        onPress: async () => {
          try {
            let idDelete = 0;
            familyPlan.forEach((planItem) => {
              if (
                planItem.owner == item.owner &&
                planItem.member == item.member
              )
                idDelete = planItem.id;
            });
            console.log(idDelete);
            if (idDelete !== 0) {
              const { error } = await supabase
                .from("FamilyPlans")
                .delete()
                .eq("id", idDelete);

              if (error) {
                console.error(error);
              } else {
                await fetchFamilyPlan();
                Alert.alert("Thành công", "Xoá thành viên thành công");
              }
            }
          } catch (error) {
            console.error("error in handle delete member: ", error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {familyPlan.length > 0 ? (
        familyPlan.map((planItem) => {
          const user = usersList.find(
            (userItem) => userItem.email === planItem.member
          );
          return (
            <TouchableOpacity
              key={planItem.id}
              style={styles.itemContainer}
              onPress={() =>
                router.push({
                  pathname: "save-plan/family-tracking",
                  params: {
                    email: planItem.member,
                  },
                })
              }
            >
              <View style={styles.infoContainer}>
                <View>
                  <Image
                    source={user ? { uri: user.picture } : defaultAvatar}
                    style={styles.userAvatar}
                  />
                </View>
                <View style={styles.leftContainer}>
                  <Text style={[styles.itemName, { color: planItem.color }]}>
                    {user
                      ? `${user.family_name} ${user.given_name}`
                      : "Người dùng không xác định"}
                  </Text>
                  <Text style={[styles.itemDetail, { color: planItem.color }]}>
                    Vai trò: {planItem.role}
                  </Text>
                </View>
                <View style={styles.rightContainer}>
                  <TouchableOpacity
                    onPress={() => handleDeleteMember(planItem)}
                  >
                    <Ionicons name="trash" size={30} color={Colors.PRIMARYA} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        })
      ) : (
        <Text>Chưa có thành viên nào </Text>
      )}
    </View>
  );
};

export default MembersList;

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
    padding: 20,
    borderRadius: 5,
  },
  infoContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
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
    marginLeft: 60,
  },
  leftContainer: {},
  itemName: {
    fontSize: 20,
    fontFamily: "asb",
  },
  itemDetail: {
    fontSize: 16,
    fontFamily: "ar",
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  expenseText: {
    color: Colors.EXPENSE,
    fontSize: 16,
  },
  incomeText: {
    color: Colors.INCOME,
    fontSize: 16,
  },
});
