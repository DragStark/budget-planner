import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, Linking } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import supabase from "@/utils/Supabase";
import { CategoriesContext } from "@/context/CategoriesContext";

const CourseItemList = ({ data }) => {
  const [expandItem, setExpandItem] = useState(0);
  const { fetchCategories} = useContext(CategoriesContext)

  useEffect(() => {
    // data && console.log(data);
  }, [data]);

  const onDeleteItem = async (id) => {
    const { error } = await supabase
      .from("CategoryItems")
      .delete()
      .eq("id", id);
    await fetchCategories();
    Alert.alert('success',"Item deleted");
  };

  const openUrl = (url) => {
    if (url){
      Linking.openURL(url)
    }
  }

  return (
    <View>
      {data?.CategoryItems?.length > 0 ? (
        data?.CategoryItems?.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.itemContainer}
            onPress={() => setExpandItem(index)}
          >
            <View>
              <Image source={{ uri: item.image }} style={styles.image}></Image>
            </View>
            <View style={styles.itemInfo}>
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                {/* <Text>{item.url}</Text> */}
              </View>
              <View style={styles.detailContainer}>
                <Text style={styles.itemName}>{item.cost}$</Text>
                {expandItem == index && (
                  <View style={styles.actionContainer}>
                    <TouchableOpacity onPress={() => onDeleteItem(item.id)}>
                      <Ionicons
                        name="trash"
                        size={30}
                        color={Colors.PRIMARYA}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>openUrl(item.url)}>
                      <Ionicons name="open" size={30} color={Colors.PRIMARYA} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <View>
          <Text style={styles.noItem}>No Item Founded</Text>
        </View>
      )}
    </View>
  );
};

export default CourseItemList;

const styles = StyleSheet.create({
  image: {
    height: 70,
    width: 70,
    borderRadius: 10,
  },
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    width: "95%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  itemInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "75%",
  },
  itemName: {
    fontFamily: "rr",
    fontSize: 16,
  },
  noItem: {
    fontSize: 20,
    fontFamily: "rb",
    color: Colors.PRIMARYB,
  },
  detailContainer: {
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  actionContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
});
