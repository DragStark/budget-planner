import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from "@/constants/Colors";
import { client } from '../../utils/KindeConfig';
import { router } from 'expo-router';
import services from '../../utils/services';

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

const Profile = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={()=>handleLogout()}>
        <Text style={styles.btnLabel}>Đăng Xuất</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  container:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  btn: {
    height: 60,
    width: 200,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.PRIMARYA
  },
  btnLabel: {
    fontSize: 16,
    fontFamily: "ab",
    color: 'white',
  }
})