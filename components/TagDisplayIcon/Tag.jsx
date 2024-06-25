import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Tag = ({ name, url}) => {
  return (
    <View style={styles.container}>
      <Image source={{uri:url}} style={{width: 50, height: 50}} />
      {name && <Text> {name}</Text>}
    </View>
  )
}

export default Tag

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }
})