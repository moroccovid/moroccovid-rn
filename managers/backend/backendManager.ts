import axios, {AxiosResponse} from 'axios';
import env from '../../utils/env';
import StorageManager from '../storage/manager';
import tokenUtils from './tokenUtils';
import citizen from './citizen';
import path from './path';
import survey from './survey';

export default {
  citizen,
  path,
  survey,

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
};
7;
