import 'react-native-gesture-handler';
import React, {Component} from 'react';
import Navigator from './navigation/Navigator';
import DatabaseManager from './managers/database/manager';
import {getMacAddress} from 'react-native-device-info';
import StorageManager from './managers/storage/manager';
import backendManager from './managers/backend/backendManager';
import ConnectivityManager from './managers/device/connectivity/manager';
export default class App extends Component {
  async componentDidMount() {
    DatabaseManager.prototype.connect();

    let connected = await ConnectivityManager.checkConnection();
    if (!connected) return;

    let token = await StorageManager.getData('token');

    if (!token) await backendManager.auth();
    // Getting and sending the mac address
    let mac = await StorageManager.getData('mac');
    let macSynced = await StorageManager.getData('macSynced');
    if (!mac) {
      mac = await getMacAddress();
      StorageManager.saveItem('mac', mac);
      await this.saveCitizen(mac);
    } else if (mac && !macSynced) await this.saveCitizen(mac);
  }

  async saveCitizen(mac: string) {
    let success = await backendManager.saveCitizen(mac);
    if (success) StorageManager.saveItem('macSynced', 'true');
  }
  render() {
    return <Navigator />;
  }
}
