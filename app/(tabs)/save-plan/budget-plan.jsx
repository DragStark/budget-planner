import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../../constants/Colors";
import CustomModal from "../../../components/CustomModal";
import InputField from "../../../components/InputField";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CategoriesContext } from "../../../context/CategoriesContext";
import DisplayIcon from "../../../components/TagDisplayIcon/index";
import { client } from "../../../utils/KindeConfig";
import supabase from "../../../utils/Supabase";
import BudgetPlanList from "../../../components/BudgetPlan/BudgetPlanList";
import { router } from "expo-router";
import Tag from "../../../components/TagDisplayIcon/Tag";

const BudgetPlan = () => {
  const [modalVisible, setmodalVisible] = useState(false);
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [money, setMoney] = useState(new Date());
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendar2Visible, setCalendar2Visible] = useState(false);
  const [tagsListVisible, setTagsListVisible] = useState(false);
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const { parentTagsList, tagsList, budgetPlans, fetchBudgetPlans } =
    useContext(CategoriesContext);
  const [selectedTag, setSelectedTag] = useState({});

  const onChangeStart = ({ type }, selectedDate) => {
    if (type === "set") {
      setDateStart(selectedDate || dateStart);
    }
  };

  const onChangeEnd = ({ type }, selectedDate) => {
    if (type === "set") {
      setDateEnd(selectedDate || dateEnd);
    }
  };

  const truncateTagName = (name) => {
    if (name) {
      if (name.length > 15) {
        return name.substring(0, 15) + "...";
      }
    } else {
      return "";
    }
    return name;
  };

  onOpenAddModal = () => {
    //initialize
    setSelectedTag(tagsList[0]);
    setMoney(0);
    setDetail("");
    setName("");
    setDateStart(new Date());
    setDateEnd(new Date());
    setmodalVisible(true);
  };

  const onCreate = async () => {
    try {
      const user = await client.getUserDetails();

      const { data, error } = await supabase
        .from("BudgetPlans")
        .insert([
          {
            money: money,
            progress: 0,
            name: name,
            detail: detail,
            dateStart: dateStart.toISOString(),
            dateEnd: dateEnd.toISOString(),
            created_by: user.email,
            tagId: selectedTag.id,
          },
        ])
        .select();
      if (error) {
        throw error;
      }
      fetchBudgetPlans();
      Alert.alert("success", "thêm kế hoạch thành công");
      setmodalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{ marginRight: 60 }}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={30} color={"white"} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Kế hoạch chi tiêu</Text>
      </View>
      {/* modal add new budget plan */}
      <CustomModal isOpen={modalVisible} withInput={true}>
        <View style={styles.formContainer}>
          <InputField
            title="name"
            value={name}
            handleChangeText={(value) => setName(value)}
            placeholder="tên kế hoạch"
            otherStyles={styles.inputReStyles}
          />
          <InputField
            title="detail"
            value={detail}
            handleChangeText={(value) => setDetail(value)}
            placeholder="nội dung"
            otherStyles={styles.inputReStyles}
          />
          <InputField
            title="Money"
            value={money}
            handleChangeText={(value) => setMoney(value)}
            placeholder="0"
            keyboardType="numeric"
            otherStyles={{ textAlign: "right", fontSize: 30 }}
          />
          {/* pick plan start date */}
          <TouchableOpacity
            onPress={() => setCalendarVisible(true)}
            style={styles.datePicker}
          >
            <Text style={styles.datePickerText}>Bắt đầu</Text>
            <Text style={styles.datePickerText}>
              {dateStart.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          <CustomModal isOpen={calendarVisible} withInput={false}>
            <DateTimePicker
              testID="dateTimePicker"
              value={dateStart}
              mode="date"
              display="spinner"
              onChange={onChangeStart}
              style={{ backgroundColor: "white" }}
              textColor={Colors.PRIMARYA}
            />
            <TouchableOpacity
              onPress={() => setCalendarVisible(false)}
              style={styles.btnDone}
            >
              <Text style={styles.btnText}>Xong</Text>
            </TouchableOpacity>
          </CustomModal>
          {/* pick plan end date */}
          <TouchableOpacity
            onPress={() => setCalendar2Visible(true)}
            style={styles.datePicker}
          >
            <Text style={styles.datePickerText}>Kết thúc</Text>
            <Text style={styles.datePickerText}>
              {dateEnd.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          <CustomModal isOpen={calendar2Visible} withInput={false}>
            <DateTimePicker
              testID="dateTimePicker"
              value={dateEnd}
              mode="date"
              display="spinner"
              minimumDate={dateStart}
              onChange={onChangeEnd}
              style={{ backgroundColor: "white" }}
              textColor={Colors.PRIMARYA}
            />
            <TouchableOpacity
              onPress={() => setCalendar2Visible(false)}
              style={styles.btnDone}
            >
              <Text style={styles.btnText}>Xong</Text>
            </TouchableOpacity>
          </CustomModal>
          {/* pick tag for this plan */}
          <TouchableOpacity
            style={styles.selectedTagsContainer}
            onPress={() => setTagsListVisible(true)}
          >
            {selectedTag.name ? (
              <>
                <Tag url={selectedTag.iconUrl} />
                <Text style={styles.iconName}>
                  {truncateTagName(selectedTag.name)}
                </Text>
              </>
            ) : (
              <Text style={{ fontSize: 20, fontFamily: "ar", margin: 5 }}>
                chọn danh mục cho khoản chi
              </Text>
            )}
          </TouchableOpacity>
          <CustomModal isOpen={tagsListVisible} withInput={false}>
            <View style={styles.tagListContainer}>
              {parentTagsList.map((parentTag, index) => (
                <View key={index} style={styles.parentTagContainer}>
                  <Text style={styles.parentTagName}>{parentTag.name}</Text>
                  <View key={index} style={styles.childTagContainer}>
                    {tagsList
                      .filter((tag) => tag.parrent_id === parentTag.id)
                      .map((tag, index) => (
                        <TouchableOpacity
                          key={tag.id}
                          style={styles.categoryContainer}
                          onPress={() => {
                            setSelectedTag(tag);
                            setTagsListVisible(false);
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
        </View>
        {/* button submit form and close modal */}
        <View style={styles.btnGroup}>
          <TouchableOpacity
            onPress={() => setmodalVisible(false)}
            style={styles.btnAdd}
          >
            <Text style={styles.btnAddText}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onCreate()}
            disabled={name === "" || detail === "" || money === 0}
            style={styles.btnAdd}
          >
            <Text style={styles.btnAddText}>Xong</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>
      {/* show list budget plan */}
      <View style={styles.contentContainer}>
        <BudgetPlanList budgetPlanList={budgetPlans} />
      </View>
      {/* button open modal add new budget plan */}
      <TouchableOpacity
        style={styles.addBtnContainer}
        onPress={() => onOpenAddModal()}
      >
        <Ionicons name="add-circle" size={64} color={Colors.PRIMARYA} />
      </TouchableOpacity>
    </View>
  );
};

export default BudgetPlan;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    height: "100%",
  },
  header: {
    display: "flex",
    height: "12%",
    flexDirection: "row",
    backgroundColor: Colors.PRIMARYA,
    marginBottom: 20,
    alignItems: "flex-end",
    paddingBottom: 20,
    paddingLeft: 20,
  },
  headerText: {
    fontSize: 20,
    fontFamily: "ab",
    color: "white",
  },
  addBtnContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "white",
    padding: 0,
    borderRadius: 50,
  },
  formContainer: {
    width: "100%",
  },
  datePicker: {
    height: 40,
    width: "100%",
    borderWidth: 2,
    borderColor: Colors.GRAY,
    borderRadius: 10,
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  datePickerText: {
    fontFamily: "ar",
    fontSize: 20,
  },
  selectedTagsContainer: {
    display: "flex",
    flexDirection: "row",
    height: 60,
    borderRadius: 10,
    borderWidth: 2,
    padding: 5,
    marginTop: 10,
    gap: 10,
    alignItems: "center",
    backgroundColor: "white",
    borderColor: Colors.GRAY,
  },
  iconName: {
    fontFamily: "ar",
    fontSize: 20,
  },
  selectedTagsPlaceHolder: {
    fontFamily: "ar",
    fontSize: 16,
    color: Colors.categories.a,
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
  btnGroup: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    gap: 10,
  },
  btnAdd: {
    backgroundColor: Colors.PRIMARYA,
    marginTop: 10,
    width: "48%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  btnAddText: {
    fontFamily: "ab",
    fontSize: 20,
    color: "white",
  },
  inputReStyles: {
    fontSize: 20,
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
  contentContainer: {},
});
