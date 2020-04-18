import 'react-native-gesture-handler';
import React, {Component} from 'react';
import Navigator from './navigation/Navigator';
import DatabaseManager from './managers/database/manager';
import firebase from '@react-native-firebase/app';
export default class App extends Component {
  componentDidMount() {
    firebase.initializeApp({
      appId: '1:107308200137:android:2b7fa4f5ef773a6d829d18',
      apiKey: 'AIzaSyAlgz_l5l28cfsJa7l4Il0ha8Gu9OLgX_s',
      projectId: 'maroccovid19-a5dcf',
      databaseURL: 'https://maroccovid19-a5dcf.firebaseio.com',
      messagingSenderId:
        'AAAAGPwRMMk:APA91bE_Q4jMeIRR4Fv4KpWZNC286SweBW8_1i-1gtQSO_aHcGowa6_PW8wB21d0f6anBdg42BvK3nbiiAtZ5TuCN1KGirSmS-ZqKji0w-XFRtz61rXiJF_SI_LF83Qws3M4ZIbFuyj-',
      storageBucket: 'maroccovid19-a5dcf.appspot.com',
    });
    DatabaseManager.prototype.connect();
  }
  render() {
    return <Navigator />;
  }
}
