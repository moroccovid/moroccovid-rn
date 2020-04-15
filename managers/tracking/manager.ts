import TrajetService from '../database/services/TrajetService';
import StorageManager from '../storage/manager';
import ConnectivityManager from '../device/connectivity/manager';

export default class TrackingManager {
  async syncTrajet(id: number): Promise<boolean> {
    const connected = await ConnectivityManager.prototype.checkConnection();
    if (!connected) return false;

    const trajet = await TrajetService.prototype.get(id);
    const number = await StorageManager.prototype.getData('number');

    let data = {number, trajet};

    console.log('TrackingManager -> syncTrajet -> data', data);
    //TODO: send data

    await TrajetService.prototype.synced(id);
    return true;
  }
}
