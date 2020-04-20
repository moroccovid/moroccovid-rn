import TrajetService from '../database/services/TrajetService';
import StorageManager from '../storage/manager';
import ConnectivityManager from '../device/connectivity/manager';
import axios, {AxiosResponse, AxiosError} from 'axios';
import env from '../../utils/env';
export default class TrackingManager {
  async syncTrajet(id: number): Promise<boolean> {
    const connected = await ConnectivityManager.checkConnection();
    if (!connected) return false;

    const trajet = await TrajetService.prototype.get(id);
    const mac = await StorageManager.getData('mac');

    trajet.locations.sort((a, b) => a.timestamp - b.timestamp);

    let path = {
      start: trajet.locations[0],
      end: trajet.locations[trajet.locations.length - 1],
      detects: trajet.detects,
    };

    let data = {mac, path};

    let resp: AxiosResponse | void = await axios
      .post(env.api_url + 'savepath', data)
      .catch((err: AxiosError) => {
        console.log('TrackingManager -> err', err);
      });

    console.log('TrackingManager -> resp', resp);

    await TrajetService.prototype.synced(id);
    return true;
  }
}
