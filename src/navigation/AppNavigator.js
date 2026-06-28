import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';

import KokoHomeScreen from '../screens/KokoHomeScreen';
import NumberBayScreen from '../screens/NumberBayScreen';
import GamePickerScreen from '../screens/GamePickerScreen';
import CountingGameScreen from '../screens/CountingGameScreen';
import GameResultScreen from '../screens/GameResultScreen';
import SeaStickerScreen from '../screens/SeaStickerScreen';
import ParentSettingsScreen from '../screens/ParentSettingsScreen';

const Stack = createNativeStackNavigator();

/**
 * Navigation theme MUST extend DefaultTheme so required fields (e.g. fonts)
 * are always present and the app never crashes in release builds.
 */
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.card,
    primary: colors.primary,
    text: colors.text,
    border: colors.border,
    notification: colors.accent,
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="KokoHome"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="KokoHome" component={KokoHomeScreen} />
        <Stack.Screen name="NumberBay" component={NumberBayScreen} />
        <Stack.Screen name="GamePicker" component={GamePickerScreen} />
        <Stack.Screen name="CountingGame" component={CountingGameScreen} />
        <Stack.Screen name="GameResult" component={GameResultScreen} />
        <Stack.Screen name="SeaSticker" component={SeaStickerScreen} />
        <Stack.Screen name="ParentSettings" component={ParentSettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
