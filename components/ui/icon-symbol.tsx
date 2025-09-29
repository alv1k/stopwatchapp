// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Навигация
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'arrow.left': 'arrow-back',
  'arrow.right': 'arrow-forward',
  'arrow.up': 'arrow-upward',
  'arrow.down': 'arrow-downward',
  
  'heart.fill': 'favorite',
  'heart': 'favorite-border',
  'star.fill': 'star',
  'star': 'star-border',
  
  // Действия
  'plus': 'add',
  'minus': 'remove',
  'xmark': 'close',
  'checkmark': 'check',
  'trash': 'delete',
  'square.and.arrow.up': 'share',
  'square.and.pencil': 'edit',
  'gear': 'settings',
  'magnifyingglass': 'search',
  'bookmark.fill': 'bookmark',
  'bookmark': 'bookmark-border',
  
  // Социальные
  'person.fill': 'person',
  'person.2.fill': 'people',
  'bell.fill': 'notifications',
  'bell': 'notifications-none',
  'message.fill': 'message',
  'envelope.fill': 'email',
  
  // Файлы и данные
  'folder.fill': 'folder',
  'doc.fill': 'description',
  'list.bullet': 'list',
  'square.grid.2x2': 'apps',
  
  // Состояния
  'wifi': 'wifi',
  'wifi.slash': 'wifi-off',
  'battery.100': 'battery-full',

  // Таймеры и секундомеры
  'timer': 'timer',
  'stopwatch': 'timer',
  'stopwatch.fill': 'timer',
  'clock.fill': 'schedule',
  'clock': 'schedule',
  'alarm.fill': 'alarm',
  'alarm': 'alarm',
  
  // Управление временем
  'deskclock.fill': 'access-time',
  'deskclock': 'access-time',
  
  // Контроль времени
  'plus.app.fill': 'add-alarm',
  'clock.arrow.circlepath': 'update',
  'clock.badge.checkmark': 'alarm-on',
  'clock.badge.xmark': 'alarm-off',
  'clock.badge.exclamationmark': 'alarm-add',
  
  // Интервалы и периоды
  'circle.grid.2x2.fill': 'av-timer',
  'waveform.path.ecg': 'timeline',
  'chart.line.uptrend.xyaxis': 'show-chart',
  
  // Секундомер специфичные
  'play.circle.fill': 'play-circle',
  'pause.circle.fill': 'pause-circle',
  'stop.circle.fill': 'stop-circle',
  'record.circle.fill': 'fiber-manual-record',
  'flag.fill': 'flag',
  'flag': 'outlined-flag',
  
  // Круги прогресса
  'circle.fill': 'brightness-1',
  'circle': 'radio-button-unchecked',
  'circle.dashed': 'more-time',
  'circle.inset.filled': 'trip-origin',
  
  // Настройки времени
  'slider.horizontal.3': 'tune',
  'gearshape.fill': 'settings',
  'gearshape': 'settings',
  
  // История и laps
  'list.clipboard': 'assignment',
  'list.number': 'format-list-numbered',
  'list.star': 'star-rate',
  
  // Экспорт и сохранение
  'square.and.arrow.down': 'save',
  'chart.bar.doc.horizontal': 'analytics',
  'doc.text.fill': 'description',
  
  // Дополнительные для таймера
  'bolt.fill': 'flash-on',
  'bolt': 'flash-off',
  'moon.fill': 'nights-stay',
  'moon': 'nights-stay',
  'sun.max.fill': 'wb-sunny',
  'sun.max': 'wb-sunny',
  
  // Вибрация и уведомления
  'iphone.gen3.radiowaves.left.and.right': 'vibration',
  'bell.badge.fill': 'notifications-active',
  'bell.slash.fill': 'notifications-off',
  
  // Статистика
  'chart.pie.fill': 'pie-chart',
  'chart.bar.fill': 'bar-chart',
  'number': 'looks-one',
  'number.circle': 'looks-one',
  'number.circle.fill': 'looks-one',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
