import { Platform, StyleSheet } from 'react-native';

// Общие стили для приложения Stopwatch
export const globalStyles = StyleSheet.create({
  // Контейнеры
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#f5f5f5',
  },
  
  section: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  header: {
    paddingTop: 30,
    paddingHorizontal: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  // Текстовые стили
  timeText: {
    fontSize: 50,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#333',
    backgroundColor: '#b0d6d2',
    padding: 20,
    borderRadius: 5,
    marginTop: 50
  },
  
  stopwatchTimeText: {
    fontSize: 60,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#333',
    marginBottom: 50,
  },
  
  separatorText: {
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#333',
    marginTop: 30,
    marginHorizontal: 5,
  },
  
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f0f0f0',
  },
  
  // Кнопки
  buttonParent: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    minWidth: 100,
    alignItems: 'center',
  },
  
  startButton: {
    backgroundColor: '#4CAF50',
  },
  
  stopButton: {
    backgroundColor: '#f44336',
  },
  
  resetButton: {
    backgroundColor: '#9E9E9E',
  },
  
  setTimeButton: {
    backgroundColor: '#c09317ff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    minWidth: 100,
    alignItems: 'center',
  },
  
  quickSetButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    minWidth: 70,
    alignItems: 'center',
  },
  
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 20,
    width: 'auto'
  },
  
  // Списки и элементы
  lapsSection: {
    flex: 1,
    marginTop: 20,
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

// Цветовая палитра приложения
export const colors = {
  primary: '#4CAF50',
  secondary: '#f44336',
  accent: '#9E9E9E',
  background: '#f5f5f5',
  text: '#333',
  separator: '#e0e0e0',
  timerBackground: '#b0d6d2',
  quickSet: '#2196F3',
  setTime: '#c09317ff',
};