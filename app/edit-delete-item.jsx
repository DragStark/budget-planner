import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
  Image
} from "react-native";
import React, { useEffect, useState, useContext, useMemo } from "react";
import { Colors } from "@/constants/Colors";
import InputField from "@/components/InputField";
import DisplayIcon from "@/components/TagDisplayIcon";
import { CategoriesContext } from "@/context/CategoriesContext";
import { Ionicons } from "@expo/vector-icons";
import { client } from "@/utils/KindeConfig";
import supabase from "@/utils/Supabase";
import { router, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomModal from "@/components/CustomModal";
import Tag from "../components/TagDisplayIcon/Tag";

const EditDeleteItem = () => {
  const [seletedType, setseletedType] = useState("expense");
  const [money, setMoney] = useState(0);
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [image, setImage] = useState("");
  const [imageVisible, setImageVisible] = useState("");
  const { parentTagsList, tagsList, expenseItems } =
    useContext(CategoriesContext);
  const [tagListVisible, setTagListVisible] = useState(false);
  const [seletedTag, setSeletedTag] = useState({
  });
  const [loading, setLoading] = useState(false);
  const { itemId } = useLocalSearchParams();

  const { fetchExpenseItems } = useContext(CategoriesContext);

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate || date;
      setDate(currentDate);
    }
  };

  useMemo(() => {
    let itemIdString = "";
    if (Array.isArray(itemId)) {
      itemIdString = itemId[0];
    } else if (typeof itemId === "string") {
      itemIdString = itemId;
    }
    const currentItem = expenseItems.filter(
      (item) => item.id === parseInt(itemIdString, 10)
    )[0];
    if (currentItem) {
      setMoney(currentItem.money);
      setName(currentItem.name);
      setDetail(currentItem.detail);
      setDate(new Date(currentItem.time));
      setseletedType(currentItem.type);
      setImage(currentItem.imageUrl)
      const currentTag = tagsList.filter(
        (tag) => tag.id == currentItem.tag_id
      )[0];
      setSeletedTag(currentTag);
    }
  }, []);

  const onEdit = () => {
    Alert.alert("Are You Sure", "bạn có chắc muốn thay đổi ?", [
      { text: "không", style: "cancel" },
      {
        text: "có",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          await supabase
            .from("ExpenseItems")
            .update({
              money: money,
              name: name,
              detail: detail,
              type: seletedType,
              tag_id: seletedTag.id,
              time: date,
            })
            .eq("id", itemId)
            .select();

          await fetchExpenseItems();
          setLoading(false);
          Alert.alert("Mục đã được cập nhật");
          router.replace("/tracking");
        },
      },
    ]);
  };

  const onDelete = () => {
    Alert.alert("Are You Sure", "bạn có chắc muốn xóa?", [
      { text: "không", style: "cancel" },
      {
        text: "có",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          await supabase.from("ExpenseItems").delete().eq("id", itemId);

          await fetchExpenseItems();
          setLoading(false);
          Alert.alert("Mục đã được xóa");
          router.replace("/tracking");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.typeContainer}>
        <View
          style={[
            styles.type,
            seletedType === "expense" && { backgroundColor: Colors.PRIMARYA },
          ]}
        >
          <Text
            style={[
              styles.typeLabel,
              seletedType === "expense" && { color: "white" },
            ]}
          >
            Chi ra
          </Text>
        </View>
        <View
          style={[
            styles.type,
            seletedType === "income" && { backgroundColor: Colors.PRIMARYA },
          ]}
        >
          <Text
            style={[
              styles.typeLabel,
              seletedType === "income" && { color: "white" },
            ]}
          >
            Thu vào
          </Text>
        </View>
      </View>
      <KeyboardAvoidingView style={{ padding: 10, display: "flex" }}>
        <InputField
          title="Money"
          value={money.toString()}
          handleChangeText={(value) => {
            const newValue = value.trim();
            if (!isNaN(parseInt(newValue))) {
              setMoney(parseInt(newValue));
            } else {
              setMoney(0);
            }
          }}
          placeholder="0"
          logo=""
          keyboardType="numeric"
          otherStyles={{
            textAlign: "right",
            fontSize: 30,
            paddingRight: 10,
          }}
        />
        <InputField
          title="Item Name"
          value={name}
          handleChangeText={(value) => setName(value)}
          logo=""
          placeholder="Tên"
          keyboardType="default"
          otherStyles={{
            fontSize: 20,
          }}
        />
        <InputField
          title="Detail"
          value={detail}
          handleChangeText={(value) => setDetail(value)}
          logo=""
          placeholder="Chi tiết"
          keyboardType="default"
          otherStyles={{
            fontSize: 20,
          }}
        />
        {
          <View style={styles.tagContainer}>
            <TouchableOpacity
              style={styles.tagSubContainer}
              onPress={() => setTagListVisible(true)}
            >
              <Tag name={seletedTag.name} url={seletedTag.iconUrl} />
            </TouchableOpacity>
            <CustomModal isOpen={tagListVisible} withInput={false}>
              <View style={styles.tagListContainer}>
                {parentTagsList
                  .filter((parentTag) => parentTag.type === seletedType)
                  .map((parentTag, index) => (
                    <View key={index} style={styles.parentTagContainer}>
                      <Text style={styles.parentTagName}>{parentTag.name}</Text>
                      <View key={index} style={styles.childTagContainer}>
                        {tagsList
                          .filter(
                            (tag) =>
                              tag.type === seletedType &&
                              tag.parrent_id === parentTag.id
                          )
                          .map((tag, index) => (
                            <TouchableOpacity
                              key={tag.id}
                              style={styles.categoryContainer}
                              onPress={() => {
                                setSeletedTag(tag);
                                setTagListVisible(false);
                              }}
                            >
                              <Tag name={tag.name} url={tag.iconUrl} />
                            </TouchableOpacity>
                          ))}
                      </View>
                    </View>
                  ))}
              </View>
            </CustomModal>
            <View style={styles.tagSubContainerRight}>
              <View>
                <CustomModal isOpen={show} withInput={false}>
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="datetime"
                    display="spinner"
                    maximumDate={new Date()}
                    onChange={onChange}
                    style={{ backgroundColor: "white" }}
                    textColor={Colors.PRIMARYA}
                  />
                  <TouchableOpacity
                    onPress={() => setShow(false)}
                    style={styles.btnDone}
                  >
                    <Text style={styles.btnModalText}>Xong</Text>
                  </TouchableOpacity>
                </CustomModal>
                {!show && (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 5,
                    }}
                  >
                    <Text style={styles.dateText}>
                      {date.toLocaleDateString()} {date.toLocaleTimeString()}
                    </Text>
                    <TouchableOpacity onPress={() => setShow(true)}>
                      <Ionicons name="calendar" size={30} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        }
        <TouchableOpacity onPress={() => setImageVisible(true)}>
          <Image
            source={{ uri:  image}}
            style={styles.img}
          />
        </TouchableOpacity>
        <CustomModal isOpen={imageVisible} withInput={false}>
          <Image
            source={{ uri:  image}}
            style={styles.imgFull}
          />
          <TouchableOpacity
            onPress={() => setImageVisible(false)}
            style={{
              backgroundColor: Colors.PRIMARYA,
              width: 320,
              borderRadius: 10,
              marginTop: 10,
              justifyContent: "center",
              alignItems: "center",
              height: 50,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily: "asb",
                color: "white",
              }}
            >
              đóng
            </Text>
          </TouchableOpacity>
        </CustomModal>
        <View style={{ flexDirection: "row", display: "flex", gap: 10 }}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: Colors.categories.b }]}
            onPress={() => onEdit()}
          >
            {loading ? (
              <ActivityIndicator size={"large"} color={"white"} />
            ) : (
              <Text style={styles.btnText}>Sửa</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: Colors.PRIMARYA }]}
            onPress={() => onDelete()}
          >
            {loading ? (
              <ActivityIndicator size={"large"} color={"white"} />
            ) : (
              <Text style={styles.btnText}>Xóa</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default EditDeleteItem;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    height: "100%",
  },
  header: {
    backgroundColor: Colors.PRIMARYA,
    height: "10%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontFamily: "rb",
    fontSize: 20,
    color: "white",
  },
  typeContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    height: 50,
    backgroundColor: Colors.PRIMARYB,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  type: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "50%",
    borderRadius: 10,
  },
  typeLabel: {
    fontSize: 20,
    fontFamily: "ab",
    color: "gray",
  },
  tagContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    justifyContent: "space-between",
    width: "100%",
  },
  tagSubContainer: {
    borderRadius: 15,
    padding: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "45%",
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: Colors.GRAY,
    height: 85,
  },
  tagSubContainerRight: {
    borderRadius: 15,
    padding: 10,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: Colors.GRAY,
    height: 85,
  },
  dateText: {
    fontSize: 16,
    fontFamily: "rr",
  },
  mostUse: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 16,
    fontFamily: "rr",
    color: Colors.TEXT,
  },
  categoriesContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    backgroundColor: "white",
    borderRadius: 10,
    paddingTop: 20,
    alignItems: "center",
    paddingBottom: 20,
  },
  mostUseContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  allTagsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  listMostUse: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  categoryContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  btn: {
    display: "flex",
    width: "49%",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  btnText: {
    color: "white",
    fontSize: 20,
    fontFamily: "ab",
    textAlign: "right",
  },
  dateTimePicker: {
    height: 35,
  },
  btnDone: {
    backgroundColor: Colors.PRIMARYA,
    height: 40,
    width: 200,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  btnModalText: {
    fontFamily: "ar",
    color: "white",
  },
  tagListContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: "100%",
  },
  parentTagContainer: {
    width: "100%",
    backgroundColor: Colors.GRAY2,
    padding: 10,
    borderRadius: 5,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  parentTagName: {
    fontFamily: "asb",
    fontSize: 16,
    color: Colors.TEXT,
  },
  childTagContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
  img: {
    width: 395,
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  imgFull: {
    width: 320,
    height: 320,
    borderRadius: 10,
  },
});
