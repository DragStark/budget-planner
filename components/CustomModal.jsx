import {
  StyleSheet,
  Text,
  View,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import React, { Children } from "react";


const CustomModal = ({ isOpen, withInput, children, ...rest }) => {
  const content = withInput ? (
    <KeyboardAvoidingView style={styles.overlay}>
      <View style={styles.contentContainer}>{children}</View>
    </KeyboardAvoidingView>
  ) : (
    <View style={styles.overlay}>
      <View style={styles.contentContainer}>{children}</View>
    </View>
  );
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      statusBarTranslucent
      {...rest}
    >
      {content}
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)", // 20% transparent black background
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "80%", // Adjust the width as needed
  },
});
