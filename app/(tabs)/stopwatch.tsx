import { ThemedView } from '@/components/themed-view';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function StopwatchScreen() {
  // Stopwatch state variables
  const [time, setTime] = useState(0); // Time in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate formatted time
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  // Start the stopwatch
  const startStopwatch = () => {
    if (!isRunning) {
      setIsRunning(true);
      const startTime = Date.now() - time;
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10); // Update every 10ms for smoother display
    }
  };

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
    setLaps([]);
  };

  // Record a lap time
  const recordLap = () => {
    if (isRunning) {
      setLaps([...laps, time]);
    }
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
      <View style={styles.stopwatchSection}>
        <Text style={styles.timeText}>{formatTime(time)}</Text>
        
        <View style={styles.buttonContainer}>
          {!isRunning ? (
            <TouchableOpacity style={styles.startButton} onPress={startStopwatch}>
              <Text style={styles.buttonText}>СТАРТ</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.stopButton} onPress={stopStopwatch}>
              <Text style={styles.buttonText}>СТОП</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.resetButton} 
            onPress={isRunning ? recordLap : resetStopwatch}
          >
            <Text style={styles.buttonText}>
              {isRunning ? 'LAP' : 'RESET'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {laps.length > 0 && (
        <View style={styles.lapsSection}>
          <Text style={styles.sectionTitle}>Laps</Text>
          <ScrollView style={styles.lapsList}>
            {laps.map((lapTime, index) => (
              <View key={index} style={styles.lapItem}>
                <Text style={styles.lapNumber}>Lap {laps.length - index}</Text>
                <Text style={styles.lapTime}>{formatTime(lapTime)}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
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
  stopwatchSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 60,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#333',
    marginBottom: 50,
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
