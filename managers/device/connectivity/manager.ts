import NetInfo from '@react-native-community/netinfo';

export default class ConnectivityManager {
  async checkConnection(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.isConnected;
  }
}
