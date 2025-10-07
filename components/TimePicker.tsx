import { globalStyles } from '@/styles/main';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TimePickerProps {
  onTimeSelect: (hours: number, minutes: number) => void;
  onClose: () => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ onTimeSelect, onClose }) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const handleSetTime = () => {
    onTimeSelect(hours, minutes);
    onClose();
  };

  const handleHoursChange = (value: number) => {
    setHours((prev) => (prev + value + 24) % 24); // Циклически изменяем часы от 0 до 23
  };

  const handleMinutesChange = (value: number) => {
    setMinutes((prev) => (prev + value + 60) % 60); // Циклически изменяем минуты от 0 до 59
  };

  return (
    <View style={styles.container}>
      <View style={styles.timePickerContainer}>
        <Text style={[globalStyles.sectionTitle, styles.title]}>Выберите время</Text>
        
        <View style={styles.timeContainer}>
          {/* Часы */}
          <View style={styles.timeColumn}>
            <TouchableOpacity onPress={() => handleHoursChange(1)}>
              <Text style={styles.arrow}>▲</Text>
            </TouchableOpacity>
            <Text style={styles.timeValue}>{hours.toString().padStart(2, '0')}</Text>
            <TouchableOpacity onPress={() => handleHoursChange(-1)}>
              <Text style={styles.arrow}>▼</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.separator}>:</Text>
          
          {/* Минуты */}
          <View style={styles.timeColumn}>
            <TouchableOpacity onPress={() => handleMinutesChange(1)}>
              <Text style={styles.arrow}>▲</Text>
            </TouchableOpacity>
            <Text style={styles.timeValue}>{minutes.toString().padStart(2, '0')}</Text>
            <TouchableOpacity onPress={() => handleMinutesChange(-1)}>
              <Text style={styles.arrow}>▼</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[globalStyles.buttonParent, globalStyles.startButton]} 
            onPress={handleSetTime}
          >
            <Text style={globalStyles.buttonText}>Установить</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[globalStyles.buttonParent, globalStyles.resetButton]} 
            onPress={onClose}
          >
            <Text style={globalStyles.buttonText}>Отмена</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timePickerContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    marginBottom: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  timeColumn: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  timeValue: {
    fontSize: 40,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  separator: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  arrow: {
    fontSize: 24,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default TimePicker;