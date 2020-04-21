import axios, {AxiosResponse} from 'axios';
import env from '../../utils/env';
import StorageManager from '../storage/manager';

export default {
  async savePath(path: any): Promise<string> {
    try {
      const token = await StorageManager.getData('token');
      if (!token) return '';
      let resp: AxiosResponse = await axios.post(
        env.api_url + 'savepath/' + JSON.stringify(path),
        {},
        {headers: {Authorization: `jwt ${token}`}},
      );
      console.log('savePath -> resp', resp);
      return resp.data.id;
    } catch (err) {
      console.log('savePath -> err', err);
      return '';
    }
  },
};
