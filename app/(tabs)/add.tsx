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

const Add = () => {
  const [seletedType, setseletedType] = useState("expense");
  const [money, setMoney] = useState(0);
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [tagFocused, setTagFocused] = useState(0);
  const { tagsList } = useContext(CategoriesContext);
  const [seletedTag, setSeletedTag] = useState({});
  const [loading, setLoading] = useState(false);

  const { fetchExpenseItems } = useContext(CategoriesContext);

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    console.log(currentDate.toISOString());
    setShow(false);
    setDate(currentDate);
  };

  useEffect(() => {
    const defaultTag = tagsList.filter(
      (tag) => tag.most_used && tag.type === seletedType
    )[0];
    setSeletedTag(defaultTag);
  }, []);

  const truncateTagName = (name) => {
    if (name.length > 8) {
      return name.substring(0, 5) + "...";
    }
    return name;
  };

  const onAddExpenseItem = async () => {
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
          (tag) => tag.most_used && tag.type === "expense"
        )[0];
        setSeletedTag(defaultTag);
        Alert.alert("Success", "Expense added successfully", [{ text: "OK" }], {
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
        <Text style={styles.headerTitle}> Add New Expense/Income</Text>
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
              (tag) => tag.most_used && tag.type === "expense"
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
            Expense
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
              (tag) => tag.most_used && tag.type === "income"
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
            Income
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
          placeholder="Name"
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
          placeholder="You use money for ..."
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
              {show && (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="datetime"
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                  />
                  <Text style={{ color: Colors.SECONDARYB }}>Changing</Text>
                </View>
              )}
              <TouchableOpacity onPress={() => setShow(true)}>
                {!show && (
                  <Text style={styles.dateText}>
                    {date.toLocaleDateString()} {date.toLocaleTimeString()}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        }
        <View style={styles.mostUseContainer}>
          <Text style={styles.mostUse}>most used tags</Text>
          <TouchableOpacity style={styles.allTagsContainer}>
            <Text
              style={{
                fontFamily: "rr",
                fontSize: 16,
                color: Colors.categories.b,
              }}
            >
              All Tags
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors.categories.b}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.categoriesContainer}>
          <View style={styles.listMostUse}>
            {tagsList
              .filter((tag) => tag.most_used && tag.type === seletedType)
              .map((tag) => (
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
            <Text style={styles.btnAddText}>Done</Text>
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
    fontFamily: "rr",
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
  },
  tagSubContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
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
    fontFamily: "rb",
    textAlign: "right",
  },
});
