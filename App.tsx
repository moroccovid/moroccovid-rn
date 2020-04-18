import 'react-native-gesture-handler';
import React, {Component} from 'react';
import Navigator from './navigation/Navigator';
import DatabaseManager from './managers/database/manager';
import {getMacAddress} from 'react-native-device-info';
export default class App extends Component {
  async componentDidMount() {
    DatabaseManager.prototype.connect();
    // Getting and sending the mac address
    const mac = await getMacAddress();
    console.log('App -> componentDidMount -> mac', mac);
  }
  render() {
    return <Navigator />;
  }
}
