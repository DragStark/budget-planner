import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import thumbnail from "../assets/images/default-img.jpg";
import { Colors } from "@/constants/Colors";
import InputField from "@/components/InputField";
import * as ImagePicker from "expo-image-picker";
import supabase from "@/utils/Supabase";
import { decode } from "base64-arraybuffer";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { CategoriesContext } from "../context/CategoriesContext";

const AddNewCategoryItem = () => {
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [itemName, setItemName] = useState("");
  const [cost, setCost] = useState(0);
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const { categoryId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const { fetchCategories } = useContext(CategoriesContext);

  useEffect(() => {
    console.log(categoryId);
  }, [categoryId]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setPreviewImage(result.assets[0].uri);
      setImage(result.assets[0].base64);
    }
  };

  const uploadItems = async (item, imageUrl) => {
    const { data, error } = await supabase
      .from("CategoryItems")
      .insert([
        {
          name: itemName,
          cost: cost,
          url: url,
          note: note,
          image: imageUrl,
          category_id: categoryId,
        },
      ])
      .select();

    if (data) {
      console.log(data);
    } else {
      console.error(error);
    }
  };

  const onClickAdd = async () => {
    setLoading(true);
    const fileName = Date.now().toString();
    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName + ".png", decode(image), {
        contentType: "image/png",
      });

    if (data) {
      const fileUrl =
        "https://ivoqqxsmswfdokxfuqee.supabase.co/storage/v1/object/public/images/" +
        data.path;
      console.log("file uploaded: ", fileUrl);
      await uploadItems(data, fileUrl);
      await fetchCategories();
      setLoading(false);
      Alert.alert("Success", "New Item Added");

      router.replace({
        pathname: "/category-details",
        params: {
          categoryId: categoryId,
        },
      });
    } else {
      setLoading(false);
      Alert.alert("Error", "Failed to upload image.");
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => pickImage()}>
          <Image
            source={previewImage ? { uri: previewImage } : thumbnail}
            style={styles.img}
          />
        </TouchableOpacity>
        <View style={styles.formContainer}>
          <InputField
            title="Total Budget"
            value={itemName}
            handleChangeText={setItemName}
            logo="bookmark"
            placeholder="Tên"
            keyboardType="default"
            otherStyles={{}}
          />
          <InputField
            title="Cost"
            value={cost}
            handleChangeText={(value) => setCost(parseFloat(value))}
            logo="cash"
            placeholder="Giá"
            keyboardType="numeric"
            otherStyles={{}}
          />
          <InputField
            title="Url"
            value={url}
            handleChangeText={setUrl}
            logo="link"
            placeholder="Link"
            keyboardType="default"
            otherStyles={{}}
          />
          <InputField
            title="Note"
            value={note}
            handleChangeText={setNote}
            logo="pencil"
            placeholder="Ghi chú"
            keyboardType="default"
            otherStyles={{}}
          />
          <TouchableOpacity
            style={styles.submitBtn}
            disabled={itemName === "" || cost === 0 || loading}
            onPress={onClickAdd}
          >
            {loading ? (
              <ActivityIndicator size="large" color="white" />
            ) : (
              <Text style={styles.submitText}>Tạo mục chi</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddNewCategoryItem;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  img: {
    width: 200,
    height: 200,
    borderRadius: 20,
  },
  formContainer: {
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
  },
  submitBtn: {
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 60,
    borderRadius: 20,
    backgroundColor: Colors.categories.c,
  },
  submitText: {
    fontFamily: "ab",
    fontSize: 20,
    color: "white",
  },
});