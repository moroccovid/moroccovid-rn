import TrajetService from '../database/services/TrajetService';
import StorageManager from '../storage/manager';
import ConnectivityManager from '../device/connectivity/manager';
import axios, {AxiosResponse, AxiosError} from 'axios';
export default class TrackingManager {
  async syncTrajet(id: number): Promise<boolean> {
    const connected = await ConnectivityManager.prototype.checkConnection();
    if (!connected) return false;

    const trajet: any = await TrajetService.prototype.get(id);
    const mac = await StorageManager.prototype.getData('mac');

    trajet.locations.sort((a, b) => a.timestamp - b.timestamp);

    trajet.start = trajet.location[0];
    trajet.end = trajet.location[trajet.location - 1];

    delete trajet.locations;

    let data = {mac, trajet};

    console.log('TrackingManager -> data', data);

    return false;

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
