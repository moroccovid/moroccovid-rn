import axios, {AxiosResponse} from 'axios';
import env from '../../utils/env';
import StorageManager from '../storage/manager';

export default {
  async auth() {
    try {
      let resp: AxiosResponse = await axios.post(env.api_url + 'auth', {
        username: 'covidmaroc',
        password: 'covidmaroc2019',
      });
      console.log('auth -> resp.data', resp.data);
      if (!resp.data.access_token) return false;
      StorageManager.saveItem('token', resp.data.access_token);
      return true;
    } catch (err) {
      console.log('auth -> err', err);
      return false;
    }
  },

  async saveCitizen(mac: string) {
    try {
      const token = await StorageManager.getData('token');
      if (!token) return false;
      let resp: AxiosResponse | void = await axios.post(
        env.api_url +
          'savecitizen/' +
          JSON.stringify({mac, score: 5, datetime: new Date().getTime()}),
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
};
