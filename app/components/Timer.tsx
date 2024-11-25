import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRandomNotification, NOTIFICATION_TITLES } from '../utils/notifications';

const TIMER_TASK = 'TIMER_TASK';

// הגדרת המשימה ברקע
TaskManager.defineTask(TIMER_TASK, async () => {
  try {
    const timerData = await AsyncStorage.getItem('timerData');
    if (!timerData) return BackgroundFetch.BackgroundFetchResult.NoData;

    const { endTime, type, name } = JSON.parse(timerData);
    const now = Date.now();

    if (now >= endTime) {
      const randomIndex = Math.floor(Math.random() * 5);
      await Notifications.scheduleNotificationAsync({
        content: {
          ...getRandomNotification(randomIndex),
          sound: true,
        },
        trigger: null,
      });
      await AsyncStorage.removeItem('timerData');
      return BackgroundFetch.BackgroundFetchResult.NewData;
    }

    return BackgroundFetch.BackgroundFetchResult.NoData;
  } catch (error) {
    console.error('Background task error:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

interface TimerProps {
  defaultWaitTime: number;
  type: 'meat' | 'chicken';
  onComplete: () => void;
  name: string;
}

export default function Timer({ defaultWaitTime, type, onComplete, name }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(defaultWaitTime * 60);
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    const setupTimer = async () => {
      try {
        // שמירת נתוני הטיימר
        const endTime = Date.now() + (defaultWaitTime * 60 * 1000);
        await AsyncStorage.setItem('timerData', JSON.stringify({
          endTime,
          type,
          name
        }));

        // רישום המשימה ברקע
        await BackgroundFetch.registerTaskAsync(TIMER_TASK, {
          minimumInterval: 60, // בדיקה כל דקה
          stopOnTerminate: false,
          startOnBoot: true,
        });
      } catch (error) {
        console.error('Timer setup failed:', error);
      }
    };

    setupTimer();

    return () => {
      BackgroundFetch.unregisterTaskAsync(TIMER_TASK).catch(console.error);
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      sendNotification();
      AsyncStorage.removeItem('timerData');
      onComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sendNotification = async () => {
    const randomIndex = Math.floor(Math.random() * NOTIFICATION_TITLES.length);
    await Notifications.scheduleNotificationAsync({
      content: {
        ...getRandomNotification(randomIndex),
        sound: true,
      },
      trigger: null,
    });
  };

  const cancelTimer = async () => {
    await AsyncStorage.removeItem('timerData');
    onComplete();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {type === 'meat' ? 'אכלת בקר' : 'אכלת עוף'}
      </Text>
      <Text style={styles.subtitle}>
        זמן המתנה נותר:
      </Text>
      <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
      <TouchableOpacity 
        style={styles.cancelButton}
        onPress={cancelTimer}
      >
        <Text style={styles.cancelButtonText}>ביטול טיימר</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 12,
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 20,
    color: '#666',
    marginBottom: 32,
  },
  timer: {
    fontSize: 56,
    fontWeight: '800',
    marginBottom: 40,
    color: '#4CAF50',
    fontVariant: ['tabular-nums'],
  },
  cancelButton: {
    backgroundColor: '#FF4444',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
}); 