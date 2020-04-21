import axios, {AxiosResponse} from 'axios';
import env from '../../utils/env';
import StorageManager from '../storage/manager';
import backendManager from './backendManager';
import deviceManager from '../device/deviceManager';

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
      console.log('getScore -> resp', resp);

      await StorageManager.saveItem('score', resp.data.score + '');

      return resp.data.score;
    } catch (err) {
      console.log('getScore -> err', err);
      let score = await StorageManager.getData('score');
      return score ? parseFloat(score) : 5;
    }
  },
};
