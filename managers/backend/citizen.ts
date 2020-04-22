import {Alert} from 'react-native';
import axios, {AxiosResponse} from 'axios';
import env from '../../utils/env';
import StorageManager from '../storage/manager';
import backendManager from './backendManager';
import deviceManager from '../device/deviceManager';
import connectivityManager from '../device/connectivity/connectivityManager';

export default {
  async saveCitizen(mac: string) {
    try {
      const token = await backendManager.auth();

      let resp: AxiosResponse | void = await axios.post(
        env.api_url +
          'savecitizen/' +
          JSON.stringify({
            mac,
            score: [{value: '5', datetime: new Date().getTime()}],
            phone: '',
            datetime: new Date().getTime(),
          }),
        {},
        {headers: {Authorization: `jwt ${token}`}},
      );
      console.log('saveCitizen -> resp', resp);
      return true;
    } catch (err) {
      console.log('saveCitizen -> err', err);
      return false;
    }
  },

  async getScore(): Promise<number> {
    try {
      const token = await backendManager.auth();
      const mac = await deviceManager.getMac();

      let resp: AxiosResponse = await axios.get(
        env.api_url + 'getLastScore/' + mac,
        {headers: {Authorization: `jwt ${token}`}},
      );

      await StorageManager.saveItem('score', resp.data.score + '');

      return resp.data.score;
    } catch (err) {
      let score = await StorageManager.getData('score');
      return score ? parseFloat(score) : 5;
    }
  },

  async setScore(score: number): Promise<boolean> {
    let connected = await connectivityManager.checkConnection();
    if (!connected) return false;

    try {
      const token = await backendManager.auth();
      const mac = await deviceManager.getMac();

      let resp: AxiosResponse = await axios.get(
        env.api_url + `evaluateScoreByCitizen/${mac}/${score}`,
        {headers: {Authorization: `jwt ${token}`}},
      );

      return true;
    } catch (err) {
      console.log('err', err);
      return false;
    }
  },

  async getStats(): Promise<any> {
    try {
      const token = await backendManager.auth();
      const mac = await deviceManager.getMac();

      let resp: AxiosResponse = await axios.get(
        env.api_url + 'getSatatsPerDay/' + mac,
        {headers: {Authorization: `jwt ${token}`}},
      );
      console.log('resp', resp);
      return {
        infected: resp.data.resultat.tabinfected,
        suspect: resp.data.resultat.tabsuspect,
        nonInfected: resp.data.resultat.tabnoninfected,
      };
    } catch (err) {
      console.log('err', err);
      Alert.alert('Error at citizen getstats', JSON.stringify(err));
      return null;
    }
  },
};
