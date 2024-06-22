import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { Colors } from "../../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import CustomModal from "../../../components/CustomModal";
import InputField from "../../../components/InputField";
import DateTimePicker from "@react-native-community/datetimepicker";
import { client } from "../../../utils/KindeConfig";
import supabase from "../../../utils/Supabase";
import { CategoriesContext } from "../../../context/CategoriesContext";
import DisplayIcon from "../../../components/TagDisplayIcon";
import PeriodicInvoicesList from "../../../components/PeriodicInvoices/PeriodicInvoicesList";

const PeriodicInvoices = () => {
  const [name, setName] = useState("");
  const [period, setPeriod] = useState(2);
  const [time, setTime] = useState("");
  const [selectedTag, setSelectedTag] = useState(1);
  const [modalVisible, setmodalVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [dayInWeekModal, setDayInWeekModal] = useState(false);
  const [dayInMonthModal, setDayInMonthModal] = useState(false);
  const [tagsListVisible, setTagsListVisible] = useState(false);
  const [typeVisible, setTypeVisible] = useState(false);

  const { periodicInvoices, fetchPeriodicInvoices, tagsList } =
    useContext(CategoriesContext);

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

  const onOpenAddModal = () => {
    setName("");
    setPeriod(2);
    setTime("15");
    setSelectedTag(tagsList[0]);
    setmodalVisible(true);
  };

  const handleOpenChoseTime = () => {
    switch (period) {
      case 1:
        setDayInWeekModal(true);
        break;
      case 2:
        setDayInMonthModal(true);
        break;
      case 3:
        setCalendarVisible(true);
        break;
    }
  };

  const validateDay = () => {
    if (period === 2) {
      return parseInt(time) >= 1 && parseInt(time) <= 31;
    } else if (period === 3) {
      const date = time.split("/");
      if (parseInt(date[1]) < 1 || parseInt(date[1]) > 12) return false;
      switch (date[1]) {
        case "1":
          console.log(parseInt(date[0]));
          return parseInt(date[0]) >= 1 && parseInt(date[0]) <= 31;
        case "2":
          return parseInt(date[0]) >= 1 && parseInt(date[0]) <= 28;
        case "3":
          return parseInt(date[0]) >= 1 && parseInt(date[0]) <= 31;
        case "4":
          return parseInt(date[0]) >= 1 && parseInt(date[0]) <= 30;
        case "5":
          return parseInt(date[0]) >= 1 && parseInt(date[0]) <= 31;
        case "6":
          return parseInt(date[0]) >= 1 && parseInt(date[0]) <= 30;
        case "7":
          return parseInt(date[0]) >= 1 && parseInt(date[0]) <= 31;
        case "8":
          return parseInt(date[0]) >= 1 && parseInt(date[0]) <= 31;
        case "9":
          return parseInt(date[0]) >= 1 && parseInt(date[0]) <= 30;
        case "10":
          return parseInt(date[0]) >= 1 && parseInt(date[0]) <= 31;
        case "11":
          return parseInt(date[0]) >= 1 && parseInt(date[0]) <= 30;
        case "12":
          return parseInt(date[0]) >= 1 && parseInt(date[0]) <= 31;
        default:
          return false;
      }
    }
    return true;
  };

  const displayTime = () => {
    let timeStr = "";
    switch (period) {
      case 1:
        switch (time) {
          case "mon":
            timeStr = "Thứ hai";
            break;
          case "tue":
            timeStr = "Thứ ba";
            break;
          case "wed":
            timeStr = "Thứ tư";
            break;
          case "thu":
            timeStr = "Thứ năm";
            break;
          case "fri":
            timeStr = "Thứ sáu";
            break;
          case "sat":
            timeStr = "Thứ bảy";
            break;
          case "sun":
            timeStr = "Chủ nhật";
            break;
        }
        return timeStr;
      case 2:
        return time;
      case 3:
        return time;
    }
  };

  useEffect(() => {
    fetchPeriodicInvoices();
  }, []);

  const onCreate = async () => {
    try {
      const user = await client.getUserDetails();

      const { data, error } = await supabase
        .from("PeriodicInvoices")
        .insert([
          {
            name: name,
            time: time,
            period: period,
            tag_id: selectedTag.id,
            created_by: user.email,
          },
        ])
        .select();
      if (error) {
        throw error;
      }
      console.log(data);
      fetchPeriodicInvoices();
      Alert.alert("success", "thêm hóa đơn định kì");
      setmodalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{ marginRight: 80 }}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={30} color={"white"} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Hóa đơn định kì</Text>
      </View>
      {/* modal add new installment */}
      <CustomModal isOpen={modalVisible} withInput={true}>
        <View style={styles.formContainer}>
          {/* pericodic invoice name */}
          <InputField
            title="name"
            data={name}
            handleChangeText={(value) => setName(value)}
            keyboardType="default"
            placeholder="Tên"
          />

          {/* picking pericodic invoice period */}
          <TouchableOpacity
            onPress={() => setTypeVisible(true)}
            style={styles.datePicker}
          >
            <Text style={styles.datePickerText}>Định kì:</Text>
            <Text style={styles.datePickerText}>
              {period === 1
                ? "hàng tuần"
                : period === 2
                ? "hàng tháng"
                : "hàng năm"}
            </Text>
          </TouchableOpacity>
          <CustomModal isOpen={typeVisible} withInput={false}>
            <TouchableOpacity
              onPress={() => {
                setTypeVisible(false);
                setPeriod(1);
                setTime("mon");
              }}
              style={styles.btnDone}
            >
              <Text style={styles.btnText}>hàng tuần</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setTypeVisible(false);
                setPeriod(2);
                setTime("15");
              }}
              style={styles.btnDone}
            >
              <Text style={styles.btnText}>hàng tháng</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setTypeVisible(false);
                setPeriod(3);
                setTime("19/5");
              }}
              style={styles.btnDone}
            >
              <Text style={styles.btnText}>hàng năm</Text>
            </TouchableOpacity>
          </CustomModal>
          {/* pick pericodic invoice time */}
          <TouchableOpacity
            onPress={() => handleOpenChoseTime()}
            style={styles.datePicker}
          >
            <Text style={styles.datePickerText}>Ngày:</Text>
            <Text style={styles.datePickerText}>{displayTime()}</Text>
          </TouchableOpacity>
          <CustomModal isOpen={calendarVisible} withInput={false}>
            <Text style={{ fontFamily: "asb", fontSize: 16, marginBottom: 10 }}>
              Nhập vào một ngày cố định
            </Text>
            <InputField
              title="time"
              data={time}
              handleChangeText={(value) => setTime(value)}
              keyboardType="default"
              placeholder="vd: 19/5"
            />
            <TouchableOpacity
              onPress={() => {
                if (validateDay()) {
                  setCalendarVisible(false);
                } else {
                  Alert.alert("Lỗi", "ngày bạn nhập vào không hợp lệ");
                }
              }}
              style={styles.btnDone}
            >
              <Text style={styles.btnText}>Xong</Text>
            </TouchableOpacity>
          </CustomModal>
          <CustomModal isOpen={dayInWeekModal} withInput={false}>
            <TouchableOpacity
              onPress={() => {
                setDayInWeekModal(false);
                setTime("mon");
              }}
              style={styles.btnDone}
            >
              <Text style={styles.btnText}>Thứ hai</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setDayInWeekModal(false);
                setTime("tue");
              }}
              style={styles.btnDone}
            >
              <Text style={styles.btnText}>Thứ ba</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setDayInWeekModal(false);
                setTime("wed");
              }}
              style={styles.btnDone}
            >
              <Text style={styles.btnText}>Thứ tư</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setDayInWeekModal(false);
                setTime("thu");
              }}
              style={styles.btnDone}
            >
              <Text style={styles.btnText}>Thứ năm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setDayInWeekModal(false);
                setTime("fri");
              }}
              style={styles.btnDone}
            >
              <Text style={styles.btnText}>Thứ sáu</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setDayInWeekModal(false);
                setTime("sat");
              }}
              style={styles.btnDone}
            >
              <Text style={styles.btnText}>Thứ bảy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setDayInWeekModal(false);
                setTime("sun");
              }}
              style={styles.btnDone}
            >
              <Text style={styles.btnText}>Chủ nhật</Text>
            </TouchableOpacity>
          </CustomModal>
          <CustomModal isOpen={dayInMonthModal} withInput={false}>
            <InputField
              title="time"
              data={time}
              handleChangeText={(value) => setTime(value)}
              keyboardType="default"
              placeholder="số từ 1 - 31"
            />
            <TouchableOpacity
              onPress={() => {
                if (validateDay()) {
                  setDayInMonthModal(false);
                } else {
                  Alert.alert("Lỗi", "ngày bạn nhập vào không hợp lệ");
                }
              }}
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
                chọn danh mục cho hóa đơn
              </Text>
            )}
          </TouchableOpacity>
          <CustomModal isOpen={tagsListVisible} withInput={false}>
            <View style={styles.tagListContainer}>
              {tagsList
                .filter((tag) => tag.type === "expense")
                .map((tag) => (
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
              disabled={name === ""}
              style={styles.btnAdd}
            >
              <Text style={styles.btnAddText}>Xong</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomModal>
      {/* periodic invoices list item */}
      <View>
        <PeriodicInvoicesList periodicInvoices={periodicInvoices}/>
      </View>
      {/* button open modal */}
      <TouchableOpacity
        style={styles.addBtnContainer}
        onPress={() => onOpenAddModal()}
      >
        <Ionicons name="add-circle" size={64} color={Colors.PRIMARYA} />
      </TouchableOpacity>
    </View>
  );
};

export default PeriodicInvoices;

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
  },
  datePickerText: {
    fontFamily: "ar",
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
  inputLabel: {
    marginTop: 5,
    fontFamily: "ar",
    fontSize: 16,
    marginLeft: 5,
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
});
