import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import LoginBg from  '../assets/images/login-bg.png'
import { Colors } from '@/constants/Colors'
import { client } from '@/utils/KindeConfig'
import services from '@/utils/services'
import { router } from 'expo-router'

const Login = () => {
    const handleSignIn = async () => {
        const token = await client.login();
        if (token) {
            await services.storeData("login", "true");
            router.replace("/");
        }
      };

  return (
    <View style={styles.container}>
      <Image source={LoginBg} style={ styles.bg}/>
      <View style={styles.loginDeckContainer}>
        <View >
            <Text style={styles.title}>Pesonal Budger Planner</Text>
        </View>
        <TouchableOpacity style={styles.btnLogin} onPress={handleSignIn}>
            <Text style={styles.btnText}>Login / Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
    container:{
        padding: 0,
    },
    bg: {
        height: 450,
        width: '100%',
    },
    loginDeckContainer:{
        height: 300,
        backgroundColor: Colors.BACKGROUND,
        alignItems: 'center',
    },
    title:{
        fontFamily: 'rb',
        fontSize: 30,
        textAlign: 'center',
        color: Colors.PRIMARYA,
    },
    btnLogin: {
        width: 300,
        height: 60,
        borderRadius: 40,
        backgroundColor: Colors.PRIMARYA,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    btnText: {
        fontFamily: 'rb',
        color: 'white',

    }
})