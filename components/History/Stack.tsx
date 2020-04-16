import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams,
} from 'react-navigation';
import History from './History';
import Details from './Details';
const Stack = createStackNavigator();

export default class HistoryStack extends Component<{
  route: any;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}> {
  render() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="Details" component={Details} />
      </Stack.Navigator>
    );
  }
}
