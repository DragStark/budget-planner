import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import defaultAvatar from "../../assets/images/default-avatar.jpg"; // Make sure the path is correct
import { router } from "expo-router";
import { client } from "../../utils/KindeConfig";
import services from "../../utils/services";
import CustomModal from "../CustomModal";
import { CategoriesContext } from "../../context/CategoriesContext";

const Header = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState({
    id: "",
    given_name: "",
    family_name: "",
    email: "",
    picture: "",
  });

  const { notifications } = useContext(CategoriesContext);

  const getUserData = async () => {
    const user = await client.getUserDetails();
    setUser(user);
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

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            source={user.picture ? { uri: user.picture } : defaultAvatar}
            style={styles.userAvatar}
          />
        </TouchableOpacity>
        <CustomModal isOpen={modalVisible} withInput={false}>
          <TouchableOpacity
            onPress={() => handleLogout()}
            style={styles.logoutButton}
          >
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeText}>Đóng</Text>
          </TouchableOpacity>
        </CustomModal>
        <View style={styles.userInfo}>
          <View>
            <Text style={styles.greeting}>Xin chào!</Text>
            <Text style={styles.userName}>{user?.given_name}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("notifications")}>
            <View style={styles.notificationContainer}>
              <Ionicons name="notifications" size={24} color="white" />
              {notifications.length > 0 && (
                <View style={styles.notifications}>
                  <Text style={styles.notificationsText}>{notifications.length}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.PRIMARYA,
    height: "16%",
  },
  infoContainer: {
    marginTop: 50,
    marginLeft: 20,
    display: "flex",
    flexDirection: "row",
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  userInfo: {
    marginLeft: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "75%",
  },
  notificationContainer: {
    position: "relative",
  },
  notifications: {
    position: "absolute",
    backgroundColor: Colors.INCOME,
    top: -15,
    right: -10,
    padding: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 20,
    minHeight: 20,
  },
  notificationsText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
  logoutButton: {
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.categories.b,
    borderRadius: 10,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: "asb",
    color: "white",
  },
  closeButton: {
    marginTop: 10,
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.PRIMARYA,
    borderRadius: 10,
  },
  closeText: {
    fontSize: 16,
    fontFamily: "asb",
    color: "white",
  },
  greeting: {
    color: "white",
    fontSize: 20,
    fontFamily: "ar",
  },
  userName: {
    color: "white",
    fontSize: 20,
    fontFamily: "ab",
  },
});
