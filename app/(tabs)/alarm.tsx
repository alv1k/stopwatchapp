import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { globalStyles } from '@/styles/main';
import React, { useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function testTab() {

    const [isAlarmEnabled, setIsAlarmEnabled] = useState(false);
    const toggleAlarm = () => {
        setIsAlarmEnabled(isAlarmEnabled === false ? true : false)
    }

    return (
        <ThemedView>
            <View style={globalStyles.header}>
                <ThemedText style={globalStyles.sectionTitle}>
                    Будильники
                </ThemedText>
                <TouchableOpacity style={[globalStyles.buttonParent, globalStyles.quickSetButton]}>
                    <Text>
                        +
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.alarmItem}>
                <Text style={styles.alarmItemTime}>8:43</Text>
                <Text>описание будильника</Text>
                <TouchableOpacity style={styles.alarmItemToggle}>
                    <Switch style={styles.alarmItemToggle}
                        value={isAlarmEnabled}
                        onValueChange={toggleAlarm}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.alarmItem}>
                <Text style={styles.alarmItemTime}>8:53</Text>
                <Text>описание будильника</Text>
                <TouchableOpacity style={styles.alarmItemToggle}>
                    <Switch style={styles.alarmItemToggle}
                        value={isAlarmEnabled}
                        onValueChange={toggleAlarm}
                    />
                </TouchableOpacity>
            </View>
        </ThemedView>
    )
}


const styles = StyleSheet.create({
    alarmItem: {
        paddingVertical: 20,
        paddingLeft: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopColor: '#97a89d',
        borderTopWidth: 1,
    },
    alarmItemTime: {
        fontSize: 20
    },
    alarmItemToggle: {
        // transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
        marginHorizontal: 10,
    }
})