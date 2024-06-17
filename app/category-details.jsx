import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { router, useLocalSearchParams, Link } from "expo-router";
import supabase from "@/utils/Supabase";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import CourseInfo from "@/components/CourseDetail/CourseInfo";
import CourseItemList from "@/components/CourseDetail/CourseItemList";
import { CategoriesContext } from "@/context/CategoriesContext";

const CategoryDetails = () => {
  const { categoryId } = useLocalSearchParams();
  const [categoryData, setCategoryData] = useState([]);
  const { categoriesList } = useContext(CategoriesContext);

  useEffect(() => {
    let categoryIdString = "";
    if (Array.isArray(categoryId)) {
      categoryIdString = categoryId[0];
    } else if (typeof categoryId === "string") {
      categoryIdString = categoryId;
    }
    if (categoryId && categoriesList.length > 0) {
      const category = categoriesList.find((element) => element.id === parseInt(categoryIdString, 10));
      if (category) {
        setCategoryData(category);
      }
    }
  }, [categoryId, categoriesList]);


  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.heaederContainer}
        onPress={() => router.replace("/")}
      >
        <Ionicons name="caret-back" size={50} color={Colors.PRIMARYA} />
      </TouchableOpacity>
      <CourseInfo category={categoryData} />
      <Text style={styles.listTitle}> Danh sách mục chi</Text>
      <CourseItemList data={categoryData} />
      <View style={styles.addBtnContainer}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/add-new-category-item",
              params: {
                categoryId: categoryId,
              },
            })
          }
        >
          <Ionicons name="add-circle" size={64} color={Colors.PRIMARYA} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CategoryDetails;

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingLeft: 20,
    height: "100%",
  },
  icon: {
    fontSize: 30,
  },
  heaederContainer: {
    marginBottom: 20,
  },
  listTitle: {
    marginTop: 20,
    fontFamily: "ab",
    fontSize: 20,
    marginBottom: 20,
  },
  addBtnContainer: {
    position: "absolute",
    backgroundColor: "white",
    padding: 0,
    borderRadius: 50,
    bottom: 20,
    right: 20,
  },
});
