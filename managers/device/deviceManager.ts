import StorageManager from '../storage/storageManager';
import {getDeviceName, getMacAddress} from 'react-native-device-info';
import backendManager from '../backend/backendManager';
import {ToastAndroid, NativeModules} from 'react-native';
import RNBluetoothClassic, {
  BTEvents,
  BTCharsets,
} from 'react-native-bluetooth-classic';
import {resolve} from 'dns';
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

  async changeName() {
    try {
      await RNBluetoothClassic.requestEnable();
      const mac = await getMacAddress();
      const resp = await NativeModules.ChangeDeviceName.setName(mac);
      console.log('Resp', resp);
    } catch (error) {
      console.log('Error at generateMac:', error);
    }
  },
};
