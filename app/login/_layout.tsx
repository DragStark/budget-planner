import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import LoginBg from '../../assets/images/login-bg.jpg'

const LoginLayout = () => {
  return (
    <Stack screenOptions={{
        headerShown: false,
    }}>
        <Stack.Screen name='index' />
    </Stack>
  )
}

export default LoginLayout