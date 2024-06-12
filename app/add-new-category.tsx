import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useContext } from "react";
import { Colors } from "@/constants/Colors";
import ColorPicker from "../components/ColorPicker";
import InputField from "@/components/InputField";
import supabase from "@/utils/Supabase";
import { client } from "@/utils/KindeConfig";
import { router } from "expo-router";
import { CategoriesContext } from "../context/CategoriesContext";

const AddNewCategory = () => {
  const [selectedIcon, setSelectedIcon] = useState("IC");
  const [selectedColor, setSelectedColor] = useState(Colors.categories.a);
  const [category, setCategory] = useState("");
  const [totalBudget, setTotalBudget] = useState(0);
  const [loading, setLoading] = useState(false);
  const { fetchCategories } = useContext(CategoriesContext);

  const onCreateCategory = async () => {
    try {
      setLoading(true);
      const user = await client.getUserDetails();
      const { data, error } = await supabase
        .from("Categories")
        .insert({
          name: category,
          assigned_budget: totalBudget,
          icon: selectedIcon,
          color: selectedColor,
          created_by: user.email,
        })
        .select();
      if (data) {
        setLoading(false);
        await fetchCategories();
        Alert.alert(
          "Success",
          "Category created successfully",
          [{ text: "OK" }],
          { cancelable: true }
        );
        router.replace({
          pathname: "/category-details",
          params: {
            categoryId: data[0].id,
          },
        });
      }

      if (error) {
        throw error;
      }

      console.log(data);
    } catch (error) {
      console.error("Error in getCategoriesList:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <TextInput
          style={[styles.iconInput, { backgroundColor: selectedColor }]}
          maxLength={2}
          onChangeText={(value) => setSelectedIcon(value)}
        >
          {selectedIcon}
        </TextInput>
      </View>
      <ColorPicker
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
      />
      <InputField
        title="Category"
        value={category}
        handleChangeText={(value: string) => setCategory(value)}
        logo="bookmark"
        placeholder="Tên khoản chi"
        keyboardType="default"
        otherStyles={{}}
      />
      <InputField
        title="Total Budget"
        value={totalBudget.toString()}
        handleChangeText={(value: string) => {
          const newValue = value.trim();
          if (!isNaN(parseInt(newValue))) {
            setTotalBudget(parseInt(newValue));
          } else {
            setTotalBudget(0);
          }
        }}
        logo="cash"
        placeholder="Tổng số tiền"
        keyboardType="numeric"
        otherStyles={{}}
      />
      <TouchableOpacity
        style={styles.createBtn}
        disabled={category === "" || totalBudget === 0 || loading}
        onPress={() => onCreateCategory()}
      >
        {loading ? (
          <ActivityIndicator size={"large"} color={"white"} />
        ) : (
          <Text style={styles.btnText}>Tạo khoản chi</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AddNewCategory;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 20,
  },
  subContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  iconInput: {
    textAlign: "center",
    fontSize: 30,
    fontFamily: "rr",
    color: "white",
    padding: 20,
    borderRadius: 20,
  },
  createBtn: {
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 60,
    borderRadius: 20,
    backgroundColor: Colors.PRIMARYA,
  },
  btnText: {
    fontFamily: "ab",
    fontSize: 20,
    color: "white",
  },
});
