import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from "react-native";


export default function testTab() {
    return (
        <ThemedView style={styles.box}>
            <ThemedText>
                testing page
            </ThemedText>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    box: {
        backgroundColor: 'red',
        width: 190,
        height: 190,
        margin: 'auto'
    }
})