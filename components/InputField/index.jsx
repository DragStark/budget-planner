import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  TextInputProps,
  StyleProp,
  TextStyle,
  KeyboardTypeOptions,
} from "react-native";

const InputField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  logo = "",
  keyboardType = "default",
  otherStyles,
  isEditable,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView>
      <View style={[styles.customView, isFocused && styles.focusStyle]}>
        {logo !== "" && <Ionicons name={logo} size={30} color={Colors.GRAY} />}
        {title === "Term" && (
          <Text style={{ fontSize: 20, fontFamily: "ar", color: Colors.TEXT }}>
            Kì hạn :
          </Text>
        )}
        {title === "InterestRate" && (
          <Text style={{ fontSize: 20, fontFamily: "ar", color: Colors.TEXT }}>
            Lãi suất : 
          </Text>
        )}
        <TextInput
          value={value}
          placeholder={placeholder}
          onChangeText={handleChangeText}
          style={[styles.inputText, otherStyles]} // Adjust styles as needed
          placeholderTextColor="#7b7b8b"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={title === "Password" && !showPassword}
          keyboardType={keyboardType}
          editable={isEditable}
          {...props}
        />
        {title === "Money" && (
          <Text style={{ fontSize: 30, fontFamily: "ar", color: Colors.TEXT }}>
            đ
          </Text>
        )}
        {title === "Term" && (
          <Text style={{ fontSize: 20, fontFamily: "ar", color: Colors.TEXT }}>
            tháng
          </Text>
        )}
        {title === "InterestRate" && (
          <Text style={{ fontSize: 20, fontFamily: "ar", color: Colors.TEXT }}>
            %
          </Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  customView: {
    borderWidth: 2,
    borderColor: Colors.GRAY, // equivalent to border-red-500
    width: "100%", // equivalent to w-full
    height: 64, // equivalent to h-16
    paddingHorizontal: 16, // equivalent to px-4
    backgroundColor: "white", // equivalent to bg-black-100
    borderRadius: 10, // equivalent to rounded-2xl
    justifyContent: "center", // equivalent to
    alignItems: "center",
    flexDirection: "row",
    marginTop: 7,
  },
  focusStyle: {
    borderColor: "#FF9C01", // equivalent to border-secondary
  },
  inputText: { flex: 1, color: Colors.TEXT, marginLeft: 10, fontFamily: "ar", fontSize: 22 },
});

export default InputField;
