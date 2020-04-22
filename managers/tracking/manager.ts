import TrajetService from '../database/services/TrajetService';
import StorageManager from '../storage/manager';
import ConnectivityManager from '../device/connectivity/connectivityManager';
import backendManager from '../backend/backendManager';
import {ToastAndroid} from 'react-native';
export default class TrackingManager {
  async syncTrajet(id: number): Promise<boolean> {
    const connected = await ConnectivityManager.checkConnection();
    if (!connected) {
      ToastAndroid.show('Pas de connexion Internet', ToastAndroid.LONG);
      return false;
    }

    const trajet = await TrajetService.prototype.get(id);
    const mac = await StorageManager.getData('mac');

    trajet.locations.sort((a, b) => a.timestamp - b.timestamp);

    let path = {
      start: trajet.locations[0],
      end: trajet.locations[trajet.locations.length - 1],
      detects: trajet.detects,
    };

    let data = {mac, path};

    let cloudID = await backendManager.path.savePath(data);
    if (cloudID.length === 0) return false;

    await TrajetService.prototype.synced(id, cloudID);
    return true;
  }
}
