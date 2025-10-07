import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';

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

const Spinner: React.FC<SpinnerProps> = React.memo(({ value, onValueChange, maxValue, minValue = 0, label, autoFocus, onReachedMax, onReachedMin }) => {
  const [selectedValue, setSelectedValue] = useState<number>(value);
  const [isScrolling, setIsScrolling] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const itemHeight = 50; // высота каждого элемента
  
  // Создаем массив с одним набором значений
  const totalValues = maxValue - minValue + 1;
  const extendedValues = React.useMemo(() => {
    const values = [];
    // Создаем один набор значений
    for (let i = minValue; i <= maxValue; i++) {
      values.push(i);
    }
    return values;
  }, [maxValue, minValue]);

  // Обновляем выбранное значение, когда оно изменяется снаружи
  useEffect(() => {    
    const constrainedValue = Math.max(minValue, Math.min(maxValue, value));
    setSelectedValue(constrainedValue);
    
    // Пересчитываем центральный индекс
    const newCenterIndex = constrainedValue - minValue;
    
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: newCenterIndex * itemHeight, animated: false });
    }
  }, [value, minValue, maxValue, totalValues, itemHeight]);

  // Обработка окончания прокрутки
  const onScrollEnd = useCallback((event: any) => {
    const scrollY = Math.max(0, event.nativeEvent.contentOffset.y);
    const index = Math.round(scrollY / itemHeight);
    
    // Убедимся, что индекс в допустимом диапазоне
    const validIndex = Math.min(Math.max(0, index), extendedValues.length - 1);
    
    // Получаем значение по индексу
    const newValue = extendedValues[validIndex];
  
    // Проверяем, достигли ли мы максимального или минимального значения при прокрутке
    if (selectedValue === maxValue && newValue !== maxValue && onReachedMax) {
      onReachedMax();
    } else if (selectedValue === minValue && newValue !== minValue && onReachedMin) {
      onReachedMin();
    }
    
    // Обновляем значение
    setSelectedValue(newValue);
    onValueChange(newValue);
    
    setIsScrolling(false);
  }, [extendedValues, itemHeight, maxValue, minValue, onReachedMax, onReachedMin, selectedValue]);

  // Обработка прокрутки (для анимации)
  const onScroll = useCallback((event: any) => {
    animation.setValue(event.nativeEvent.contentOffset.y);
  }, [animation]);

  // Для анимации прозрачности и масштаба
  const getOpacity = useCallback((index: number) => {
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
  }, [animation, itemHeight]);
  
  const getScale = useCallback((index: number) => {
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
  }, [animation, itemHeight]);

  return (
    <View style={styles.container}>
      <Text style={styles.label} selectable={false}>{label}</Text>
      <View style={styles.spinnerContainer}>
        {/* Верхняя полупрозрачная область */}
        {/* <View style={[styles.overlay, styles.topOverlay]} /> */}
        {/* Центральная область выбора */}
        {/* <View style={styles.selectionArea} pointerEvents="none" /> */}
        
        {/* Нижняя полупрозрачная область */}
        {/* <View style={[styles.overlay, styles.bottomOverlay]} /> */}
        
        <ScrollView
          ref={scrollViewRef}
          onScrollEndDrag={onScrollEnd}
          onScroll={onScroll}
          scrollEventThrottle={1}
          showsVerticalScrollIndicator={false}
          bounces={false}
          snapToInterval={itemHeight}
          snapToAlignment="center"
          keyboardShouldPersistTaps="handled"
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
                pointerEvents="box-only"
              >
                <Text 
                  style={[
                    styles.itemText,
                    selectedValue === val && styles.selectedItemText
                  ]}
                  selectable={false}
                  pointerEvents="none"
                >
                  {val.toString().padStart(2, '0')}
                </Text>
              </Animated.View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
});

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
    height: 50, // 3 элемента по 50px
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