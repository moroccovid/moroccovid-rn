import axios, {AxiosResponse} from 'axios';
import env from '../../utils/env';
import StorageManager from '../storage/manager';

export default {
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
};
