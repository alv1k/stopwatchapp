import Spinner from '@/components/Spinner';
import { ThemedView } from '@/components/themed-view';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CountdownScreen() {
  // Countdown state variables
  const [timeLeft, setTimeLeft] = useState(0); // Time left in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Values for setting countdown time
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // Refs for spinner navigation
  const minutesRef = useRef(null);
  const secondsRef = useRef(null);

  // Calculate formatted time for display
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);

    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  // Check if minutes should auto-increment
  const handleHoursReachedMax = () => {
    if (minutes < 59) {
      setMinutes(prev => prev + 1);
    }
  };

  const handleHoursReachedMin = () => {
    if (minutes > 0) {
      setMinutes(prev => prev - 1);
    }
  };

  const handleMinutesReachedMax = () => {
    if (hours < 23) {
      setHours(prev => prev + 1);
    } else if (seconds < 59) {
      setSeconds(prev => prev + 1);
    }
  };

  const handleMinutesReachedMin = () => {
    if (hours > 0) {
      setHours(prev => prev - 1);
    } else if (seconds > 0) {
      setSeconds(prev => prev - 1);
    }
  };

  // Start the countdown
  const startCountdown = () => {
    if (!isRunning) {
      // Calculate total time from spinner values
      const totalTimeMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
      
      // Only start if there's time to count down
      if (totalTimeMs > 0) {
        setIsRunning(true);
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
  };

  // Stop the countdown
  const stopCountdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
  };

  // Reset the countdown
  const resetCountdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTimeLeft(0);
    setIsRunning(false);
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Stop the stopwatch
  const stopStopwatch = () => {
    if (isRunning && intervalRef.current) {
      setIsRunning(false);
      clearInterval(intervalRef.current);
    }
  };

  // Reset the stopwatch
  const resetStopwatch = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTime(0);
    setIsRunning(false);
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.countdownSection}>        
        <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
        
        <View style={{ flexDirection: 'row', justifyContent:'center', alignItems: 'center', marginBottom: 30 }}>
          <Spinner
            value={hours}
            onValueChange={setHours}
            maxValue={23}
            label="ЧАСЫ"
            onReachedMax={handleHoursReachedMax}
            onReachedMin={handleHoursReachedMin}
          />
          <Text style={[styles.separatorText]}>:</Text>
          <Spinner
            value={minutes}
            onValueChange={setMinutes}
            maxValue={59}
            label="МИН"
            onReachedMax={handleMinutesReachedMax}
            onReachedMin={handleMinutesReachedMin}
          />
          <Text style={[styles.separatorText]}>:</Text>
          <Spinner
            value={seconds}
            onValueChange={setSeconds}
            maxValue={59}
            label="СЕК"
          />
        </View>

        <View style={styles.quickSetContainer}>
          <TouchableOpacity 
            style={styles.quickSetButton}
            onPress={() => { setMinutes(5); setSeconds(0); }}
          >
            <Text style={styles.buttonText}>5 МИН</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickSetButton}
            onPress={() => { setMinutes(10); setSeconds(0); }}
          >
            <Text style={styles.buttonText}>10 МИН</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickSetButton}
            onPress={() => { setMinutes(15); setSeconds(0); }}
          >
            <Text style={styles.buttonText}>15 МИН</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.buttonContainer}>
          {!isRunning ? (
            <TouchableOpacity 
              style={styles.startButton}
              onPress={startCountdown}
            >
              <Text style={styles.buttonText}>СТАРТ</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.stopButton} onPress={stopCountdown}>
              <Text style={styles.buttonText}>СТОП</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.resetButton} 
            onPress={resetCountdown}
          >
            <Text style={styles.buttonText}>
              {isRunning ? 'LAP' : 'RESET'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#f5f5f5',
  },
  countdownSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 50,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#333',
    marginBottom: 50,
  },
  separatorText: {
    fontSize: 50,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#333',
    marginBottom: 50,
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    minWidth: 100,
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#f44336',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    minWidth: 100,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#9E9E9E',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    minWidth: 100,
    alignItems: 'center',
  },
  setTimeContainer: {
    backgroundColor: 'yellow',
    padding: 30
  },
  setTimeButton: {
    backgroundColor: '#c09317ff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    minWidth: 100,
    alignItems: 'center',
  },
  quickSetContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickSetButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    minWidth: 70,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  lapsSection: {
    flex: 1,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  lapsList: {
    flex: 1,
  },
  lapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  lapNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  lapTime: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#333',
  },
});
