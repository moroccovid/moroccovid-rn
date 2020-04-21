import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams,
} from 'react-navigation';
import Welcome from './Welcome';
import Stats from './Stats/Stats';
const Stack = createStackNavigator();

export default class WelcomeStack extends Component<{
  route: any;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}> {
  render() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Stats" component={Stats} />
      </Stack.Navigator>
    );
  }
}
