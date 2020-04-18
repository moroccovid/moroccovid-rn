import 'react-native-gesture-handler';
import React, {Component} from 'react';
import Navigator from './navigation/Navigator';
import DatabaseManager from './managers/database/manager';
export default class App extends Component {
  componentDidMount() {
    DatabaseManager.prototype.connect();
  }
  render() {
    return <Navigator />;
  }
}
