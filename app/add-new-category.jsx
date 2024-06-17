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
import CustomModal from "../components/CustomModal";
import DateTimePicker from "@react-native-community/datetimepicker";
import DisplayIcon from "../components/TagDisplayIcon/index";

const AddNewCategory = () => {
  const [selectedIcon, setSelectedIcon] = useState("IC");
  const [selectedColor, setSelectedColor] = useState(Colors.categories.a);
  const [category, setCategory] = useState("");
  const [detail, setDetail] = useState("");
  const [totalBudget, setTotalBudget] = useState(0);
  const [loading, setLoading] = useState(false);
  const { fetchCategories, tagsList } = useContext(CategoriesContext);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendar2Visible, setCalendar2Visible] = useState(false);
  const [tagsListVisible, setTagsListVisible] = useState(false);
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [selectedTag, setSelectedTag] = useState({});

  const onCreateCategory = async () => {
    try {
      setLoading(true);
      const user = await client.getUserDetails();
      const { data, error } = await supabase
        .from("Categories")
        .insert({
          name: category,
          detail: detail,
          assigned_budget: totalBudget,
          icon: selectedIcon,
          color: selectedColor,
          dateStart: dateStart.toISOString(),
          dateEnd: dateEnd.toISOString(),
          tag_id: selectedTag.id,
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
        handleChangeText={(value) => setCategory(value)}
        logo="bookmark"
        placeholder="Tên khoản chi"
        keyboardType="default"
        otherStyles={{}}
      />
      <InputField
        title="detail"
        value={detail}
        logo="pencil"
        handleChangeText={(value) => setDetail(value)}
        placeholder="nội dung"
        otherStyles={styles.inputReStyles}
      />
      <InputField
        title="Money"
        value={totalBudget}
        handleChangeText={(value) => setTotalBudget(value)}
        logo="cash"
        placeholder="0"
        keyboardType="numeric"
        otherStyles={{
          fontFamily: "rr",
          textAlign: "right",
          fontSize: 30,
          paddingRight: 10,
        }}
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
      {/* pick tag for this plan  */}
      <TouchableOpacity
        style={styles.selectedTagsContainer}
        onPress={() => setTagsListVisible(true)}
      >
        {selectedTag.name ? (
          <>
            <DisplayIcon
              name={selectedTag.iconName}
              color={selectedTag.color}
              otherStyles={[
                {
                  width: 60,
                  height: 60,
                  borderWidth: 0,
                },
              ]}
            />
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
          {tagsList.map((tag) => (
            <TouchableOpacity
              key={tag.id}
              style={styles.categoryContainer}
              onPress={() => setSelectedTag(tag)}
            >
              <DisplayIcon
                name={tag.iconName}
                color={tag.color}
                otherStyles={[
                  {
                    width: 60,
                    height: 60,
                    borderRadius: 5,
                    backgroundColor:
                      selectedTag.id === tag.id ? "#ffbcad" : "white",
                  },
                ]}
                iconSize={30}
                tagName={tag.name}
              />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={styles.btnDone}
          onPress={() => setTagsListVisible(false)}
        >
          <Text style={styles.btnText}>Xong</Text>
        </TouchableOpacity>
      </CustomModal>

      <TouchableOpacity
        style={styles.createBtn}
        disabled={category === "" || totalBudget === 0 || loading}
        onPress={() => onCreateCategory()}
      >
        {loading ? (
          <ActivityIndicator size={"large"} color={"white"} />
        ) : (
          <Text style={styles.CreateBtnText}>Tạo khoản chi</Text>
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
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
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
  CreateBtnText: {
    fontFamily: "ab",
    fontSize: 20,
    color: "white",
  },
});
