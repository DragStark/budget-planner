import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { Colors } from "@/constants/Colors";
import InputField from "@/components/InputField";
import DisplayIcon from "@/components/TagDisplayIcon";
import { CategoriesContext } from "@/context/CategoriesContext";
import { Ionicons } from "@expo/vector-icons";
import { client } from "@/utils/KindeConfig";
import supabase from "@/utils/Supabase";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomModal from "@/components/CustomModal";

const Add = () => {
  const [seletedType, setseletedType] = useState("expense");
  const [money, setMoney] = useState(0);
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [tagFocused, setTagFocused] = useState(0);
  const { tagsList } = useContext(CategoriesContext);
  const [seletedTag, setSeletedTag] = useState({
    id: 0,
    created_at: new Date(),
    name: "",
    iconName: "",
    color: "",
    type: "",
    parentId: 0,
    most_used: false,
  });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const { fetchExpenseItems } = useContext(CategoriesContext);
  const [tagListVisible, setTagListVisible] = useState(false);

  useEffect(() => {
    const defaultTag = tagsList.filter(
      (tag: { most_used: boolean; type: string }) =>
        tag.most_used && tag.type === seletedType
    )[0];
    setSeletedTag(defaultTag);
  }, []);

  const truncateTagName = (name: string) => {
    if (name.length > 8) {
      return name.substring(0, 5) + "...";
    }
    return name;
  };

  const onChange = ({ type }: any, selectedDate: Date) => {
    if (type == "set") {
      const currentDate = selectedDate || date;
      setDate(currentDate);
    }
  };

  const onAddExpenseItem = async () => {
    if (date > new Date()) {
      Alert.alert("warning", "ngày phải là ngày hôm nay trở về trước");
      return false;
    }
    try {
      setLoading(true);
      const user = await client.getUserDetails();
      const { data, error } = await supabase
        .from("ExpenseItems")
        .insert({
          money: money,
          name: name,
          detail: detail,
          type: seletedTag.type,
          tag_id: seletedTag.id,
          time: date.toISOString(),
          created_by: user.email,
        })
        .select();
      if (data) {
        await fetchExpenseItems();
        setLoading(false);
        setMoney(0);
        setDetail("");
        setName("");
        setDate(new Date());
        setseletedType("expense");
        const defaultTag = tagsList.filter(
          (tag: {most_used: boolean, type: string}) => tag.most_used && tag.type === "expense"
        )[0];
        setSeletedTag(defaultTag);
        Alert.alert("Success", "Thêm mục thành công", [{ text: "OK" }], {
          cancelable: true,
        });
        router.replace("tracking");
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}> Thêm mục Thu/Chi</Text>
      </View>
      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[
            styles.type,
            seletedType === "expense" && { backgroundColor: Colors.PRIMARYA },
          ]}
          onPress={() => {
            setseletedType("expense");
            const defaultTag = tagsList.filter(
              (tag: {most_used: boolean, type: string}) => tag.most_used && tag.type === "expense"
            )[0];
            setSeletedTag(defaultTag);
          }}
        >
          <Text
            style={[
              styles.typeLabel,
              seletedType === "expense" && { color: "white" },
            ]}
          >
            Chi ra
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.type,
            seletedType === "income" && { backgroundColor: Colors.PRIMARYA },
          ]}
          onPress={() => {
            setseletedType("income");
            const defaultTag = tagsList.filter(
              (tag: {most_used: boolean, type: string}) => tag.most_used && tag.type === "income"
            )[0];
            setSeletedTag(defaultTag);
          }}
        >
          <Text
            style={[
              styles.typeLabel,
              seletedType === "income" && { color: "white" },
            ]}
          >
            Thu vào
          </Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView style={{ padding: 10, display: "flex" }}>
        <InputField
          title="Money"
          value={money}
          handleChangeText={(value: React.SetStateAction<number>) =>
            setMoney(value)
          }
          logo=""
          placeholder="0"
          keyboardType="numeric"
          otherStyles={{
            fontFamily: "rr",
            textAlign: "right",
            fontSize: 30,
            paddingRight: 10,
          }}
        />
        <InputField
          title="Item Name"
          value={name}
          handleChangeText={(value: React.SetStateAction<string>) =>
            setName(value)
          }
          logo=""
          placeholder="Tên"
          keyboardType="default"
          otherStyles={{
            fontSize: 20,
            fontFamily: "rr",
          }}
        />
        <InputField
          title="Detail"
          value={detail}
          handleChangeText={(value: React.SetStateAction<string>) =>
            setDetail(value)
          }
          logo=""
          placeholder="Chi tiết"
          keyboardType="default"
          otherStyles={{
            fontSize: 20,
            fontFamily: "rr",
          }}
        />
        {
          <View style={styles.tagContainer}>
            <View style={styles.tagSubContainer}>
              <DisplayIcon
                name={seletedTag.iconName}
                color={seletedTag.color}
                otherStyles={{
                  width: 60,
                  height: 60,
                  borderRadius: 5,
                }}
              />
              <Text style={{ fontSize: 20, fontFamily: "rsb" }}>
                {seletedTag.name}
              </Text>
            </View>
            <View>
              <CustomModal isOpen={show} withInput={false}>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode="datetime"
                  display="spinner"
                  onChange={()=>onChange}
                  style={{ backgroundColor: "white" }}
                  textColor={Colors.PRIMARYA}
                />
                <TouchableOpacity
                  onPress={() => setShow(false)}
                  style={styles.btnDone}
                >
                  <Text style={styles.btnText}>Xong</Text>
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
        }
        <View style={styles.mostUseContainer}>
          <Text style={styles.mostUse}>mục thường dùng</Text>
          <TouchableOpacity
            style={styles.allTagsContainer}
            onPress={() => setTagListVisible(true)}
          >
            <Text
              style={{
                fontFamily: "rr",
                fontSize: 16,
                color: Colors.categories.b,
              }}
            >
              Tất cả mục
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors.categories.b}
            />
          </TouchableOpacity>
          <CustomModal isOpen={tagListVisible} withInput={false}>
            <View style={styles.tagListContainer}>
              {tagsList
                .filter((tag: {type: string}) => tag.type === seletedType)
                .map((tag: { id: number; created_at: Date; name: string; iconName: string; color: string; type: string; parentId: number; most_used: boolean; }) => (
                  <TouchableOpacity
                    key={tag.id}
                    style={styles.categoryContainer}
                    onPress={() => {
                      setTagFocused(tag.id);
                      setSeletedTag(tag);
                    }}
                  >
                    <DisplayIcon
                      name={tag.iconName}
                      color={tag.color}
                      otherStyles={[
                        {
                          width: 60,
                          height: 60,
                          borderRadius: 5,
                        },
                        tagFocused === tag.id && {
                          backgroundColor: "#ebebeb",
                          borderColor: "#FF9C01",
                        },
                      ]}
                    />
                    <Text style={{ marginTop: 5 }}>
                      {truncateTagName(tag.name)}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity
              onPress={() => setTagListVisible(false)}
              style={styles.btnDone}
            >
              <Text style={styles.btnText}>Xong</Text>
            </TouchableOpacity>
          </CustomModal>
        </View>
        <View style={styles.categoriesContainer}>
          <View style={styles.listMostUse}>
            {tagsList
              .filter((tag: { most_used: boolean; type: string; }) => tag.most_used && tag.type === seletedType)
              .map((tag: { id: number; created_at: Date; name: string; iconName: string; color: string; type: string; parentId: number; most_used: boolean; }) => (
                <TouchableOpacity
                  key={tag.id}
                  style={styles.categoryContainer}
                  onPress={() => {
                    setTagFocused(tag.id);
                    setSeletedTag(tag);
                  }}
                >
                  <DisplayIcon
                    name={tag.iconName}
                    color={tag.color}
                    otherStyles={[
                      {
                        width: 60,
                        height: 60,
                        borderRadius: 5,
                      },
                      tagFocused === tag.id && {
                        backgroundColor: "#ebebeb",
                        borderColor: "#FF9C01",
                      },
                    ]}
                  />
                  <Text style={{ marginTop: 5 }}>
                    {truncateTagName(tag.name)}
                  </Text>
                </TouchableOpacity>
              ))}
            <View style={styles.categoryContainer}>
              <DisplayIcon
                name="pencil"
                color="blue"
                otherStyles={{
                  width: 60,
                  height: 60,
                  borderRadius: 5,
                }}
              />
              <Text style={{ marginTop: 5 }}>Change</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.btnAdd}
          disabled={money === 0 || name === ""}
          onPress={() => onAddExpenseItem()}
        >
          {loading ? (
            <ActivityIndicator size={"large"} color={"white"} />
          ) : (
            <Text style={styles.btnAddText}>Xong</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Add;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    height: "100%",
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
    backgroundColor: "white",
    padding: 10,
    borderRadius: 15,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    borderWidth: 2,
    borderColor: Colors.GRAY,
    justifyContent: "space-between",
    width: "100%",
  },
  tagSubContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    width: "30%",
  },
  dateText: {
    fontSize: 16,
    fontFamily: "rr",
  },
  mostUse: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 16,
    fontFamily: "ar",
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
  tagListContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
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
  btnAdd: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: Colors.PRIMARYA,
    borderRadius: 10,
    marginTop: 10,
  },
  btnAddText: {
    color: "white",
    fontSize: 20,
    fontFamily: "ab",
    textAlign: "right",
  },
  datePickerContainer: {
    position: "absolute",
    top: 0,
    right: 0,
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
  btnText: {
    fontFamily: "ar",
    color: "white",
  },
});
