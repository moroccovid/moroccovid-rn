import axios, {AxiosResponse} from 'axios';
import env from '../../utils/env';
import StorageManager from '../storage/storageManager';
import backendManager from './backendManager';

export default {
  async savePath(path: any): Promise<string> {
    try {
      const token = await backendManager.auth();

      let resp: AxiosResponse = await axios.post(
        env.api_url + 'savepath/' + JSON.stringify(path),
        {},
        {headers: {Authorization: `jwt ${token}`}},
      );
      console.log('savePath -> resp', resp);
      return resp.data.id;
    } catch (err) {
      console.log('savePath -> err', err);
      Alert.alert('Error at citizen getstats', JSON.stringify(err));
      return '';
    }
  },

  async getStats(cloudID: string) {
    try {
      const token = await backendManager.auth();
      let options = {headers: {Authorization: `jwt ${token}`}};

      let respones = await Promise.all([
        axios.get(
          env.api_url + 'getCountDirectContactsByPath/' + cloudID,
          options,
        ),
        axios.get(
          env.api_url + 'getCountDirectInfectedContactsByPath/' + cloudID,
          options,
        ),
        axios.get(
          env.api_url + 'getCountDirectSuspectContactsByPath/' + cloudID,
          options,
        ),
      ]);

      return {
        totalContacts: respones[0].data.count,
        infectedContacts: respones[1].data.count,
        suspectContacts: respones[2].data.count,
      };
    } catch (err) {
      console.log('savePath -> err', err);
      return null;
    }
  },
};
