import StorageManager from '../storage/manager';
import {getMacAddress} from 'react-native-device-info';
import backendManager from '../backend/backendManager';

export default {
  async getMac(): Promise<string> {
    let mac = await StorageManager.getData('mac');
    let macSynced = await StorageManager.getData('macSynced');

    let saveCitizen = async (mac: string) => {
      let success = await backendManager.saveCitizen(mac);
      if (success) StorageManager.saveItem('macSynced', 'true');
    };

    if (!mac) {
      mac = await getMacAddress();
      StorageManager.saveItem('mac', mac);
      await saveCitizen(mac);
    } else if (mac && !macSynced) await saveCitizen(mac);

    return mac;
  },
};
