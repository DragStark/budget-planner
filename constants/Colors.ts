/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { G } from "react-native-svg";

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  BLACK: '#000',
  PRIMARYA: '#DB5252',
  PRIMARYB: '#8D4546',
  SECONDARYA: '#F4D654',
  SECONDARYB: '#B2832C',
  TEXT: '#1F2534',
  BACKGROUND: '#F6E4B5',
  categories: {
    a: '#003285',
    b: '#2A629A',
    c: '#FF7F3E',
    d: '#FFDA78',
    e: '#B80000',
    f: '#820300',
    g: '#5F0F40',
    h: '#711DB0',
    i: '#C21292',
    k: '#C1F2B0',
    l: '#65B741',
    m: '#527853',
  }
};
