import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { client } from "@/utils/KindeConfig";
import Ionicons from "@expo/vector-icons/Ionicons";

const Header = () => {
  const [user, setUser] = useState();
  const getUserData = async () => {
    const user = await client.getUserDetails();
    setUser(user);
  };

  useEffect(() => {
    getUserData();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Image source={{ uri: user?.picture }} style={styles.userAvatar} />
        <View
          style={{
            marginLeft: 20,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: '75%',
          }}
        >
          <View>
            <Text style={{ color: "white", fontSize: 20, fontFamily: 'rr'}}>Welcome</Text>
            <Text
              style={{
                color: "white",
                fontSize: 20,
                fontFamily: 'rb'
              }}
            >
              {user?.given_name}
            </Text>
          </View>
          <Ionicons name="notifications" size={24} color="white" />
        </View>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.PRIMARYB,
    height: 180,
  },
  infoContainer: {
    marginTop: 50,
    marginLeft: 20,
    display: "flex",
    flexDirection: "row",
  },
  userAvatar: { width: 50, height: 50, borderRadius: 30 },
});