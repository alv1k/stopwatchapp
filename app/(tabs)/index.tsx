import Spinner from '@/components/Spinner';
import { ThemedView } from '@/components/themed-view';
import { globalStyles } from '@/styles/main';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';

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
  const startCountdown = useCallback(() => {
    if (!isRunning) {
      // Calculate total time from spinner values
      const totalTimeMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
      
      // Only start if there's time to count down
      if (totalTimeMs > 0) {
        setIsRunning(true);
        // Set initial time left based on spinner values
        setTimeLeft(totalTimeMs);
        const endTime = Date.now() + totalTimeMs;
        intervalRef.current = setInterval(() => {
          const remaining = Math.max(0, endTime - Date.now());
          setTimeLeft(remaining);
          
          // Stop when time is up
          if (remaining <= 0) {
            stopCountdown();
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
    };
  }, []);

  return (
    <ThemedView style={globalStyles.container}>
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


