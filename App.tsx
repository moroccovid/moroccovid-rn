import 'react-native-gesture-handler';
import React, {Component} from 'react';
import Navigator from './navigation/Navigator';
import TrajetService from './database/services/TrajetService';

export default class App extends Component {
  componentDidMount() {
    TrajetService.prototype.connect();
  }
  render() {
    return <Navigator />;
  }
}
