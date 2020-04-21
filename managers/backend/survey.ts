import axios, {AxiosResponse} from 'axios';
import env from '../../utils/env';
import deviceManager from '../device/deviceManager';
import backendManager from './backendManager';

export default {
  async saveSurvey(survey: any): Promise<boolean> {
    try {
      const mac = await deviceManager.getMac();

      const token = await backendManager.auth();

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
