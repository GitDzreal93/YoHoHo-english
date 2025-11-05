import React from 'react';
import styled from 'styled-components';
import { theme } from '@styles/index';

interface IconProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  color?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const IconWrapper = styled.span<{
  $size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  $color: string;
  $clickable: boolean;
  $disabled: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all ${theme.animations.duration.normal} ${theme.animations.ease.out};

  ${({ $size }) => {
    switch ($size) {
      case 'xs':
        return `width: 16px; height: 16px; font-size: 16px;`;
      case 'sm':
        return `width: 20px; height: 20px; font-size: 20px;`;
      case 'lg':
        return `width: 32px; height: 32px; font-size: 32px;`;
      case 'xl':
        return `width: 40px; height: 40px; font-size: 40px;`;
      case '2xl':
        return `width: 48px; height: 48px; font-size: 48px;`;
      default:
        return `width: 24px; height: 24px; font-size: 24px;`;
    }
  }}

  color: ${({ $color }) => $color};

  ${({ $clickable, $disabled }) =>
    $clickable &&
    !$disabled &&
    `
    cursor: pointer;
    border-radius: ${theme.borderRadius.md};
    padding: 4px;

    &:hover {
      background: ${theme.colors.gray[100]};
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.95);
    }
  `}

  ${({ $disabled }) =>
    $disabled &&
    `
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  `}
`;

// Common emoji icons for the app
const iconMap: Record<string, string> = {
  // Animals
  cat: '🐱',
  dog: '🐶',
  rabbit: '🐰',
  fox: '🦊',
  bear: '🐻',
  panda: '🐼',
  tiger: '🐯',
  lion: '🦁',
  elephant: '🐘',
  giraffe: '🦒',

  // Actions
  play: '▶️',
  pause: '⏸️',
  stop: '⏹️',
  next: '⏭️',
  previous: '⏮️',
  repeat: '🔁',
  shuffle: '🔀',

  // UI Elements
  home: '🏠',
  settings: '⚙️',
  user: '👤',
  profile: '👤',
  menu: '☰',
  close: '✕',
  check: '✓',
  warning: '⚠️',
  error: '❌',
  info: 'ℹ️',
  success: '✅',

  // Games
  game: '🎮',
  trophy: '🏆',
  star: '⭐',
  heart: '❤️',
  fire: '🔥',
  rocket: '🚀',

  // Learning
  book: '📚',
  pencil: '✏️',
  notebook: '📓',
  graduation: '🎓',
  brain: '🧠',

  // Emotions
  smile: '😊',
  laugh: '😄',
  cool: '😎',
  love: '😍',
  thinking: '🤔',
  sleepy: '😴',

  // Food
  apple: '🍎',
  banana: '🍌',
  cake: '🎂',
  candy: '🍬',
  ice_cream: '🍦',

  // Nature
  sun: '☀️',
  moon: '🌙',
  star_empty: '⭐',
  cloud: '☁️',
  flower: '🌸',
  tree: '🌳',

  // Transportation
  car: '🚗',
  airplane: '✈️',
  train: '🚂',
  boat: '⛵',
  bicycle: '🚲',

  // Colors (as colored circles)
  red: '🔴',
  blue: '🔵',
  green: '🟢',
  yellow: '🟡',
  orange: '🟠',
  purple: '🟣',
  black: '⚫',
  white: '⚪',

  // Numbers
  zero: '0️⃣',
  one: '1️⃣',
  two: '2️⃣',
  three: '3️⃣',
  four: '4️⃣',
  five: '5️⃣',
  six: '6️⃣',
  seven: '7️⃣',
  eight: '8️⃣',
  nine: '9️⃣',

  // Misc
  sound: '🔊',
  mute: '🔇',
  lock: '🔒',
  unlock: '🔓',
  search: '🔍',
  filter: '🔽',
  sort: '🔼',
  plus: '➕',
  minus: '➖',
  edit: '✏️',
  trash: '🗑️',
  download: '⬇️',
  upload: '⬆️',
  share: '🔗',
  copy: '📋',
  paste: '📋',
  cut: '✂️',
  save: '💾',
  print: '🖨️',
  camera: '📷',
  photo: '📷',
  video: '📹',
  music: '🎵',
  phone: '📞',
  email: '✉️',
  calendar: '📅',
  clock: '⏰',
  alarm: '⏰',
  timer: '⏱️',
  stopwatch: '⏱️',
  compass: '🧭',
  map: '🗺️',
  location: '📍',
  pin: '📍',
  bookmark: '🔖',
  flag: '🚩',
  gift: '🎁',
  party: '🎉',
  balloon: '🎈',
  confetti: '🎊',
  firework: '🎆',
  magic: '✨',
  wand: '🪄',
  crystal: '💎',
  key: '🔑',
  chest: '📦',
  box: '📦',
  bag: '👜',
  backpack: '🎒',
  umbrella: '☂️',
  rainbow: '🌈',
  cloud_rain: '🌧️',
  lightning: '⚡',
  snowflake: '❄️',
  fire_flame: '🔥',
  water: '💧',
  droplet: '💧',
  wave: '🌊',
  island: '🏝️',
  mountain: '⛰️',
  volcano: '🌋',
  earth: '🌍',
  planet: '🪐',
  rocket_ship: '🚀',
  ufo: '🛸',
  alien: '👽',
  robot: '🤖',
  ghost: '👻',
  skull: '💀',
  bone: '🦴',
  dna: '🧬',
  microscope: '🔬',
  telescope: '🔭',
  laboratory: '🧪',
  experiment: '🧪',
  formula: '🧮',
  calculator: '🧮',
  computer: '💻',
  laptop: '💻',
  tablet: '📱',
  smartphone: '📱',
  television: '📺',
  radio: '📻',
  antenna: '📡',
  satellite: '📡',
  wifi: '📶',
  battery: '🔋',
  plug: '🔌',
  lightbulb: '💡',
  lamp: '🏮',
  candle: '🕯️',
  fire_camp: '🔥',
  fireworks: '🎆',
  sparkler: '✨',
  medal: '🏅',
  ribbon: '🎗️',
  crown: '👑',
  ring: '💍',
  gem: '💎',
  coin: '🪙',
  money: '💰',
  wallet: '👛',
  credit_card: '💳',
  shopping_cart: '🛒',
  shopping_bag: '🛍️',
  gift_card: '🎫',
  ticket: '🎫',
  airplane_ticket: '✈️',
  passport: '📔',
  luggage: '🧳',
  hotel: '🏨',
  bed: '🛏️',
  bathtub: '🛁',
  toilet: '🚽',
  sink: '🚰',
  soap: '🧼',
  towel: '🧻',
  toothbrush: '🪥',
  toothpaste: '🦷',
  mirror: '🪞',
  scissors: '✂️',
  tape: '📼',
  glue: '🔗',
  hammer: '🔨',
  screwdriver: '🔧',
  wrench: '🔧',
  saw: '🪚',
  drill: '🔩',
  ruler: '📏',
  triangle: '📐',
  compass_drawing: '🧭',
  pencil_sharpener: '✏️',
  eraser: '🧹',
  chalk: '📝',
  blackboard: '📝',
  book_open: '📖',
  bookmark_tab: '🔖',
  paperclip: '📎',
  pushpin: '📌',
  thumbtack: '📌',
  magnet: '🧲',
  battery_charging: '🔋',
  power: '🔌',
  plug_type: '🔌',
  electrical_socket: '🔌',
  light_switch: '🔦',
  flashlight: '🔦',
  candle_light: '🕯️',
  fireworks_display: '🎆',
  sparkles: '✨',
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color = theme.colors.gray[700],
  onClick,
  disabled = false,
  className,
}) => {
  const iconChar = iconMap[name] || '❓';

  return (
    <IconWrapper
      $size={size}
      $color={color}
      $clickable={!!onClick}
      $disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={className}
    >
      {iconChar}
    </IconWrapper>
  );
};