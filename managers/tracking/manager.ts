import TrajetService from '../database/services/TrajetService';
import StorageManager from '../storage/manager';

export default class TrackingManager {
  async syncTrajet(id: number) {
    const trajet = await TrajetService.prototype.get(id);
    const number = await StorageManager.prototype.getData('number');

    let data = {number, trajet};

    console.log('TrackingManager -> syncTrajet -> data', data);
    //TODO: send data

    await TrajetService.prototype.synced(id);
  }
}
