import 'react-native-gesture-handler';
import React, {Component} from 'react';
import Navigator from './navigation/Navigator';
import DatabaseManager from './managers/database/manager';
import {getMacAddress} from 'react-native-device-info';
import StorageManager from './managers/storage/manager';
export default class App extends Component {
  async componentDidMount() {
    DatabaseManager.prototype.connect();
    // Getting and sending the mac address
    let mac = await StorageManager.prototype.getData('mac');
    if (!mac) {
      mac = await getMacAddress();
      console.log('Got mac: ', mac);
      StorageManager.prototype.saveItem('mac', mac);
      // TODO send the mac
    } else console.log('Found mac: ', mac);
  }
  render() {
    return <Navigator />;
  }
}
