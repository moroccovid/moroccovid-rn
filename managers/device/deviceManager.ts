import StorageManager from '../storage/storageManager';
import {getMacAddress} from 'react-native-device-info';
import backendManager from '../backend/backendManager';
import {ToastAndroid} from 'react-native';

export default {
  async getMac(): Promise<string> {
    let mac = await StorageManager.getData('mac');
    let macSynced = await StorageManager.getData('macSynced');

    let saveCitizen = async (mac: string) => {
      let success = await backendManager.citizen.saveCitizen(mac);
      if (success) StorageManager.saveItem('macSynced', 'true');
    };

    if (!mac) {
      mac = await getMacAddress();
      StorageManager.saveItem('mac', mac);
      await saveCitizen(mac);
    } else if (mac && !macSynced) await saveCitizen(mac);

    console.log('mac', mac);
    return mac;
  },
};
