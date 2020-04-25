import 'react-native-gesture-handler';
import React, {Component} from 'react';
import Navigator from './navigation/Navigator';
import DatabaseManager from './managers/database/databaseManager';
import backendManager from './managers/backend/backendManager';
import ConnectivityManager from './managers/device/connectivity/connectivityManager';
import deviceManager from './managers/device/deviceManager';
import {NativeModules} from 'react-native';
import {getDeviceName} from 'react-native-device-info';
export default class App extends Component {
  async componentDidMount() {
    DatabaseManager.connect();

    await deviceManager.changeName();

    let connected = await ConnectivityManager.checkConnection();
    if (!connected) return;

    await backendManager.auth();
    // Getting and sending the mac address
    deviceManager.getMac();
  }

  render() {
    return <Navigator />;
  }
}
