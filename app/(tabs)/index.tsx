import Spinner from '@/components/Spinner';
import { ThemedView } from '@/components/themed-view';
import { globalStyles } from '@/styles/main';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';

// Conditionally import Audio to handle cases where it's not available
let Audio: any = null;
let AudioUnloaded: any = null;

try {
  const expoAv = require('expo-av');
  Audio = expoAv.Audio;
  AudioUnloaded = expoAv.Audio;
} catch (error) {
  console.log('expo-av not available, sound functionality will be disabled');
}

export default function CountdownScreen() {

  const screenHeight = useWindowDimensions().height;

  // Countdown state variables
  const [timeLeft, setTimeLeft] = useState(0); // Time left in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Values for setting countdown time
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  
  // State for alarm when timer completes
  const [alarmActive, setAlarmActive] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  
  // Animation values for visual tap indicator
  const animatedFontSize = useRef(new Animated.Value(24)).current;
  const animatedColor = useRef(new Animated.Value(0)).current; // 0 = white, 1 = red
  const animatedScale = useRef(new Animated.Value(1)).current;

  // Stop the alarm sound when user interacts
  const stopAlarm = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync(); // Clean up resources
        soundRef.current = null;
      } catch (error) {
        console.log('Error stopping sound:', error);
      }
    }
    setAlarmActive(false);
  }, []);

  // Create PanResponder for detecting screen taps when alarm is active
  const tapResponder = React.useMemo(() => 
    PanResponder.create({
      onStartShouldSetPanResponder: () => alarmActive,
      onPanResponderRelease: (evt, gestureState) => {
        if (alarmActive) {
          stopAlarm();
        }
      },
      onPanResponderTerminate: (evt, gestureState) => {
        if (alarmActive) {
          stopAlarm();
        }
      },
    })
  , [alarmActive, stopAlarm]);

  // Calculate formatted time for display
  const formatTime = useCallback((milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);

    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }, []);

  // Обновляем timeLeft при изменении значений спиннеров, но только если таймер не запущен
  useEffect(() => {
    if (!isRunning) {
      const totalTimeMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
      setTimeLeft(totalTimeMs);
    }
  }, [hours, minutes, seconds, isRunning]);

  // Check if minutes should auto-increment
  const handleHoursReachedMax = useCallback(() => {
    setMinutes(prev => {
      if (prev < 59) {
        return prev + 1;
      }
      return prev;
    });
  }, []);

  const handleHoursReachedMin = useCallback(() => {
    setMinutes(prev => {
      if (prev > 0) {
        return prev - 1;
      }
      return prev;
    });
  }, []);

  const handleMinutesReachedMax = useCallback(() => {
    setHours(prevHours => {
      if (prevHours < 23) {
        return prevHours + 1;
      }
      return prevHours;
    });
    
    // Also increment seconds if hours are at max
    setHours(currentHours => {
      if (currentHours === 23) {
        setSeconds(prevSeconds => {
          if (prevSeconds < 59) {
            return prevSeconds + 1;
          }
          return prevSeconds;
        });
      }
      return currentHours; // Не меняем часы, просто выполняем побочный эффект
    });
  }, []);

  const handleMinutesReachedMin = useCallback(() => {
    setHours(prevHours => {
      if (prevHours > 0) {
        return prevHours - 1;
      }
      return prevHours;
    });
    
    // Also decrement seconds if hours are at min
    setHours(currentHours => {
      if (currentHours === 0) {
        setSeconds(prevSeconds => {
          if (prevSeconds > 0) {
            return prevSeconds - 1;
          }
          return prevSeconds;
        });
      }
      return currentHours; // Не меняем часы, просто выполняем побочный эффект
    });
  }, []);

  // Start the countdown
  const startCountdown = useCallback(async () => {
    if (!isRunning) {
      // Calculate total time from spinner values
      const totalTimeMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
      
      // Only start if there's time to count down
      if (totalTimeMs > 0) {
        setIsRunning(true);
        // Set initial time left based on spinner values
        setTimeLeft(totalTimeMs);
        const endTime = Date.now() + totalTimeMs;
        intervalRef.current = setInterval(async () => {
          const remaining = Math.max(0, endTime - Date.now());
          setTimeLeft(remaining);
          
          // Stop when time is up
          if (remaining <= 0) {
            stopCountdown();
            setHours(0);
            setMinutes(0);
            setSeconds(0);
            setTimeLeft(0);
            setIsRunning(false);
            
            // Play sound and haptic feedback when timer completes
            // Trigger haptic feedback which will work regardless
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            
            // Only try to play sound if Audio module is available
            if (Audio) {
              try {
                // Set minimal audio mode to ensure the sound plays
                await Audio.setAudioModeAsync({
                  allowsRecordingIOS: false,
                  playsInSilentModeIOS: true, // Allow sound to play even if phone is on silent
                  shouldDuckAndroid: false,
                  playThroughEarpieceAndroid: false,
                });
                
                // Load the sound file
                const { sound } = await Audio.Sound.createAsync(
                  require('../../assets/sounds/alarm_sound.mp3') // Replace with your own sound file
                );
                
                // Store sound reference for later use
                soundRef.current = sound;
                
                // Play the sound and set looping
                await sound.playAsync();
                await sound.setIsLoopingAsync(true); // This will loop continuously
                
                // Set alarm state to active
                setAlarmActive(true);
                
                console.log('Sound played successfully and is looping');
              } catch (error) {
                console.log('Error playing sound:', error);
                console.log('Make sure alarm_sound.mp3 is a valid MP3 file in assets/sounds folder');
                console.log('Timer completed!');
              }
            } else {
              console.log('Audio module not available - only haptic feedback will work');
              console.log('Timer completed!');
            }
          }
        }, 10); // Update every 10ms for smoother display
      }
    }
  }, [isRunning, hours, minutes, seconds]);

  // Stop the countdown
  const stopCountdown = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
  }, []);

  // Reset the countdown
  const resetCountdown = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setTimeLeft(0);
    setIsRunning(false);
  }, []);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Stop and unload sound if still playing
      if (soundRef.current) {
        soundRef.current.stopAsync()
          .then(() => soundRef.current?.unloadAsync())
          .catch(error => console.log('Error unloading sound on unmount:', error));
      }
    };
  }, []);

  // Animation effect for alarm indicator
  useEffect(() => {
    if (alarmActive) {
      // Start pulsing animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(animatedScale, {
              toValue: 1.2,
              duration: 1000,
              useNativeDriver: false,
            }),
            Animated.timing(animatedFontSize, {
              toValue: 36,
              duration: 1000,
              useNativeDriver: false,
            }),
            Animated.timing(animatedColor, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: false,
            }),
          ]),
          Animated.parallel([
            Animated.timing(animatedScale, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: false,
            }),
            Animated.timing(animatedFontSize, {
              toValue: 24,
              duration: 1000,
              useNativeDriver: false,
            }),
            Animated.timing(animatedColor, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: false,
            }),
          ]),
        ])
      );

      pulseAnimation.start();

      // Clean up animation on unmount or when alarm stops
      return () => {
        pulseAnimation.stop();
        animatedScale.setValue(1);
        animatedFontSize.setValue(24);
        animatedColor.setValue(0);
      };
    } else {
      // Reset animation values when alarm is not active
      Animated.parallel([
        Animated.timing(animatedScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(animatedFontSize, {
          toValue: 24,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(animatedColor, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [alarmActive]);

  return (
    <ThemedView 
      style={globalStyles.container} 
      {...tapResponder.panHandlers}
    >
      {/* Visual indicator overlay when alarm is active */}
      {alarmActive && (
        <View 
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >          
          {/* Additional visual indicator - pulsing circle */}
          <Animated.View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              borderWidth: 3,
              borderColor: animatedColor.interpolate({
                inputRange: [0, 1],
                outputRange: ['white', '#ff6b6b'] // from white to light red
              }),
              marginTop: 20,
              transform: [{ scale: animatedScale }],
            }}
          />
        </View>
      )}
      
      <View style={globalStyles.section}>

        {/* <View style={styles.quickSetContainer}>
          <TouchableOpacity 
            style={styles.quickSetButton}
            onPress={() => { setHours(0);setMinutes(5); setSeconds(0); }}
          >
            <Text style={styles.buttonText}>5 МИН</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickSetButton}
            onPress={() => { setHours(0); setMinutes(10); setSeconds(0); }}
          >
            <Text style={styles.buttonText}>10 МИН</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickSetButton}
            onPress={() => { setHours(0); setMinutes(15); setSeconds(0); }}
          >
            <Text style={styles.buttonText}>15 МИН</Text>
          </TouchableOpacity>
        </View> */}

        <View style={{
          gap: 10,
          marginTop: -screenHeight / 8,
        }}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent:'center', 
            alignItems: 'center',
          }}>
            <Spinner
              value={hours}
              onValueChange={setHours}
              maxValue={23}
              label="ЧАСЫ"
              onReachedMax={handleHoursReachedMax}
              onReachedMin={handleHoursReachedMin}
            />
            <Text style={[globalStyles.separatorText]} selectable={false}>:</Text>
            <Spinner
              value={minutes}
              onValueChange={setMinutes}
              maxValue={59}
              label="МИН"
              onReachedMax={handleMinutesReachedMax}
              onReachedMin={handleMinutesReachedMin}
            />
            <Text style={[globalStyles.separatorText]} selectable={false}>:</Text>
            <Spinner
              value={seconds}
              onValueChange={setSeconds}
              maxValue={59}
              label="СЕК"
            />
          </View>
          
          <View style={globalStyles.buttonContainer}>
            {!isRunning ? (
              <TouchableOpacity 
                style={[globalStyles.startButton, globalStyles.buttonParent]}
                onPress={startCountdown}
              >
                <Text style={globalStyles.buttonText}>СТАРТ</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[globalStyles.stopButton, globalStyles.buttonParent]} onPress={stopCountdown}>
                <Text style={globalStyles.buttonText}>СТОП</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[globalStyles.resetButton, globalStyles.buttonParent]} 
              onPress={resetCountdown}
            >
              <Text style={globalStyles.buttonText}>
                СБРОС
              </Text>
            </TouchableOpacity>
          </View>

        </View>
        
        <Text style={globalStyles.timeText}>{formatTime(timeLeft)}</Text>

      </View>

      
    </ThemedView>
  );
}


