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
  Button,
  Image,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { Colors } from "@/constants/Colors";
import InputField from "@/components/InputField";
import { CategoriesContext } from "@/context/CategoriesContext";
import { Ionicons } from "@expo/vector-icons";
import { client } from "@/utils/KindeConfig";
import supabase from "@/utils/Supabase";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomModal from "@/components/CustomModal";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import Tag from "../../components/TagDisplayIcon/Tag";
import { decode } from "base64-arraybuffer";

const GOOGLE_CLOUD_SPEECH_API_KEY = "AIzaSyCRuxmm1iIZWnOB8prCJNBX52zpFNGcBsE";
const GOOGLE_CLOUD_VISION_API_KEY = "AIzaSyCRuxmm1iIZWnOB8prCJNBX52zpFNGcBsE";

const Add = () => {
  const [seletedType, setseletedType] = useState("expense");
  const [money, setMoney] = useState(0);
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [imageVisible, setImageVisible] = useState(false);

  const thumbnail =
    "https://ivoqqxsmswfdokxfuqee.supabase.co/storage/v1/object/public/images/default-img.png";
  const [previewImage, setPreviewImage] = useState("");
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
  const {
    tagsList,
    fetchExpenseItems,
    budgetPlans,
    fetchBudgetPlans,
    parentTagsList,
  } = useContext(CategoriesContext);
  const [tagListVisible, setTagListVisible] = useState(false);

  useEffect(() => {
    const defaultTag = tagsList.filter((tag) => tag.type === seletedType)[0];
    setSeletedTag(defaultTag);
    fetchBudgetPlans();
  }, []);

  const onChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate || date;
      setDate(currentDate);
    }
  };

  const updateBudgetPlans = (user) => {
    budgetPlans.forEach(async (item) => {
      const start = new Date(item.dateStart);
      const end = new Date(item.dateEnd);
      const updateProgress =
        seletedType === "income"
          ? item.progress + parseInt(money)
          : item.progress - parseInt(money);
      if (date >= start && date <= end) {
        try {
          const { data, error } = await supabase
            .from("BudgetPlans")
            .update({ progress: updateProgress })
            .eq("id", item.id)
            .select();
          await fetchBudgetPlans();
          if (error) {
            throw error;
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  const getImageUrl = async () => {
    try {
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
        return fileUrl
      }
    } catch (error) {
      console.log("error in upload image: ",error);
    }
  };

  const onAddExpenseItem = async () => {
    try {
      setLoading(true);
      const imageUrl = await getImageUrl();
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
          imageUrl: imageUrl,
        })
        .select();
      if (data) {
        await fetchExpenseItems();
        updateBudgetPlans(user);
        setLoading(false);
        setMoney(0);
        setDetail("");
        setName("");
        setDate(new Date());
        setseletedType("expense");
        setPreviewImage(thumbnail)
        const defaultTag = tagsList.filter((tag) => tag.type === "expense")[0];
        setSeletedTag(defaultTag);
        Alert.alert("Success", "Thêm mục thành công", [{ text: "OK" }], {
          cancelable: true,
        });
        router.replace("tracking");
      }

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error in getCategoriesList:", error);
    }
  };

  // google API speech to text
  const [recording, setRecording] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalRecord, setmodalRecord] = useState(null);
  const [modalImagePicking, setmodalImagePicking] = useState(null);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
      Alert.alert("Error", "Failed to start recording. Please try again.");
    }
  };

  const stopRecording = async () => {
    setIsLoading(true);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      await transcribeAudio(uri);
      setmodalRecord(false);
    } catch (err) {
      console.error("Failed to stop recording", err);
      Alert.alert("Error", "Failed to stop recording. Please try again.");
      setIsLoading(false);
    }
  };

  const transcribeAudio = async (uri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response = await fetch(
        `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_CLOUD_SPEECH_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            config: {
              encoding: "WEBM_OPUS",
              sampleRateHertz: 16000,
              languageCode: "vi-VN",
            },
            audio: {
              content: base64,
            },
          }),
        }
      );

      const data = await response.json();
      // console.log("Full response:", JSON.stringify(data, null, 2));
      // console.log("Transcription response:", data);
      if (data.error) {
        console.error("Transcription error:", data.error);
        setTranscription("Transcription failed. Please try again.");
      } else {
        const transcript = data.results
          .map((result) => {
            return result.alternatives[0].transcript;
          })
          .join("\n");
        setTranscription(
          transcript || "No transcription found. Please try again."
        );

        setName(getName(transcript));
        setDetail(getDetails(transcript));
        setMoney(parseInt(getMoney(transcript)));
        tagsList.forEach((tag) => {
          if (tag.name == getTag(transcript)) {
            setSeletedTag(tag);
          }
        });
      }
    } catch (error) {
      console.error("Failed to transcribe audio", error);
      setTranscription("Failed to transcribe audio. Please try again.");
    }
    setIsLoading(false);
  };

  const getName = (detectedStr) => {
    if (seletedType === "expense") {
      const oIndex = detectedStr.indexOf(" ở ");
      if (oIndex !== -1) {
        return detectedStr.substring(0, oIndex);
      }
      return "";
    }
    if (seletedType === "income") {
      const muaIndex = detectedStr.indexOf("tiền ");
      const oIndex = detectedStr.indexOf(" của ");
      if (muaIndex !== -1 && oIndex !== -1) {
        return detectedStr.substring(muaIndex + 4, oIndex);
      }
      return "";
    }
  };

  const getDetails = (detectedStr) => {
    if (seletedType === "expense") {
      const oIndex = detectedStr.indexOf("ở ");
      const hetIndex = detectedStr.indexOf(" hết ");
      if (oIndex !== -1 && hetIndex !== -1) {
        return detectedStr.substring(oIndex + 2, hetIndex);
      }
      return "";
    }
    if (seletedType === "income") {
      const oIndex = detectedStr.indexOf("của ");
      const hetIndex = detectedStr.indexOf(" loại ");
      if (oIndex !== -1 && hetIndex !== -1) {
        return detectedStr.substring(oIndex + 2, hetIndex);
      }
      return "";
    }
  };

  const getMoney = (detectedStr) => {
    if (seletedType === "expense") {
      const hetIndex = detectedStr.indexOf("hết ");
      const loaiIndex = detectedStr.indexOf(" loại");
      if (hetIndex !== -1 && loaiIndex !== -1) {
        return detectedStr
          .substring(hetIndex + 4, loaiIndex)
          .replace(/\./g, "");
      }
      return "";
    }
    if (seletedType === "income") {
      const hetIndex = detectedStr.indexOf("nhận ");
      const loaiIndex = detectedStr.indexOf(" tiền");
      if (hetIndex !== -1 && loaiIndex !== -1) {
        return detectedStr
          .substring(hetIndex + 4, loaiIndex)
          .replace(/\./g, "");
      }
      return "";
    }
  };

  const getTag = (detectedStr) => {
    const loaiIndex = detectedStr.indexOf("loại ");
    if (loaiIndex !== -1) {
      return detectedStr.substring(loaiIndex + 5).trim();
    }
    return "";
  };

  // google API cloud vision detect text from image

  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const imagePath = result.assets[0].uri;
      setPreviewImage(imagePath);
      setImage(result.assets[0].base64);
      recognizeTextFromImage(imagePath);
    }

    setmodalImagePicking(false);
  };

  const recognizeTextFromImage = async (uri) => {
    setIsLoading(true);
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: "base64",
      });
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_VISION_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requests: [
              {
                image: {
                  content: base64,
                },
                features: [
                  {
                    type: "TEXT_DETECTION",
                  },
                ],
              },
            ],
          }),
        }
      );
      const data = await response.json();
      const detectedText =
        data.responses[0].fullTextAnnotation?.text || "No text detected";
      setText(detectedText);
      if (getTotalBill(detectedText)) {
        setMoney(parseInt(getTotalBill(detectedText)));
      } else {
        setMoney(0);
      }
    } catch (error) {
      console.error(error);
      setText("Failed to recognize text");
    }
    setIsLoading(false);
  };

  const compareCashText = (str) => {
    if (str.includes("tiền mặt")) return true;
    if (str.includes("tien mat")) return true;
    if (str.includes("tong cong")) return true;
    return false;
  };

  const getTotalBill = (text) => {
    const textArray = text.split("\n");
    let indexOfTotalBill = -1;

    // Remove commas from each element in textArray
    for (let index = 0; index < textArray.length; index++) {
      textArray[index] = textArray[index].replace(/,/g, "");
    }

    for (let index = 0; index < textArray.length; index++) {
      if (compareCashText(textArray[index].toLowerCase())) {
        indexOfTotalBill = index;
        break;
      }
    }

    if (indexOfTotalBill >= 0) {
      for (let index = indexOfTotalBill; index < textArray.length; index++) {
        if (parseInt(textArray[index])) {
          return parseInt(textArray[index]);
        }
      }
    } else return null;
  };

  const getDate = (text) => {
    const textArray = text.split("\n");
    const datePattern = /\b\d{2}[-/]\d{2}[-/]\d{2,4}\b/; // Regular expression to match dd/mm/yyyy format

    for (let index = 0; index < textArray.length; index++) {
      const match = textArray[index].match(datePattern);
      if (match) {
        return match[0]; // Return the matched date
      }
    }

    return null; // Return null if no date is found
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
              (tag) => tag.type === "expense"
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
              (tag) => tag.type === "income"
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
          value={money.toString()}
          handleChangeText={(value) => setMoney(value)}
          logo=""
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
          handleChangeText={(value) => setName(value)}
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
          handleChangeText={(value) => setDetail(value)}
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
              <CustomModal isOpen={show} withInput={false}>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode="datetime"
                  display="spinner"
                  // maximumDate={new Date()}
                  onChange={onChange}
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
        <View style={styles.special}>
          <TouchableOpacity
            style={styles.specialItem}
            onPress={() => setmodalRecord(true)}
          >
            <Ionicons name="mic" size={30} color={Colors.PRIMARYA} />
          </TouchableOpacity>
          <CustomModal isOpen={modalRecord} withInput={false}>
            <Text style={{ fontFamily: "asb", fontSize: 16, marginBottom: 10 }}>
              Hãy nói theo cú pháp:
            </Text>
            <Text style={{ fontFamily: "asb", marginTop: 10 }}>
              trường hợp chi tiền: "mua ... ở ... hết ... loại..."
            </Text>
            <Text>
              ví dụ: mua "đồ ăn" ở "siêu thị Big C" hết "500000 đồng" loại "đồ
              ăn"
            </Text>
            <Text style={{ fontFamily: "asb", marginTop: 10 }}>
              trường hợp nhận tiền: "nhận... tiền ... của ... loại..."
            </Text>
            <Text>
              ví dụ: nhận "15000000 đồng" tiền "lương tháng 6" của "công ty"
              loại "lương"
            </Text>
            <Text
              style={{
                fontFamily: "asb",
                marginTop: 10,
                color: Colors.PRIMARYA,
              }}
            >
              lưu ý: thêm chữ "đồng" ở cuối số tiền, ví dụ: ba trăm hai mươi
              ngàn "đồng"
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (recording) {
                  stopRecording();
                } else {
                  startRecording();
                }
              }}
              style={{
                width: "100%",
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: recording
                  ? Colors.PRIMARYA
                  : Colors.categories.b,
                borderRadius: 10,
                marginTop: 10,
              }}
              disabled={isLoading}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "asb",
                  color: "white",
                }}
              >
                {recording ? "dừng ghi âm" : "bắt đầu ghi âm"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginTop: 10,
                width: "100%",
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: Colors.PRIMARYA,
                borderRadius: 10,
                marginTop: 10,
              }}
              onPress={() => setmodalRecord(false)}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "asb",
                  color: "white",
                }}
              >
                Đóng
              </Text>
            </TouchableOpacity>
          </CustomModal>
          <TouchableOpacity
            style={styles.specialItem}
            onPress={() => setmodalImagePicking(true)}
          >
            <Ionicons name="camera" size={30} color={Colors.PRIMARYA} />
          </TouchableOpacity>
          <CustomModal isOpen={modalImagePicking} withInput={false}>
            <TouchableOpacity
              onPress={() => pickImage()}
              style={{
                width: 200,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: Colors.categories.b,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "asb",
                  color: "white",
                }}
              >
                Chọn ảnh
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginTop: 10,
                width: 200,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: Colors.PRIMARYA,
                borderRadius: 10,
                marginTop: 10,
              }}
              onPress={() => setmodalImagePicking(false)}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "asb",
                  color: "white",
                }}
              >
                Đóng
              </Text>
            </TouchableOpacity>
          </CustomModal>
        </View>
        <TouchableOpacity onPress={() => setImageVisible(true)}>
          <Image
            source={{ uri: previewImage ? previewImage : thumbnail }}
            style={styles.img}
          />
        </TouchableOpacity>
        <CustomModal isOpen={imageVisible} withInput={false}>
          <Image
            source={{ uri: previewImage ? previewImage : thumbnail }}
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
    display: "flex",
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    justifyContent: "space-between",
    width: "95%",
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
  categoryContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  special: {
    display: "flex",
    flexDirection: "row",
    margin: 10,
    width: "95%",
    justifyContent: "space-between",
    height: 50,
  },
  specialItem: {
    display: "flex",
    width: "49%",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 10,
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
  img: {
    width: 400,
    height: 200,
    borderRadius: 10,
  },
  imgFull: {
    width: 320,
    height: 320,
    borderRadius: 10,
  },
});
