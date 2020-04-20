import deviceManager from '../device/deviceManager';
import axios, {AxiosResponse} from 'axios';
import env from '../../utils/env';
import StorageManager from '../storage/manager';
import tokenUtils from './tokenUtils';

export default {
  async auth(): Promise<string | null> {
    // check if there's already a token and check if its expired or not
    let token = await StorageManager.getData('token');
    if (token) {
      let jwt = tokenUtils.decode(token);
      if (jwt.exp > new Date().getTime() / 1000) return token;
    }

    try {
      let resp: AxiosResponse = await axios.post(env.api_url + 'auth', {
        username: 'covidmaroc',
        password: 'covidmaroc2019',
      });
      console.log('auth -> resp.data', resp.data);
      if (!resp.data.access_token) return null;
      StorageManager.saveItem('token', resp.data.access_token);
      return resp.data.access_token;
    } catch (err) {
      console.log('auth -> err', err);
      return null;
    }
  },

  async saveCitizen(mac: string) {
    try {
      const token = await StorageManager.getData('token');
      if (!token) return false;
      let resp: AxiosResponse | void = await axios.post(
        env.api_url +
          'savecitizen/' +
          JSON.stringify({
            mac,
            score: [{value: 5, datetime: new Date().getTime()}],
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

  async savePath(path: any) {
    try {
      const token = await StorageManager.getData('token');
      if (!token) return false;
      let resp: AxiosResponse = await axios.post(
        env.api_url + 'savepath/' + JSON.stringify(path),
        {},
        {headers: {Authorization: `jwt ${token}`}},
      );
      console.log('savePath -> resp', resp);
      return true;
    } catch (err) {
      console.log('savePath -> err', err);
      return false;
    }
  },
  async saveSurvey(survey: any) {
    try {
      const mac = await deviceManager.getMac();

      const token = await this.auth();

      survey.mac = mac;

      let resp: AxiosResponse = await axios.post(
        env.api_url + 'saveinvestigation/' + JSON.stringify(survey),
        {},
        {headers: {Authorization: `jwt ${token}`}},
      );
      console.log('saveSurvey -> resp', resp);
      return true;
    } catch (err) {
      console.log('saveSurvey -> err', err);
      return false;
    }
  },
};
7;
