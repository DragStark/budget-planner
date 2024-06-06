import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import services from "../../utils/services";
import { useRouter, Link } from "expo-router";
import { client } from "@/utils/KindeConfig";
import supabase from "../../utils/Supabase";
import Header from "@/components/Header";
import CircularChart from "@/components/CircularChart";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const Home = () => {
  const router = useRouter();

  // use to check user is already or not logged in
  const checkUserAuth = async () => {
    try {
      const result = await services.getData("login");
      console.log("Auth result:", result);
      if (result !== "true") {
        router.replace("/login");
      }
    } catch (error) {
      console.error("Error in checkUserAuth:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const loggedOut = await client.logout();
      if (loggedOut) {
        await services.storeData("login", "false");
        router.replace("/login");
      }
    } catch (error) {
      console.error("Error in handleLogout:", error);
    }
  };

  const getCategoriesList = async () => {
    try {
      const user = await client.getUserDetails();
      const { data, error } = await supabase
        .from("Categories")
        .select("*")
        .eq("created_by", user.email);
      if (error) {
        throw error;
      }
      console.log("Categories data:", data);
    } catch (error) {
      console.error("Error in getCategoriesList:", error);
    }
  };

  useEffect(() => {
    // checkUserAuth();
    // getCategoriesList();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View>
        {/* <Header />
        <CircularChart /> */}
      </View>
      <View style={styles.addBtnContainer}>
        <Link href="/add-new-category">
          <Ionicons name="add-circle" size={64} color={Colors.PRIMARYA} />
        </Link>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  addBtnContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});
