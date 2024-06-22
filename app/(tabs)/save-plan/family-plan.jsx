import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../../constants/Colors";
import CustomModal from "../../../components/CustomModal";
import InputField from "../../../components/InputField";
import { CategoriesContext } from "../../../context/CategoriesContext";
import { client } from "../../../utils/KindeConfig";
import supabase from "../../../utils/Supabase";
import { router } from "expo-router";
import ColorPicker from "../../../components/ColorPicker";
import MembersList from "../../../components/FamilyPlan/MembersList";
import FamilyCompareChart from "../../../components/CompareChart/FamilyCompareChart";

const FamilyPlan = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [color, setColor] = useState("");
  const [expenseList, setExpenseList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [colorList, setColorList] = useState([]);
  const { usersList, fetchUsersList, familyPlan, fetchFamilyPlan } =
    useContext(CategoriesContext);

  const onOpenAddModal = () => {
    setEmail("");
    setRole("");
    setColor("");
    setModalVisible(true);
  };

  const getExpenseItems = async (email) => {
    try {
      let { data, error } = await supabase
        .from("ExpenseItems")
        .select("*")
        .eq("created_by", email);
      if (error) {
        console.log(error);
        return { totalExpense: 0, totalIncome: 0 };
      }

      let totalExpense = 0;
      let totalIncome = 0;
      data.forEach((item) => {
        if (item.type === "expense") {
          totalExpense += parseInt(item.money);
        } else {
          totalIncome += parseInt(item.money);
        }
      });
      return { totalExpense, totalIncome };
    } catch (error) {
      console.error(error);
      return { totalExpense: 0, totalIncome: 0 };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUsersList();
      await fetchFamilyPlan();

      const tempExpenseList = [];
      const tempIncomeList = [];
      const tempColorList = [];

      await Promise.all(
        familyPlan.map(async (planItem) => {
          const { totalExpense, totalIncome } = await getExpenseItems(
            planItem.member
          );
          tempExpenseList.push(totalExpense);
          tempIncomeList.push(totalIncome);
          tempColorList.push(planItem.color);
        })
      );

      setExpenseList(tempExpenseList);
      setIncomeList(tempIncomeList);
      setColorList(tempColorList);
    };

    fetchData();
  }, []);

  const onCreate = async () => {
    if (usersList.find((user) => user.email == email)) {
      try {
        const user = await client.getUserDetails();

        const { data, error } = await supabase
          .from("FamilyPlans")
          .insert([
            {
              owner: user.email,
              member: email,
              role: role,
              color: color,
            },
          ])
          .select();
        if (error) {
          throw error;
        }
        fetchFamilyPlan();
        Alert.alert("Thành công", "Thêm thành viên mới thành công");
        setModalVisible(false);
      } catch (error) {
        console.error(error);
      }
    } else {
      Alert.alert("Lỗi", "Người dùng không có trong hệ thống");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={30} color={"white"} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Sổ chi tiêu gia đình</Text>
        <TouchableOpacity onPress={() => onOpenAddModal()}>
          <Ionicons name="person-add" size={30} color={"white"} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {/* Modal add new member */}
        <CustomModal isOpen={modalVisible} withInput={true}>
          <View style={styles.formContainer}>
            <InputField
              title="Email"
              value={email}
              handleChangeText={(value) => setEmail(value)}
              placeholder="Email người dùng"
              otherStyles={styles.inputReStyles}
            />
            <InputField
              title="Vai trò"
              value={role}
              handleChangeText={(value) => setRole(value)}
              placeholder="Vai trò"
              otherStyles={{
                color: color,
              }}
            />
            {/* Pick color for role */}
            <ColorPicker selectedColor={color} onSelectColor={setColor} />
            {/* Button submit form and close modal */}
            <View style={styles.btnGroup}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.btnAdd}
              >
                <Text style={styles.btnAddText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onCreate()}
                disabled={email === "" || role === ""}
                style={styles.btnAdd}
              >
                <Text style={styles.btnAddText}>Xong</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CustomModal>
        {/* Show compare chart for members */}
        {/* <FamilyCompareChart
          expenseList={expenseList}
          incomeList={incomeList}
          colorList={colorList}
        /> */}

        {/* Show list member */}
        <View style={styles.contentContainer}>
          <MembersList familyPlan={familyPlan} />
        </View>
      </ScrollView>
    </View>
  );
};

export default FamilyPlan;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    height: "100%",
  },
  header: {
    display: "flex",
    height: "12%",
    width: "100%",
    flexDirection: "row",
    backgroundColor: Colors.PRIMARYA,
    marginBottom: 20,
    alignItems: "flex-end",
    paddingBottom: 20,
    paddingHorizontal: 20,
    justifyContent: "space-between",
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
});
