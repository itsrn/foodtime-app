import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface WaitingTimes {
  meat: number;
  chicken: number;
}

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [name, setName] = useState("");
  const [step, setStep] = useState(1);
  const [waitingTimes, setWaitingTimes] = useState<WaitingTimes>({
    meat: 0,
    chicken: 0,
  });
  const [customTime, setCustomTime] = useState({ hours: "", minutes: "" });
  const [currentMeatType, setCurrentMeatType] = useState<"meat" | "chicken">(
    "meat"
  );

  const presets = [
    { label: "3 שעות", minutes: 180 },
    { label: "6 שעות", minutes: 360 },
    { label: "הגדרה מותאמת אישית", minutes: -1 },
  ];

  const handleTimeSelection = (minutes: number) => {
    if (minutes === -1) {
      setStep(currentMeatType === "meat" ? 3 : 5);
    } else {
      setWaitingTimes((prev) => ({ ...prev, [currentMeatType]: minutes }));
      if (currentMeatType === "meat") {
        setCurrentMeatType("chicken");
        setStep(4);
      } else {
        setStep(6);
      }
    }
  };

  const saveUserData = async () => {
    try {
      await AsyncStorage.setItem(
        "userData",
        JSON.stringify({
          name,
          waitingTimes,
        })
      );
      onComplete();
    } catch (error) {
      console.error("שגיאה בשמירת נתוני משתמש:", error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>ברוכים הבאים!</Text>
            <Text style={styles.subtitle}>איך נוכל לקרוא לך?</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="השם שלך"
              textAlign="right"
            />
            <TouchableOpacity
              style={[styles.button, !name && styles.buttonDisabled]}
              onPress={() => setStep(2)}
              disabled={!name}
            >
              <Text style={styles.buttonText}>הבא</Text>
            </TouchableOpacity>
          </View>
        );

      case 2:
        return (
          <ScrollView contentContainerStyle={styles.stepContainer}>
            <MaterialCommunityIcons
              name="food-steak"
              size={48}
              color="#c0392b"
            />
            <Text style={styles.title}>כמה זמן את/ה ממתין/ה?</Text>
            <Text style={styles.subtitle}>
              בין <Text style={{ fontWeight: "700" }}>בקר</Text> לחלב
            </Text>

            {presets.map((preset) => (
              <TouchableOpacity
                key={preset.minutes}
                style={[
                  styles.presetButton,
                  waitingTimes[currentMeatType] === preset.minutes &&
                    styles.selectedPreset,
                ]}
                onPress={() => handleTimeSelection(preset.minutes)}
              >
                <Text
                  style={[
                    styles.presetText,
                    waitingTimes[currentMeatType] === preset.minutes &&
                      styles.selectedPresetText,
                  ]}
                >
                  {preset.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>הגדרת זמן המתנה לבקר</Text>
            <View style={styles.customTimeContainer}>
              <TextInput
                style={styles.timeInput}
                keyboardType="numeric"
                placeholder="שעות"
                placeholderTextColor="#999"
                value={customTime.hours}
                onChangeText={(text) =>
                  setCustomTime((prev) => ({ ...prev, hours: text }))
                }
              />
              <Text style={styles.timeLabel}>:</Text>
              <TextInput
                style={styles.timeInput}
                keyboardType="numeric"
                placeholder="דקות"
                placeholderTextColor="#999"
                value={customTime.minutes}
                onChangeText={(text) =>
                  setCustomTime((prev) => ({ ...prev, minutes: text }))
                }
              />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                const totalMinutes =
                  parseInt(customTime.hours) * 60 +
                  parseInt(customTime.minutes);
                setWaitingTimes((prev) => ({ ...prev, meat: totalMinutes }));
                setCurrentMeatType("chicken");
                setCustomTime({ hours: "", minutes: "" });
                setStep(4);
              }}
            >
              <Text style={styles.buttonText}>אישור</Text>
            </TouchableOpacity>
          </View>
        );

      case 4:
        return (
          <ScrollView contentContainerStyle={styles.stepContainer}>
            <MaterialCommunityIcons
              name="food-drumstick"
              size={48}
              color="#e67e22"
            />
            <Text style={styles.title}>כמה זמן את/ה ממתין/ה?</Text>
            <Text style={styles.subtitle}>
              בין <Text style={{ fontWeight: "700" }}>עוף</Text> לחלב
            </Text>

            {presets.map((preset) => (
              <TouchableOpacity
                key={preset.minutes}
                style={[
                  styles.presetButton,
                  waitingTimes.chicken === preset.minutes &&
                    styles.selectedPreset,
                ]}
                onPress={() => handleTimeSelection(preset.minutes)}
              >
                <Text style={styles.presetText}>{preset.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );

      case 5:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>הגדרת זמן המתנה לעוף</Text>
            <View style={styles.customTimeContainer}>
              <TextInput
                style={styles.timeInput}
                keyboardType="numeric"
                placeholder="שעות"
                placeholderTextColor="#999"
                value={customTime.hours}
                onChangeText={(text) =>
                  setCustomTime((prev) => ({ ...prev, hours: text }))
                }
              />
              <Text style={styles.timeLabel}>:</Text>
              <TextInput
                style={styles.timeInput}
                keyboardType="numeric"
                placeholder="דקות"
                placeholderTextColor="#999"
                value={customTime.minutes}
                onChangeText={(text) =>
                  setCustomTime((prev) => ({ ...prev, minutes: text }))
                }
              />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                const totalMinutes =
                  parseInt(customTime.hours) * 60 +
                  parseInt(customTime.minutes);
                setWaitingTimes((prev) => ({ ...prev, chicken: totalMinutes }));
                setStep(6);
              }}
            >
              <Text style={styles.buttonText}>אישור</Text>
            </TouchableOpacity>
          </View>
        );

      case 6:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>מעולה! סיימנו!</Text>
            <Text style={styles.subtitle}>הכל מוכן, {name}!</Text>
            <TouchableOpacity style={styles.button} onPress={saveUserData}>
              <Text style={styles.buttonText}>התחל להשתמש באפליקציה</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return <View style={styles.container}>{renderStep()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  stepContainer: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 16,
    textAlign: "center",
    color: "#1A1A1A",
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 40,
    color: "#666",
    textAlign: "center",
    lineHeight: 28,
  },
  input: {
    width: "100%",
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#FFF",
    marginBottom: 24,
    fontSize: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 20,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  presetButton: {
    width: "100%",
    padding: 24,
    borderRadius: 16,
    backgroundColor: "#FFF",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedPreset: {
    backgroundColor: "#4CAF50",
  },
  presetText: {
    fontSize: 18,
    textAlign: "center",
    color: "#1A1A1A",
  },
  selectedPresetText: {
    color: "#FFF",
  },
  customTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  timeInput: {
    width: 100,
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#FFF',
    marginHorizontal: 10,
    textAlign: 'center',
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#1A1A1A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timeLabel: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
});
