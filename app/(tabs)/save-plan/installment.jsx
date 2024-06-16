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
import InstallmentList from "../../../components/Installment/InstallmentList";

const Installment = () => {
  const [modalVisible, setmodalVisible] = useState(false);
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [term, setTerm] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [money, setMoney] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [typeVisible, setTypeVisible] = useState(false);
  const [selectedType, setSelectedType] = useState(1);
  const [dateStart, setDateStart] = useState(new Date());
  const { installments, fetchInstallments } = useContext(CategoriesContext);

  const onChangeStart = ({ type }, selectedDate) => {
    if (type === "set") {
      setDateStart(selectedDate || dateStart);
    }
  };

  const onOpenAddModal = () => {
    setName("");
    setMoney(0);
    setDetail("");
    setDateStart(new Date());
    setTerm(0);
    setInterestRate(0);
    setSelectedType(1);
    setmodalVisible(true);
  };

  useEffect(() => {
    fetchInstallments();
  }, []);

  const onCreate = async () => {
    try {
      const user = await client.getUserDetails();

      const { data, error } = await supabase
        .from("Installments")
        .insert([
          {
            money: money,
            progress: 0,
            type: selectedType,
            name: name,
            detail: detail,
            dateStart: dateStart.toISOString(),
            term: term,
            monthlyPaidDoneList: "",
            interestRate: interestRate,
            created_by: user.email,
          },
        ])
        .select();
      if (error) {
        throw error;
      }
      fetchInstallments();
      Alert.alert("success", "thêm khoản trả góp thành công");
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
        <Text style={styles.headerText}>Sổ tay trả góp</Text>
      </View>
      {/* modal add new installment */}
      <CustomModal isOpen={modalVisible} withInput={true}>
        <View style={styles.formContainer}>
          {/* installment budget */}
          <InputField
            title="Money"
            data={money}
            handleChangeText={(value) => setMoney(value)}
            keyboardType="numeric"
            placeholder="0"
            otherStyles={{
              textAlign: "right",
              marginRight: 5,
              fontSize: 30,
            }}
          />
          {/* installment name */}
          <InputField
            title="name"
            data={name}
            handleChangeText={(value) => setName(value)}
            keyboardType="default"
            placeholder="Tên"
          />
          {/* installment detail */}
          <InputField
            title="detail"
            data={detail}
            handleChangeText={(value) => setDetail(value)}
            keyboardType="default"
            placeholder="Chi tiết"
          />
          {/* pick type of installment */}
          <TouchableOpacity
            onPress={() => setTypeVisible(true)}
            style={styles.datePicker}
          >
            <Text style={styles.datePickerText}>Loại</Text>
            <Text style={styles.datePickerText}>
              {selectedType === 1 ? "dư nợ giảm dần" : "dư nợ gốc"}
            </Text>
          </TouchableOpacity>
          <CustomModal isOpen={typeVisible} withInput={false}>
            <TouchableOpacity
              onPress={() => {
                setTypeVisible(false)
                setSelectedType(1);
              }}
              style={styles.btnDone}
            >
              <Text style={styles.btnText}>Dư nợ giảm dần</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setTypeVisible(false)
                setSelectedType(2);
              }}
              style={styles.btnDone}
            >
              <Text style={styles.btnText}>Dư nợ gốc</Text>
            </TouchableOpacity>
          </CustomModal>
          {/* pick installment start date */}
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
          {/* term of installment */}
          <InputField
            title="Term"
            data={term}
            handleChangeText={(value) => setTerm(value)}
            keyboardType="numeric"
            otherStyles={{
              textAlign: "right",
              marginRight: 10,
            }}
            placeholder="0"
          />
          {/* Interest rate of installment */}
          <InputField
            title="InterestRate"
            data={interestRate}
            handleChangeText={(value) => setInterestRate(value)}
            keyboardType="numeric"
            otherStyles={{
              textAlign: "right",
              marginRight: 10,
            }}
            placeholder="0"
          />
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
              disabled={
                name === "" || detail === "" || money === 0 || term === 0
              }
              style={styles.btnAdd}
            >
              <Text style={styles.btnAddText}>Xong</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomModal>
      {/* installments list item */}
      <View>
        <InstallmentList data={installments} />
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

export default Installment;

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
});
