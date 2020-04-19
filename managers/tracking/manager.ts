import TrajetService from '../database/services/TrajetService';
import StorageManager from '../storage/manager';
import ConnectivityManager from '../device/connectivity/manager';
import axios, {AxiosResponse, AxiosError} from 'axios';
export default class TrackingManager {
  async syncTrajet(id: number): Promise<boolean> {
    const connected = await ConnectivityManager.prototype.checkConnection();
    if (!connected) return false;

    const trajet = await TrajetService.prototype.get(id);
    const mac = await StorageManager.prototype.getData('mac');

    trajet.locations.sort((a, b) => a.timestamp - b.timestamp);

    let path = {
      start: trajet.locations[0],
      end: trajet.locations[trajet.locations.length - 1],
      detects: trajet.detects,
    };

    let data = {mac, path};

    console.log('TrackingManager -> data', JSON.stringify(data));

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
