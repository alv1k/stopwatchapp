import { ThemedView } from '@/components/themed-view';
import { globalStyles } from '@/styles/main';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

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
    <ThemedView style={globalStyles.container}>
      <View style={globalStyles.section}>
        <Text style={globalStyles.stopwatchTimeText}>{formatTime(time)}</Text>
        
        <View style={globalStyles.buttonContainer}>
          {!isRunning ? (
            <TouchableOpacity style={[globalStyles.startButton, globalStyles.buttonParent]} onPress={startStopwatch}>
              <Text style={globalStyles.buttonText}>СТАРТ</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[globalStyles.stopButton, globalStyles.buttonParent]} onPress={stopStopwatch}>
              <Text style={globalStyles.buttonText}>СТОП</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[globalStyles.resetButton, globalStyles.buttonParent]} 
            onPress={isRunning ? recordLap : resetStopwatch}
          >
            <Text style={globalStyles.buttonText}>
              {isRunning ? 'LAP' : 'RESET'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {laps.length > 0 && (
        <View style={globalStyles.lapsSection}>
          <Text style={globalStyles.sectionTitle}>Laps</Text>
          <ScrollView style={globalStyles.lapsList}>
            {laps.map((lapTime, index) => (
              <View key={index} style={globalStyles.lapItem}>
                <Text style={globalStyles.lapNumber}>Lap {laps.length - index}</Text>
                <Text style={globalStyles.lapTime}>{formatTime(lapTime)}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </ThemedView>
  );
}


