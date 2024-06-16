import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { Colors } from "../../constants/Colors";

const ProgressBar = ({ budget, progress }) => {
  const [perc, setPerc] = useState(0);

  useEffect(() => {
    setPerc((progress / budget) * 100);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text>{progress}đ</Text>
        <Text style={styles.progressText}>Tiến độ</Text>
        <Text>{budget}đ</Text>
      </View>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progress,
            { width: perc + "%", backgroundColor: "#fcba03" },
          ]}
        ></View>
      </View>
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  progressBar: {
    display: "flex",
    width: "100%",
    backgroundColor: Colors.GRAY,
    height: 20,
    borderRadius: 10,
  },
  progress: {
    display: "flex",
    height: 20,
    borderRadius: 10,
  },
  textContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  progressText: {
    fontFamily: "asb",
    fontSize: 16,
  },
});
