import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

interface SpinnerProps {
  value: number;
  onValueChange: (value: number) => void;
  maxValue: number;
  minValue?: number;
  label: string;
  autoFocus?: boolean;
  onReachedMax?: () => void;
  onReachedMin?: () => void;
}

const { height } = Dimensions.get('window');

const Spinner: React.FC<SpinnerProps> = ({ value, onValueChange, maxValue, minValue = 0, label, autoFocus, onReachedMax, onReachedMin }) => {
  const [selectedValue, setSelectedValue] = useState<number>(value);
  const [isScrolling, setIsScrolling] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const itemHeight = 50; // высота каждого элемента
  const visibleItems = 3; // количество видимых элементов (всегда нечетное для центрального элемента)
  
  // Для циклической прокрутки создаем расширенный массив значений
  const totalValues = maxValue - minValue + 1;
  const extendedValues = Array.from({ length: totalValues * 3 }, (_, i) => {
    const actualValue = minValue + (i % totalValues);
    return actualValue;
  });
  
  // Индекс центрального значения для начальной позиции
  const centerIndex = Math.floor(extendedValues.length / 2);
  const initialValueIndex = centerIndex + (value - minValue);

  // Обновляем выбранное значение, когда оно изменяется снаружи
  useEffect(() => {
    setSelectedValue(value);
    scrollToValue(value);
  }, [value]);
  
  // Прокручиваем до нужного значения
  const scrollToValue = (value: number) => {
    const index = centerIndex + (value - minValue);
    const offset = index * itemHeight;
    
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: offset, animated: false });
    }
  };

  // Обработка окончания прокрутки
  const onScrollEnd = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const index = Math.round(scrollY / itemHeight);
    
    // Нормализуем индекс к центральной части массива
    const normalizedIndex = ((index % totalValues) + totalValues) % totalValues;
    const newValue = minValue + normalizedIndex;
    
    // Проверяем, достигли ли мы максимального или минимального значения при прокрутке
    if (selectedValue === maxValue && newValue !== maxValue && onReachedMax) {
      onReachedMax();
    } else if (selectedValue === minValue && newValue !== minValue && onReachedMin) {
      onReachedMin();
    }
    
    // Прокручиваем к центру, если нужно
    if (index < centerIndex - totalValues/2 || index > centerIndex + totalValues/2) {
      // Возвращаем к центральной позиции, чтобы избежать ограничений ScrollView
      setTimeout(() => {
        scrollToValue(newValue);
      }, 0);
    }
    
    setSelectedValue(newValue);
    onValueChange(newValue);
    setIsScrolling(false);
  };

  // Обработка прокрутки (для анимации)
  const onScroll = (event: any) => {
    if (!isScrolling) {
      setIsScrolling(true);
    }
    animation.setValue(event.nativeEvent.contentOffset.y);
  };

  // Для анимации прозрачности и масштаба
  const getOpacity = (index: number) => {
    const scrollValue = animation.interpolate({
      inputRange: [
        (index - 1) * itemHeight,
        index * itemHeight,
        (index + 1) * itemHeight
      ],
      outputRange: [0.5, 1, 0.5],
      extrapolate: 'clamp'
    });
    
    return scrollValue;
  };
  
  const getScale = (index: number) => {
    const scrollValue = animation.interpolate({
      inputRange: [
        (index - 1) * itemHeight,
        index * itemHeight,
        (index + 1) * itemHeight
      ],
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp'
    });
    
    return scrollValue;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.spinnerContainer}>
        {/* Верхняя полупрозрачная область */}
        <View style={[styles.overlay, styles.topOverlay]} />
        
        {/* Центральная область выбора */}
        <View style={styles.selectionArea} pointerEvents="none" />
        
        {/* Нижняя полупрозрачная область */}
        <View style={[styles.overlay, styles.bottomOverlay]} />
        
        <ScrollView
          ref={scrollViewRef}
          onMomentumScrollEnd={onScrollEnd}
          onScroll={onScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          bounces={false}
          snapToInterval={itemHeight}
          snapToAlignment="center"
          decelerationRate="fast"
          // Начальная позиция для центрального значения
          onLayout={() => {
            scrollToValue(value);
          }}
        >
          {extendedValues.map((val, index) => {
            const opacity = getOpacity(index);
            const scale = getScale(index);
            
            return (
              <Animated.View
                key={`${val}-${index}`}
                style={[
                  styles.item,
                  {
                    height: itemHeight,
                    opacity: isScrolling ? opacity : (selectedValue === val ? 1 : 0.5),
                    transform: isScrolling ? [{ scale }] : [{ scale: selectedValue === val ? 1 : 0.8 }]
                  }
                ]}
              >
                <Text style={[
                  styles.itemText,
                  selectedValue === val && styles.selectedItemText
                ]}>
                  {val.toString().padStart(2, '0')}
                </Text>
              </Animated.View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  spinnerContainer: {
    height: 3 * 50, // 3 элемента по 50px
    width: 60,
    overflow: 'hidden',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 50,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  topOverlay: {
    top: 0,
  },
  bottomOverlay: {
    bottom: 0,
  },
  selectionArea: {
    position: 'absolute',
    top: 50,
    height: 50,
    width: '100%',
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#888',
    zIndex: 2,
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  itemText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#999',
  },
  selectedItemText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default Spinner;