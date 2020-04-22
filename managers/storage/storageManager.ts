import AsyncStorage from '@react-native-community/async-storage';

export default {
  async saveItem(key: string, value: string) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('AsyncStorage Error: ' + error.message);
    }
  },
  async getData(key: string) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (e) {
      // error reading value
      return 'err';
    }
  },
  async clearItem(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      // error reading value
      return 'err';
    }
  },
};
