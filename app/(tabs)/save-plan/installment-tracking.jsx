import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { Colors } from "../../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { CategoriesContext } from "../../../context/CategoriesContext";
import CustomModal from "../../../components/CustomModal";
import supabase from "../../../utils/Supabase";

const InstallmentTracking = () => {
  const {
    id,
    name,
    detail,
    dateStart,
    dateEnd,
    term,
    interestRate,
    progress,
    money,
    type,
    monthlyPaidDoneList,
  } = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(-1);
  const [monthlyPaidDone, setMonthlyPaidDone] = useState([]);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updatePerc, setUpdatePerc] = useState(0);
  const { fetchInstallments } = useContext(CategoriesContext);

  const monthlyInstallmentItems = () => {
    let monthlyInterestRate = interestRate / 12;
    let monthlyInstallment = [];
    let monthly_res_money = money;
    let monthly_interest = 0;
    const monthly_base = money / term;

    if (type == 1) {
      for (let index = 0; index < term; index++) {
        monthly_interest = (monthly_res_money * monthlyInterestRate) / 100;
        monthly_res_money -= monthly_base;
        monthlyInstallment.push(Math.round(monthly_base + monthly_interest));
      }
    }else {
      for (let index = 0; index < term; index++) {
        monthly_interest = (monthly_res_money * monthlyInterestRate) / 100;
        monthlyInstallment.push(Math.round(monthly_base + monthly_interest));
      }
    }
    return monthlyInstallment;
  };

  const totalRealCost = () => {
    let realCost = 0;
    monthlyInstallmentItems().forEach((item) => (realCost += item));
    return realCost;
  };

  const getInstallmentDate = (startDate, index) => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + index);
    return `${date.getMonth() + 2}/${date.getFullYear()}`;
  };

  const onDoneMonthlyPaid = async (index) => {
    setModalVisible(false);
    const newPaidDone = [...monthlyPaidDone, index];
    setMonthlyPaidDone(newPaidDone);
    const newProgress =
      updateProgress + parseInt(monthlyInstallmentItems()[index]);
    setUpdateProgress(newProgress);
    try {
      const { data, error } = await supabase
        .from("Installments")
        .update({
          progress: newProgress,
          monthlyPaidDoneList: newPaidDone.join(","),
        })
        .eq("id", id)
        .select();
      fetchInstallments();
    } catch (error) {
      console.error(error);
    }
    const percentage = (newProgress / totalRealCost()) * 100;
    const roundedPerc = percentage.toFixed(2);
    setUpdatePerc(roundedPerc);
  };

  const onMonthlyCancel = async (index) => {
    setModalVisible(false);
    const newPaidDone = monthlyPaidDone.filter(
      (paidIndex) => paidIndex !== index
    );
    setMonthlyPaidDone(newPaidDone);
    const newProgress =
      updateProgress - parseInt(monthlyInstallmentItems()[index]);
    setUpdateProgress(newProgress);

    try {
      const { data, error } = await supabase
        .from("Installments")
        .update({
          progress: newProgress,
          monthlyPaidDoneList: newPaidDone.join(","),
        })
        .eq("id", id)
        .select();
      fetchInstallments();
    } catch (error) {
      console.error(error);
    }
    const percentage = (newProgress / totalRealCost()) * 100;
    const roundedPerc = percentage.toFixed(2);
    setUpdatePerc(roundedPerc);
  };

  useEffect(() => {
    const percentage = (progress / totalRealCost()) * 100;
    const roundedPerc = percentage.toFixed(2);
    setUpdatePerc(roundedPerc);
  }, [progress]);

  useEffect(() => {
    if (monthlyPaidDoneList) {
      const paidDoneArray = monthlyPaidDoneList.split(",").map(Number);
      setMonthlyPaidDone(paidDoneArray);
    }
  }, [monthlyPaidDoneList]);

  useEffect(()=>{
    setUpdateProgress(parseInt(progress));
  },[])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{ marginRight: 60 }}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={30} color={"white"} />
        </TouchableOpacity>
        <View
          style={{
            width: "50%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.headerText}>{name}</Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.previewDeck}>
          <View style={styles.courseInfo}>
            <View style={styles.courseInfoLeft}>
              <Text style={{ fontFamily: "asb", fontSize: 16 }}>
                Ghi chú: {detail}
              </Text>
              <Text style={{ fontFamily: "asb", fontSize: 16 }}>
                Kì hạn: {term} tháng ({" "}
                {new Date(dateStart).toLocaleDateString()}
                {" - "}
                {new Date(dateEnd).toLocaleDateString()})
              </Text>
              <Text style={{ fontFamily: "asb", fontSize: 16 }}>
                hình thức: {type == 1 ? "dư nợ giảm dần" : "dư nợ gốc"}
              </Text>
              <Text style={{ fontFamily: "asb", fontSize: 16 }}>
                Lãi suất: {interestRate}%/năm
              </Text>
            </View>
            <View style={styles.percentage}>
              <Text
                style={{
                  fontFamily: "ab",
                  fontSize: 30,
                  color: Colors.PRIMARYA,
                }}
              >
                {updatePerc == 100 ? Math.round(updatePerc) : updatePerc}%
              </Text>
            </View>
          </View>
        </View>
        <Text
          style={{
            fontFamily: "asb",
            fontSize: 20,
            marginLeft: 20,
            marginBottom: 10,
          }}
        >
          Các mốc trả góp{" "}
        </Text>
        <View style={styles.monthlyInstallment}>
          <View
            style={{
              marginVertical: 20,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
            }}
          >
            <Text style={{ fontFamily: "asb", fontSize: 16 }}>Kỳ hạn</Text>
            <Text style={{ fontFamily: "asb", fontSize: 16 }}>
              gốc + lãi phải trả
            </Text>
          </View>
          <ScrollView style={styles.scrollView}>
            {monthlyInstallmentItems().map((item, index) => {
              const displayDate = getInstallmentDate(dateStart, index);
              const monthlyPaidCheck = monthlyPaidDone
                ? monthlyPaidDone.includes(index)
                : false;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.installmentItem}
                  onPress={() => {
                    setSelectedMonth(index);
                    setModalVisible(true);
                  }}
                >
                  <Text
                    style={[
                      styles.installmentText,
                      monthlyPaidCheck && { color: Colors.INCOME },
                    ]}
                  >
                    {displayDate}
                  </Text>
                  <Text
                    style={[
                      styles.installmentText,
                      monthlyPaidCheck && { color: Colors.INCOME },
                    ]}
                  >
                    {item} đ
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <CustomModal isOpen={modalVisible} withInput={false}>
            <View style={styles.modalBtnGroup}>
              {monthlyPaidDone ? (
                monthlyPaidDone.includes(selectedMonth) ? (
                  <>
                    <View>
                      <Text>Bạn muốn hủy nộp lãi tháng này ?</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => onMonthlyCancel(selectedMonth)}
                      style={styles.btnCancel}
                    >
                      <Text style={styles.btnText}>Hủy</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <View>
                      <Text>Bạn đã nộp lãi tháng này ?</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => onDoneMonthlyPaid(selectedMonth)}
                      style={styles.btnDone}
                    >
                      <Text style={styles.btnText}>Xác nhận</Text>
                    </TouchableOpacity>
                  </>
                )
              ) : (
                <>
                  <View>
                    <Text>Bạn đã nộp lãi tháng này ?</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => onDoneMonthlyPaid(selectedMonth)}
                    style={styles.btnDone}
                  >
                    <Text style={styles.btnText}>Xác nhận</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </CustomModal>
          <View style={[styles.totalCostContainer, { marginVertical: 3 }]}>
            <Text style={styles.totalCostText}>Tổng</Text>
            <Text style={styles.totalCostText}>{totalRealCost()} đ</Text>
          </View>
          <View style={[styles.totalCostContainer, { marginVertical: 3 }]}>
            <Text style={styles.startCost}>Gốc</Text>
            <Text style={styles.startCost}>{money} đ</Text>
          </View>
          <View style={[styles.totalCostContainer, { marginVertical: 3 }]}>
            <Text style={styles.compareCost}>Chênh lệch</Text>
            <Text style={styles.compareCost}>{totalRealCost() - money} đ</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default InstallmentTracking;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  header: {
    height: "12%",
    backgroundColor: Colors.PRIMARYA,
    display: "flex",
    alignItems: "flex-end",
    flexDirection: "row",
    paddingBottom: 20,
    paddingLeft: 20,
  },
  headerText: {
    color: "white",
    fontFamily: "ab",
    fontSize: 20,
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  previewDeck: {
    display: "flex",
    backgroundColor: "white",
    height: "auto",
    width: "95%",
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
  },
  courseInfo: {
    display: "flex",
    flexDirection: "row",
    width: "95%",
    justifyContent: "space-between",
  },
  courseInfoLeft: {
    display: "flex",
    flexDirection: "column",
    width: "75%",
  },
  percentage: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  progressBar: {
    height: 85,
    justifyContent: "flex-end",
  },
  monthlyInstallment: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    margin: 10,
    height: 300,
  },
  installmentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  installmentText: {
    fontFamily: "ar",
    fontSize: 16,
  },
  scrollView: {
    maxHeight: 300, // Set the fixed height for ScrollView
  },
  totalCostContainer: {
    marginVertical: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  totalCostText: {
    fontFamily: "asb",
    fontSize: 16,
    color: Colors.EXPENSE,
  },
  startCost: {
    fontFamily: "asb",
    fontSize: 16,
    color: Colors.GRAY,
  },
  compareCost: {
    fontFamily: "asb",
    fontSize: 16,
    color: Colors.categories.a,
  },
  modalBtnGroup: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  btnCancel: {
    backgroundColor: Colors.PRIMARYA,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    height: 40,
  },
  btnDone: {
    backgroundColor: Colors.categories.a,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    height: 40,
  },
  btnText: {
    fontSize: 16,
    fontFamily: "asb",
    color: "white",
  },
});
