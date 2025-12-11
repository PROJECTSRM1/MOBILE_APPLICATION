import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";

export default function PremiumFreelancerFlow() {
  const [step, setStep] = useState(1);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Freelancer Workflow</Text>
        <Text style={styles.headerSub}>Premium Mobile Experience</Text>
      </View>

      {/* Step Indicator */}
      <View style={styles.stepper}>
        {[1, 2, 3, 4, 5, 6].map((s) => (
          <View key={s} style={[styles.stepDot, step === s && styles.activeDot]} />
        ))}
      </View>

      {/* Dynamic Content */}
      {step === 1 && (
        <View style={styles.card}>
          <Text style={styles.title}>Confirm Travel Details</Text>
          <Text style={styles.label}>From Location</Text>
          <TextInput placeholder="Auto-detected" style={styles.input} />
          <Text style={styles.label}>To (Customer Address)</Text>
          <TextInput placeholder="Customer Address" style={styles.input} />

          <TouchableOpacity style={styles.btn} onPress={() => setStep(2)}>
            <Text style={styles.btnText}>Start Navigation</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && (
        <View style={styles.card}>
          <Text style={styles.title}>Equipment Responsibility</Text>
          <View style={styles.row}>
            <TouchableOpacity style={styles.optionBtn}>
              <Text>Customer Provides</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionBtn}>
              <Text>Freelancer Provides</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.btn} onPress={() => setStep(3)}>
            <Text style={styles.btnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 3 && (
        <View style={styles.card}>
          <Text style={styles.title}>Pre-Service Photos</Text>
          <TouchableOpacity style={styles.photoUpload}>
            <Text style={styles.photoText}>Upload Photos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={() => setStep(4)}>
            <Text style={styles.btnText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 4 && (
        <View style={styles.card}>
          <Text style={styles.title}>Start Cleaning Service</Text>
          <Text style={styles.description}>Checklist will appear here</Text>

          <TouchableOpacity style={styles.btn} onPress={() => setStep(5)}>
            <Text style={styles.btnText}>Finish Service</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 5 && (
        <View style={styles.card}>
          <Text style={styles.title}>Upload After Clean Photos</Text>
          <TouchableOpacity style={styles.photoUpload}>
            <Text style={styles.photoText}>Upload Photos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={() => setStep(6)}>
            <Text style={styles.btnText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 6 && (
        <View style={styles.card}>
          <Text style={styles.title}>Payment Confirmation</Text>

          <View style={styles.row}>
            <TouchableOpacity style={styles.optionBtn}>
              <Text>Online</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionBtn}>
              <Text>Offline</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>Mark as Paid</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f8f9fc" },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#111" },
  headerSub: { color: "#555", marginTop: 4 },

  stepper: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: "#ddd",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#5a3fe0",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  label: { marginTop: 10, fontWeight: "600", color: "#444" },
  input: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
  },
  row: { flexDirection: "row", marginTop: 10 },
  optionBtn: {
    flex: 1,
    padding: 12,
    backgroundColor: "#f1f1ff",
    alignItems: "center",
    borderRadius: 10,
    marginRight: 10,
  },
  btn: {
    backgroundColor: "#5a3fe0",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  btnText: { color: "#fff", fontWeight: "700" },
  photoUpload: {
    backgroundColor: "#f0f0f0",
    padding: 30,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  photoText: { color: "#444" },
  description: { color: "#777", marginVertical: 10 },
});
