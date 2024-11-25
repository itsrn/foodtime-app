import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface TimeSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (minutes: number) => void;
  currentValue: number;
  type: 'meat' | 'chicken' | null;
}

export default function TimeSelector({ visible, onClose, onSelect, currentValue, type }: TimeSelectorProps) {
  const [customTime, setCustomTime] = useState({ hours: '', minutes: '' });
  const [showCustomTime, setShowCustomTime] = useState(false);
  
  const presets = [
    { label: '3 שעות', minutes: 180 },
    { label: '6 שעות', minutes: 360 },
    { label: 'הגדרה מותאמת אישית', minutes: -1 }
  ];

  const handlePresetSelection = (minutes: number) => {
    if (minutes === -1) {
      setShowCustomTime(true);
    } else {
      setShowCustomTime(false);
      setCustomTime({ hours: '', minutes: '' });
      onSelect(minutes);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.title}>
              הגדרת זמן המתנה {type === 'meat' ? 'לבקר' : 'לעוף'}
            </Text>
          </View>

          <ScrollView style={styles.content}>
            {presets.map((preset) => (
              <TouchableOpacity
                key={preset.minutes}
                style={[
                  styles.presetButton,
                  (currentValue === preset.minutes || (preset.minutes === -1 && showCustomTime)) && 
                    styles.selectedPreset
                ]}
                onPress={() => handlePresetSelection(preset.minutes)}
              >
                <Text style={[
                  styles.presetText,
                  (currentValue === preset.minutes || (preset.minutes === -1 && showCustomTime)) && 
                    styles.selectedPresetText
                ]}>
                  {preset.label}
                </Text>
              </TouchableOpacity>
            ))}

            {showCustomTime && (
              <View style={styles.customTimeContainer}>
                <View style={styles.timeInputsContainer}>
                  <TextInput
                    style={styles.timeInput}
                    keyboardType="numeric"
                    placeholder="שעות"
                    placeholderTextColor="#999"
                    value={customTime.hours}
                    onChangeText={(text) => setCustomTime(prev => ({ ...prev, hours: text }))}
                  />
                  <Text style={styles.timeSeparator}>:</Text>
                  <TextInput
                    style={styles.timeInput}
                    keyboardType="numeric"
                    placeholder="דקות"
                    placeholderTextColor="#999"
                    value={customTime.minutes}
                    onChangeText={(text) => setCustomTime(prev => ({ ...prev, minutes: text }))}
                  />
                </View>
                <TouchableOpacity 
                  style={styles.submitButton}
                  onPress={() => {
                    const hours = parseInt(customTime.hours) || 0;
                    const minutes = parseInt(customTime.minutes) || 0;
                    const totalMinutes = (hours * 60) + minutes;
                    
                    if (totalMinutes > 0) {
                      onSelect(totalMinutes);
                      setShowCustomTime(false);
                      setCustomTime({ hours: '', minutes: '' });
                    }
                  }}
                >
                  <Text style={styles.submitButtonText}>אישור</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    marginTop: 100,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  closeButton: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: -30,
  },
  content: {
    padding: 20,
  },
  presetButton: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedPreset: {
    backgroundColor: '#4CAF50',
  },
  presetText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#1A1A1A',
  },
  selectedPresetText: {
    color: '#FFF',
  },
  customTimeContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  customTimeTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  timeInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeInput: {
    width: 100,
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 10,
    textAlign: 'center',
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 