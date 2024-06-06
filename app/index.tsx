import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import services from "../utils/services";
import { useRouter } from "expo-router";
import { client } from "@/utils/KindeConfig";

const Home = () => {
  const router = useRouter();

  // use to check user is already or not logged in
  const checkUserAuth = async () => {
    const result = await services.getData("login");
    console.log("result", result);
    if (result !== "true") {
      router.replace("/login");
    }
  };

  const handleLogout = async () => {
    const loggedOut = await client.logout();
    if (loggedOut) {
      await services.storeData("login", "false");
      router.replace("/login");
    }
  };

  useEffect(() => {
    checkUserAuth();
  }, []);

  return (
    <View>
      <Text>Home</Text>
      <TouchableOpacity>
        <Button title="Logout" onPress={handleLogout}/>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
