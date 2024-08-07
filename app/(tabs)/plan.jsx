import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import services from "../../utils/services";
import { useRouter, Link } from "expo-router";
import { client } from "@/utils/KindeConfig";
import Header from "@/components/Header";
import CircularChart from "@/components/CircularChart";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import CategoriesList from "@/components/CategoriesList";
import { CategoriesContext } from "../../context/CategoriesContext";
import supabase from "../../utils/Supabase";

const Home = () => {
  const router = useRouter();
  const { categoriesList, fetchCategories } = useContext(CategoriesContext);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}> kế hoạch chi tiêu từng mục </Text>
      </View>
      <View>
        <CircularChart title={false}/>
        <Text style={styles.label}>Danh sách khoản chi</Text>
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <CategoriesList categoriesList={categoriesList} />
        </ScrollView>
      </View>
      <View style={styles.addBtnContainer}>
        <Link href="/add-new-category">
          <Ionicons name="add-circle" size={64} color={Colors.PRIMARYA} />
        </Link>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  addBtnContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "white",
    padding: 0,
    borderRadius: 50,
  },
  header: {
    backgroundColor: Colors.PRIMARYA,
    height: "12%",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 10,
  },
  headerTitle: {
    fontFamily: "ab",
    fontSize: 20,
    color: "white",
  },
  label: {
    fontFamily: "ab",
    fontSize: 20,
    marginTop: 20,
    marginLeft: 20,
  },
  scrollContainer: {
    height: "50%",
  },
});
