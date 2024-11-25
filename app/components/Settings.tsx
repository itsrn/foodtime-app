import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TimeSelector from './TimeSelector'; // נייצר את זה בהמשך

interface SettingsProps {
  visible: boolean;
  onClose: () => void;
  onReset: () => void;
  waitingTimes: {
    meat: number;
    chicken: number;
  };
  onUpdateTimes: (newTimes: { meat: number; chicken: number }) => void;
}

export default function Settings({ visible, onClose, onReset, waitingTimes, onUpdateTimes }: SettingsProps) {
  const [showTimeSelector, setShowTimeSelector] = useState(false);
  const [selectedMeatType, setSelectedMeatType] = useState<'meat' | 'chicken' | null>(null);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} שעות ${mins ? `ו-${mins} דקות` : ''}`;
  };

  const handleTimeUpdate = (minutes: number) => {
    if (selectedMeatType) {
      onUpdateTimes({
        ...waitingTimes,
        [selectedMeatType]: minutes
      });
      setShowTimeSelector(false);
      setSelectedMeatType(null);
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
            <Text style={styles.title}>הגדרות</Text>
          </View>

          <View style={styles.settingsContainer}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => {
                setSelectedMeatType('meat');
                setShowTimeSelector(true);
              }}
            >
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>זמן המתנה - בקר</Text>
                <Text style={styles.settingValue}>{formatTime(waitingTimes.meat)}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-left" size={24} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => {
                setSelectedMeatType('chicken');
                setShowTimeSelector(true);
              }}
            >
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>זמן המתנה - עוף</Text>
                <Text style={styles.settingValue}>{formatTime(waitingTimes.chicken)}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-left" size={24} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.resetButton}
              onPress={onReset}
            >
              <Text style={styles.resetButtonText}>איפוס כל ההגדרות</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TimeSelector
          visible={showTimeSelector}
          onClose={() => {
            setShowTimeSelector(false);
            setSelectedMeatType(null);
          }}
          onSelect={handleTimeUpdate}
          currentValue={selectedMeatType ? waitingTimes[selectedMeatType] : 0}
          type={selectedMeatType}
        />
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
    marginRight: -30, // לקיזוז הכפתור סגירה
  },
  settingsContainer: {
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingValue: {
    fontSize: 14,
    color: '#666',
  },
  resetButton: {
    backgroundColor: '#FF4444',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  resetButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});