import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from './components/Onboarding';
import Timer from './components/Timer';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Settings from './components/Settings';

interface UserData {
  name: string;
  waitingTimes: {
    meat: number;
    chicken: number;
  };
}

export default function Index() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTimer, setActiveTimer] = useState<'meat' | 'chicken' | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        setUserData(JSON.parse(data));
      }
      setIsLoading(false);
    } catch (error) {
      console.error('שגיאה בטעינת נתוני משתמש:', error);
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    loadUserData();
  };

  const startTimer = (type: 'meat' | 'chicken') => {
    setActiveTimer(type);
    // שמירת זמן התחלה
    const startTime = new Date().getTime();
    AsyncStorage.setItem('timerData', JSON.stringify({
      type,
      startTime,
      duration: type === 'meat' ? userData?.waitingTimes.meat : userData?.waitingTimes.chicken
    }));
  };

  const resetApp = async () => {
    Alert.alert(
      "איפוס הגדרות",
      "האם את/ה בטוח/ה שברצונך לאפס את כל ההגדרות ולהתחיל מחדש?",
      [
        {
          text: "ביטול",
          style: "cancel"
        },
        {
          text: "כן, אפס הכל",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              setUserData(null);
              setActiveTimer(null);
            } catch (error) {
              console.error('שגיאה באיפוס הגדרות:', error);
            }
          }
        }
      ]
    );
  };

  const handleUpdateTimes = async (newTimes: { meat: number; chicken: number }) => {
    const updatedUserData = {
      ...userData!,
      waitingTimes: newTimes
    };
    
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
      setUserData(updatedUserData);
    } catch (error) {
      console.error('שגיאה בעדכון זמני המתנה:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>טוען...</Text>
      </View>
    );
  }

  if (!userData) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {!activeTimer ? (
        <>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => setShowSettings(true)}
            >
              <MaterialCommunityIcons 
                name="cog" 
                size={24} 
                color="#666"
              />
            </TouchableOpacity>
            <Text style={styles.greeting}>שלום, {userData?.name}! 👋</Text>
          </View>
          <Text style={styles.question}>מה אכלת היום?</Text>
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.foodButton}
              onPress={() => startTimer('chicken')}
            >
              <MaterialCommunityIcons 
                name="food-drumstick" 
                size={48} 
                color="#e67e22"
              />
              <Text style={styles.foodTitle}>עוף</Text>
              <Text style={styles.foodSubtitle}>שניצל וחבריו 🍗</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.foodButton}
              onPress={() => startTimer('meat')}
            >
              <MaterialCommunityIcons 
                name="food-steak" 
                size={48} 
                color="#c0392b"
              />
              <Text style={styles.foodTitle}>בקר</Text>
              <Text style={styles.foodSubtitle}>סטייק או בשר אדום אחר 🥩</Text>
            </TouchableOpacity>
          </View>
          
          <Settings
            visible={showSettings}
            onClose={() => setShowSettings(false)}
            onReset={resetApp}
            waitingTimes={userData?.waitingTimes || { meat: 360, chicken: 180 }}
            onUpdateTimes={handleUpdateTimes}
          />
        </>
      ) : (
        <Timer
          name={userData.name}
          defaultWaitTime={
            activeTimer === 'meat'
              ? userData.waitingTimes.meat
              : userData.waitingTimes.chicken
          }
          type={activeTimer}
          onComplete={() => setActiveTimer(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 60,
    marginBottom: 20,
    paddingHorizontal: 24,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '800',
    flex: 1,
    textAlign: 'right',
    color: '#1A1A1A',
  },
  settingsButton: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  question: {
    fontSize: 22,
    color: '#666',
    textAlign: 'right',
    marginBottom: 40,
    paddingHorizontal: 24,
  },
  buttonsContainer: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 24,
  },
  foodButton: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  foodTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 16,
    marginBottom: 8,
    color: '#1A1A1A',
  },
  foodSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});
