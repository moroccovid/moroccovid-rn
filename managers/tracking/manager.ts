import TrajetService from '../database/services/TrajetService';
import StorageManager from '../storage/manager';
import ConnectivityManager from '../device/connectivity/manager';
import axios, {AxiosResponse, AxiosError} from 'axios';
export default class TrackingManager {
  async syncTrajet(id: number): Promise<boolean> {
    const connected = await ConnectivityManager.prototype.checkConnection();
    if (!connected) return false;

    const trajet = await TrajetService.prototype.get(id);
    const number = await StorageManager.prototype.getData('number');

    let data = {number, trajet};

    let resp: AxiosResponse | void = await axios
      .post('https://moroccovid-tracking.herokuapp.com/', data)
      .catch((err: AxiosError) => {
        console.log('TrackingManager -> err', err);
      });

    console.log('TrackingManager -> resp', resp);

    await TrajetService.prototype.synced(id);
    return true;
  }
}
