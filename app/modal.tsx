import TimePicker from '@/components/TimePicker';
import { StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';


interface ModalScreenProps {
  closeModal?: () => void;
  onTimeSelect?: (hours: number, minutes: number) => void;
}

export default function ModalScreen({ closeModal, onTimeSelect }: ModalScreenProps) {
  const screenHeight = useWindowDimensions().height;
  
  const handleTimeSelect = (hours: number, minutes: number) => {
    if (onTimeSelect) {
      onTimeSelect(hours, minutes);
    }
    if (closeModal) {
      closeModal();
    }
  };

  const handleCancel = () => {
    if (closeModal) {
      closeModal();
    }
  };
  
  const handleOverlayPress = () => {    
    if (closeModal) {
      closeModal();
    }
  };
  
  return (
    <TouchableOpacity 
      style={[styles.container, {height: screenHeight}]} 
      onPress={handleOverlayPress}
      activeOpacity={1}
    >
      <TouchableOpacity 
        activeOpacity={1} // Предотвращает срабатывание onPress на содержимом модального окна
        onPress={() => {}} // Заглушка, чтобы не срабатывало при клике внутри модального окна
        style={{height:300}}
      >
        <TimePicker 
          onTimeSelect={handleTimeSelect} 
          onClose={handleCancel} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    width: '100%',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});