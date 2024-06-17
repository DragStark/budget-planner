import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { router } from "expo-router";

const CategoriesList = ({ categoriesList }) => {
  const onCategoryClick = (category) => {
    router.push({
      pathname: "/category-details",
      params: {
        categoryId: category.id,
      },
    });
  };

  const caculateTotalCost = (data) => {
    let total = 0;
    data.forEach((item) => {
      total += item.cost;
    });
    return total;
  };

  const truncateString = (str) => {
    if (str.length > 15) {
      return str.substring(0, 15) + "...";
    }
    return str;
  };

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        {categoriesList.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.itemContainer}
            onPress={() => onCategoryClick(category)}
          >
            <View
              style={[
                styles.categoryContainer,
                { backgroundColor: category.color },
              ]}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
            </View>
            <View style={styles.infoContainer}>
              <View>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={{ fontFamily: "ar" }}>
                  {category.CategoryItems ? category.CategoryItems.length : "0"}{" "}
                  mục
                </Text>
                <Text style={{ fontFamily: "ar" }}>
                  {truncateString(category.detail)}
                </Text>
              </View>
              <Text style={styles.budget}>

                {caculateTotalCost(category.CategoryItems)}đ
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default CategoriesList;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    padding: 20,
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
  },
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    height: 80,
    width: "100%",
    gap: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  categoryContainer: {
    height: 60,
    width: 60,
    padding: 10,
    justifyContent: "center",
    borderRadius: 10,
  },
  infoContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
  },
  categoryIcon: {
    fontSize: 30,
  },
  categoryName: {
    fontSize: 16,
    fontFamily: "ab",
  },
  budget: {
    fontSize: 16,
    fontFamily: "ar",
  },
});
