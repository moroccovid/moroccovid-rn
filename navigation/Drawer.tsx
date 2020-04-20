import React, {Component} from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';
import customDrawer from './CustomDrawer/CustomDrawer';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Welcome from '../components/Welcome/Welcome';
import History from '../components/History/History';
import Survey from '../components/Survey/Survey';
import Settings from '../components/Settings/Settings';
import About from '../components/About/About';
import Tracking from '../components/Tracking/Tracking';
import Terms from '../components/Terms/Terms';
import StorageManager from '../managers/storage/manager';
import HistoryStack from '../components/History/Stack';

const Drawer = createDrawerNavigator();

export default class Tabs extends Component {
  state = {number: null};
  componentDidMount() {
    StorageManager.getData('number').then((number) => {
      if (!number) return;
      this.setState({number});
    });
  }
  getIcon({color, size}: any, name: string) {
    return (
      <Icon
        style={{
          width: 35,
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        name={name}
        color={color}
        size={size}
      />
    );
  }
  render() {
    return (
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props: any) => customDrawer(props, this.state.number)}>
        <Drawer.Screen
          options={{
            title: 'Accueil',
            drawerIcon: (args: any) => this.getIcon(args, 'home'),
          }}
          name="Home"
          component={Welcome}
        />
        <Drawer.Screen
          options={{
            title: 'Tracking',
            drawerIcon: (args: any) => this.getIcon(args, 'map-marked'),
          }}
          name="Tracking"
          component={Tracking}
        />
        <Drawer.Screen
          options={{
            title: 'Trajets',
            drawerIcon: (args: any) => this.getIcon(args, 'clock'),
          }}
          name="History"
          component={HistoryStack}
        />
        <Drawer.Screen
          options={{
            title: 'Questionnaire',
            drawerIcon: (args: any) => this.getIcon(args, 'poll-h'),
          }}
          name="Survey"
          component={Survey}
        />
        <Drawer.Screen
          options={{
            title: 'Termes de confidentialite',
            drawerIcon: (args: any) => this.getIcon(args, 'book'),
          }}
          name="Terms"
          component={Terms}
        />
        <Drawer.Screen
          options={{
            title: 'Paramètres',
            drawerIcon: (args: any) => this.getIcon(args, 'cog'),
          }}
          name="Settings"
          component={Settings}
        />
        <Drawer.Screen
          options={{
            title: 'A propos de nous',
            drawerIcon: (args: any) => this.getIcon(args, 'question'),
          }}
          name="About"
          component={About}
        />
      </Drawer.Navigator>
    );
  }
}
