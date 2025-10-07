import Modal from '@/app/modal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { globalStyles } from '@/styles/main';
import React, { useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

export default function AlarmTab() {
    // Define initial alarms with individual states
    const [alarms, setAlarms] = useState([
        { id: 1, time: '8:43', description: 'описание будильника', enabled: false },
        { id: 2, time: '8:53', description: 'описание будильника', enabled: false },
    ]);
    const [modalVisible, setModalVisible] = useState(false); 

    const toggleAlarm = (id: number) => {
        setAlarms(alarms.map(alarm => 
            alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
        ));
    };   
        
    const handleAddAlarm = () => {
        setModalVisible(true);
    }

    const closeModal = () => {
        setModalVisible(false);
    }

    const handleTimeSelect = (hours: number, minutes: number) => {
        // Добавляем новый будильник с выбранным временем
        const newAlarm = {
            id: Date.now(), // используем timestamp как уникальный id
            time: `${hours}:${minutes.toString().padStart(2, '0')}`,
            description: 'новый будильник',
            enabled: true,
        };
        setAlarms([...alarms, newAlarm]);
        console.log(`Selected time: ${hours}:${minutes.toString().padStart(2, '0')}`);
    }

    const deleteAlarm = (id: number) => {        
        setAlarms(alarms.filter(alarm => alarm.id !== id));
    };

    return (
        <ThemedView>
            <View style={globalStyles.header}>
                <ThemedText style={globalStyles.sectionTitle}>
                    Будильники
                </ThemedText>
                <TouchableOpacity 
                    style={[globalStyles.buttonParent, globalStyles.quickSetButton]}
                    onPress={handleAddAlarm}
                >
                    <Text>
                        +
                    </Text>
                </TouchableOpacity>
            </View>
            {alarms.map(alarm => {
                // Создаем жест свайпа для удаления будильника
                const pan = Gesture
                    .Pan()
                    .onChange((event) => {
                        if (event.translationX < -80) { // Если свайп влево на 80 пикселей
                            // Используем runOnJS для вызова функции, которая не является worklet
                            runOnJS(deleteAlarm)(alarm.id);
                        }
                    });

                return (
                    <GestureDetector key={alarm.id} gesture={pan}>
                        <View style={styles.alarmItem}>
                            <Text style={styles.alarmItemTime}>{alarm.time}</Text>
                            <Text style={styles.alarmItemDescription}>{alarm.description}</Text>
                            <TouchableOpacity style={styles.alarmItemToggle}>
                                <Switch 
                                    style={styles.alarmItemToggle}
                                    value={alarm.enabled}
                                    onValueChange={() => toggleAlarm(alarm.id)}
                                />
                            </TouchableOpacity>
                        </View>
                    </GestureDetector>
                );
            })}
            {
                modalVisible &&
                <Modal 
                    closeModal={closeModal} 
                    onTimeSelect={handleTimeSelect}
                />
            }
        </ThemedView>
    )
}


const styles = StyleSheet.create({
    alarmItem: {
        paddingVertical: 20,
        paddingLeft: 30,
        paddingRight: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopColor: '#97a89d',
        borderTopWidth: 1,
    },
    alarmItemTime: {
        fontSize: 20,
        fontWeight: 'bold',
        minWidth: 60,
    },
    alarmItemDescription: {
        flex: 1,
        marginLeft: 15,
        fontSize: 16,
        color: '#666',
    },
    alarmItemToggle: {
        // transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
        marginHorizontal: 10,
    }
})