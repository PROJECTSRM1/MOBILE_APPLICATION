import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

export default function PremiumFreelancerFlow() {
  const [step, setStep] = useState(1);
  const steps = [
    "Travel Details",
    "Equipment",
    "Pre-Service Photos",
    "Service Start",
    "After-Service Photos",
    "Payment",
  ];

  const progress = (step - 1) / (steps.length - 1) * width * 0.9;

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f6fa" }}>
      {/* Sticky Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{steps[step - 1]}</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: progress }]} />
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Step Card */}
        {step === 1 && (
          <View style={styles.card}>
            <Text style={styles.label}>From Location</Text>
            <TextInput placeholder="Auto-detected" style={styles.input} />
            <Text style={styles.label}>To (Customer Address)</Text>
            <TextInput placeholder="Customer Address" style={styles.input} />

            <TouchableOpacity
              style={styles.btn}
              onPress={() => setStep(2)}
            >
              <Text style={styles.btnText}>Start Navigation</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View style={styles.card}>
            <Text style={styles.label}>Equipment Responsibility</Text>
            <View style={styles.row}>
              <TouchableOpacity style={styles.optionBtn}>
                <Text style={styles.optionText}>Customer Provides</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionBtn}>
                <Text style={styles.optionText}>Freelancer Provides</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.btn}
              onPress={() => setStep(3)}
            >
              <Text style={styles.btnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 3 && (
          <View style={styles.card}>
            <Text style={styles.label}>Pre-Service Photos</Text>
            <TouchableOpacity style={styles.photoUpload}>
              <Text style={styles.photoText}>+ Upload Photos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btn}
              onPress={() => setStep(4)}
            >
              <Text style={styles.btnText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 4 && (
          <View style={styles.card}>
            <Text style={styles.label}>Start Cleaning Service</Text>
            <Text style={styles.description}>Checklist will appear here</Text>

            <TouchableOpacity
              style={styles.btn}
              onPress={() => setStep(5)}
            >
              <Text style={styles.btnText}>Finish Service</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 5 && (
          <View style={styles.card}>
            <Text style={styles.label}>Upload After Clean Photos</Text>
            <TouchableOpacity style={styles.photoUpload}>
              <Text style={styles.photoText}>+ Upload Photos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btn}
              onPress={() => setStep(6)}
            >
              <Text style={styles.btnText}>Proceed to Payment</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 6 && (
          <View style={styles.card}>
            <Text style={styles.label}>Payment Confirmation</Text>
            <View style={styles.row}>
              <TouchableOpacity style={styles.optionBtn}>
                <Text style={styles.optionText}>Online</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionBtn}>
                <Text style={styles.optionText}>Offline</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.btn}>
              <Text style={styles.btnText}>Mark as Paid</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#333" },
  progressBarContainer: {
    backgroundColor: "#eee",
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    width: "90%",
  },
  progressBarFill: {
    backgroundColor: "#5a3fe0",
    height: 6,
    borderRadius: 3,
  },
  scrollContent: { padding: 20, paddingBottom: 40 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  label: { marginTop: 12, fontWeight: "600", color: "#555", fontSize: 14 },
  input: {
    backgroundColor: "#f7f7f7",
    padding: 14,
    borderRadius: 12,
    marginTop: 6,
    fontSize: 14,
  },
  row: { flexDirection: "row", marginTop: 12 },
  optionBtn: {
    flex: 1,
    padding: 14,
    backgroundColor: "#f3f0ff",
    alignItems: "center",
    borderRadius: 12,
    marginRight: 10,
    shadowColor: "#5a3fe0",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  optionText: { fontWeight: "600", color: "#5a3fe0" },
  btn: {
    backgroundColor: "#5a3fe0",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#5a3fe0",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  photoUpload: {
    backgroundColor: "#f0f0f5",
    padding: 35,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 12,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#ccc",
  },
  photoText: { color: "#666", fontWeight: "600" },
  description: { color: "#777", marginVertical: 12 },
});
                                                                            